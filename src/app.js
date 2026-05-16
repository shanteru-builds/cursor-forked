import { allergens, moods, places } from "./data.js";

const state = {
  query: "",
  mood: "all",
  cuisine: "all",
  sort: "distance",
  avoidAllergens: [],
  userLocation: null
};

const mapRuntime = {
  map: null,
  markerLayer: null,
  userMarker: null
};

export function getCuisineOptions(placeList = places) {
  return [...new Set(placeList.map((place) => place.cuisine))].sort();
}

export function getAllDishes(placeList = places) {
  return placeList.flatMap((place) =>
    place.dishes.map((dish) => ({
      ...dish,
      placeId: place.id,
      placeName: place.name,
      cuisine: place.cuisine,
      neighborhood: place.neighborhood,
      address: place.address,
      coordinates: place.coordinates,
      distance: place.distance,
      minutes: place.minutes,
      rating: place.rating,
      price: place.price
    }))
  );
}

export function calculateDistanceMiles(origin, destination) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latDelta = toRadians(destination.lat - origin.lat);
  const lngDelta = toRadians(destination.lng - origin.lng);
  const originLat = toRadians(origin.lat);
  const destinationLat = toRadians(destination.lat);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(originLat) *
      Math.cos(destinationLat) *
      Math.sin(lngDelta / 2) ** 2;

  return (
    earthRadiusMiles * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

export function getPlaceMetrics(place, userLocation = null) {
  if (!userLocation) {
    return {
      distanceLabel: place.distance,
      minutes: place.minutes
    };
  }

  const distanceMiles = calculateDistanceMiles(userLocation, place.coordinates);

  return {
    distanceMiles,
    distanceLabel: `${distanceMiles.toFixed(distanceMiles < 10 ? 1 : 0)} mi`,
    minutes: Math.max(1, Math.round(distanceMiles * 20))
  };
}

export function getDishAllergyStatus(dish, avoidAllergens = []) {
  const selectedAllergens = avoidAllergens.map((allergen) => allergen.toLowerCase());
  const directMatches = dish.allergens.filter((allergen) =>
    selectedAllergens.includes(allergen)
  );
  const possibleMatches = dish.mayContain.filter((allergen) =>
    selectedAllergens.includes(allergen)
  );

  if (directMatches.length > 0) {
    return {
      level: "contains",
      label: `Contains ${directMatches.join(", ")}`
    };
  }

  if (possibleMatches.length > 0) {
    return {
      level: "caution",
      label: `May contain ${possibleMatches.join(", ")}`
    };
  }

  if (selectedAllergens.length > 0 && dish.allergyConfidence === "needs-confirmation") {
    return {
      level: "unknown",
      label: "Ask restaurant to confirm"
    };
  }

  if (selectedAllergens.length > 0) {
    return {
      level: "clear",
      label: "No selected allergens listed"
    };
  }

  return {
    level: "neutral",
    label: "Allergy info available"
  };
}

export function hasAllergySafeDish(place, avoidAllergens = []) {
  if (avoidAllergens.length === 0) {
    return true;
  }

  return place.dishes.some(
    (dish) => getDishAllergyStatus(dish, avoidAllergens).level === "clear"
  );
}

export function filterPlaces(placeList, filters) {
  const normalizedQuery = (filters.query ?? "").trim().toLowerCase();
  const avoidAllergens = filters.avoidAllergens ?? [];
  const userLocation = filters.userLocation ?? null;

  return placeList
    .filter((place) => {
      const matchesCuisine =
        filters.cuisine === "all" || place.cuisine === filters.cuisine;
      const matchesMood =
        filters.mood === "all" ||
        place.tags.includes(filters.mood) ||
        place.dishes.some((dish) => dish.tags.includes(filters.mood));
      const searchableText = [
        place.name,
        place.cuisine,
        place.neighborhood,
        place.address,
        place.hours,
        place.vibe,
        place.reviewSummary,
        ...place.tags,
        ...place.dishes.flatMap((dish) => [
          dish.name,
          dish.description,
          ...dish.tags,
          ...dish.dietary,
          ...dish.allergens,
          ...dish.mayContain
        ])
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return (
        matchesCuisine &&
        matchesMood &&
        matchesSearch &&
        hasAllergySafeDish(place, avoidAllergens)
      );
    })
    .sort((first, second) => {
      if (filters.sort === "rating") {
        return second.rating - first.rating;
      }

      if (filters.sort === "name") {
        return first.name.localeCompare(second.name);
      }

      if (userLocation) {
        return (
          calculateDistanceMiles(userLocation, first.coordinates) -
          calculateDistanceMiles(userLocation, second.coordinates)
        );
      }

      return first.minutes - second.minutes;
    });
}

export function pickSurprise(placeList, filters, random = Math.random) {
  const filteredPlaces = filterPlaces(placeList, filters);
  const avoidAllergens = filters.avoidAllergens ?? [];
  const dishOptions = getAllDishes(filteredPlaces).filter((dish) => {
    const matchesMood = filters.mood === "all" || dish.tags.includes(filters.mood);
    const matchesAllergies =
      avoidAllergens.length === 0 ||
      getDishAllergyStatus(dish, avoidAllergens).level === "clear";

    return matchesMood && matchesAllergies;
  });

  if (dishOptions.length === 0) {
    return null;
  }

  return dishOptions[Math.floor(random() * dishOptions.length)];
}

function createDishTag(tag) {
  return `<span>${tag}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatList(items) {
  return items.length > 0 ? items.join(", ") : "none listed";
}

function createDirectionsUrl(place) {
  const destination = `${place.coordinates.lat},${place.coordinates.lng}`;

  if (!state.userLocation) {
    return `https://www.openstreetmap.org/directions?to=${encodeURIComponent(
      destination
    )}#map=16/${place.coordinates.lat}/${place.coordinates.lng}`;
  }

  return `https://www.openstreetmap.org/directions?from=${encodeURIComponent(
    `${state.userLocation.lat},${state.userLocation.lng}`
  )}&to=${encodeURIComponent(destination)}`;
}

function renderAllergyBadges(dish) {
  const status = getDishAllergyStatus(dish, state.avoidAllergens);
  const dietaryMarkup =
    dish.dietary.length > 0
      ? `<span class="allergy-badge">${escapeHtml(dish.dietary.join(", "))}</span>`
      : "";

  return `
    <div class="allergy-row">
      <span class="allergy-badge allergy-badge--${status.level}">${escapeHtml(
        status.label
      )}</span>
      ${dietaryMarkup}
      <span class="allergy-badge">Contains: ${escapeHtml(
        formatList(dish.allergens)
      )}</span>
      <span class="allergy-badge">May contain: ${escapeHtml(
        formatList(dish.mayContain)
      )}</span>
      <span class="allergy-badge">Source: ${escapeHtml(
        dish.allergyConfidence.replaceAll("-", " ")
      )}</span>
    </div>
  `;
}

function renderPlaceCard(place) {
  const metrics = getPlaceMetrics(place, state.userLocation);
  const safeDishCount = state.avoidAllergens.length
    ? place.dishes.filter(
        (dish) => getDishAllergyStatus(dish, state.avoidAllergens).level === "clear"
      ).length
    : null;
  const dishMarkup = place.dishes
    .map(
      (dish) => `
        <article class="dish-card dish-card--${getDishAllergyStatus(
          dish,
          state.avoidAllergens
        ).level}">
          <div>
            <h4>${escapeHtml(dish.name)}</h4>
            <p>${escapeHtml(dish.description)}</p>
          </div>
          <div class="tag-row">${dish.tags.map(createDishTag).join("")}</div>
          ${renderAllergyBadges(dish)}
        </article>
      `
    )
    .join("");

  return `
    <article class="place-card" id="${place.id}">
      <div class="place-card__header">
        <div>
          <p class="eyebrow">${escapeHtml(place.cuisine)} • ${escapeHtml(
            place.neighborhood
          )}</p>
          <h3>${escapeHtml(place.name)}</h3>
        </div>
        <div class="rating" aria-label="${place.rating} out of 5 stars">★ ${
          place.rating
        }</div>
      </div>
      <p class="vibe">${escapeHtml(place.vibe)}</p>
      <address>${escapeHtml(place.address)}</address>
      <div class="meta-row">
        <span>${metrics.distanceLabel}</span>
        <span>${metrics.minutes} min walk</span>
        <span>${escapeHtml(place.hours)}</span>
        <span>${escapeHtml(place.price)}</span>
      </div>
      <p class="review-summary">${escapeHtml(place.reviewSummary)}</p>
      <div class="meta-row">
        <span>${place.reviewCount} reviews</span>
        <span>${escapeHtml(place.reviewSource)}</span>
        ${
          safeDishCount === null
            ? ""
            : `<span>${safeDishCount} safer dish${
                safeDishCount === 1 ? "" : "es"
              } for selected allergies</span>`
        }
      </div>
      <div class="tag-row">${place.tags.map(createDishTag).join("")}</div>
      <a class="directions-link" href="${createDirectionsUrl(
        place
      )}" target="_blank" rel="noreferrer">Open directions</a>
      <div class="dish-list">${dishMarkup}</div>
    </article>
  `;
}

function renderPlaces(documentRef, filteredPlaces) {
  const results = documentRef.querySelector("[data-results]");
  const count = documentRef.querySelector("[data-result-count]");

  count.textContent = `${filteredPlaces.length} place${
    filteredPlaces.length === 1 ? "" : "s"
  } nearby`;

  if (filteredPlaces.length === 0) {
    results.innerHTML = `
      <section class="empty-state">
        <h3>No perfect match yet</h3>
        <p>Try a different mood, cuisine, or search term to open up more options.</p>
      </section>
    `;
    return;
  }

  results.innerHTML = filteredPlaces.map(renderPlaceCard).join("");
}

function renderSurprise(documentRef, recommendation) {
  const surprise = documentRef.querySelector("[data-surprise]");

  if (!recommendation) {
    surprise.innerHTML = `
      <p class="eyebrow">Quick pick</p>
      <h3>Nothing matches this combo</h3>
      <p>Clear a filter and let Forked find something tasty.</p>
    `;
    return;
  }

  surprise.innerHTML = `
    <p class="eyebrow">Quick pick</p>
    <h3>${escapeHtml(recommendation.name)}</h3>
    <p>${escapeHtml(recommendation.description)}</p>
    <div class="meta-row">
      <span>${escapeHtml(recommendation.placeName)}</span>
      <span>${escapeHtml(recommendation.neighborhood)}</span>
      <span>${escapeHtml(recommendation.price)}</span>
    </div>
  `;
}

function getMapCenter(placeList) {
  const totals = placeList.reduce(
    (accumulator, place) => ({
      lat: accumulator.lat + place.coordinates.lat,
      lng: accumulator.lng + place.coordinates.lng
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: totals.lat / placeList.length,
    lng: totals.lng / placeList.length
  };
}

function initMap(documentRef) {
  const mapElement = documentRef.querySelector("[data-map]");

  if (!mapElement || typeof window === "undefined" || !window.L) {
    return false;
  }

  if (mapRuntime.map) {
    return true;
  }

  const center = getMapCenter(places);
  mapRuntime.map = window.L.map(mapElement, {
    scrollWheelZoom: false
  }).setView([center.lat, center.lng], 13);

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapRuntime.map);

  mapRuntime.markerLayer = window.L.layerGroup().addTo(mapRuntime.map);

  return true;
}

function renderMap(documentRef, filteredPlaces) {
  if (!initMap(documentRef)) {
    return;
  }

  mapRuntime.markerLayer.clearLayers();

  const bounds = filteredPlaces.map((place) => [
    place.coordinates.lat,
    place.coordinates.lng
  ]);

  filteredPlaces.forEach((place) => {
    const metrics = getPlaceMetrics(place, state.userLocation);
    const popupMarkup = `
      <strong>${escapeHtml(place.name)}</strong><br />
      ${escapeHtml(place.address)}<br />
      ${metrics.distanceLabel} • ${metrics.minutes} min walk
    `;

    window.L.marker([place.coordinates.lat, place.coordinates.lng])
      .addTo(mapRuntime.markerLayer)
      .bindPopup(popupMarkup);
  });

  if (state.userLocation) {
    const userLatLng = [state.userLocation.lat, state.userLocation.lng];
    bounds.push(userLatLng);

    if (!mapRuntime.userMarker) {
      mapRuntime.userMarker = window.L.circleMarker(userLatLng, {
        radius: 8,
        color: "#2f1f19",
        fillColor: "#f35b2f",
        fillOpacity: 0.9
      })
        .addTo(mapRuntime.map)
        .bindPopup("You are here");
    } else {
      mapRuntime.userMarker.setLatLng(userLatLng);
    }
  }

  if (bounds.length > 0) {
    mapRuntime.map.fitBounds(bounds, {
      padding: [34, 34],
      maxZoom: 15
    });
  }
}

function update(documentRef) {
  const filteredPlaces = filterPlaces(places, state);
  renderPlaces(documentRef, filteredPlaces);
  renderMap(documentRef, filteredPlaces);
  renderSurprise(documentRef, pickSurprise(places, state));
}

function setActiveChip(documentRef) {
  documentRef.querySelectorAll("[data-mood]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mood === state.mood);
  });
}

function setActiveAllergyChips(documentRef) {
  documentRef.querySelectorAll("[data-allergen]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      state.avoidAllergens.includes(button.dataset.allergen)
    );
  });
}

function setLocationStatus(documentRef, message) {
  const status = documentRef.querySelector("[data-location-status]");

  if (status) {
    status.textContent = message;
  }
}

function init(documentRef = document) {
  const moodFilters = documentRef.querySelector("[data-mood-filters]");
  const allergyFilters = documentRef.querySelector("[data-allergy-filters]");
  const cuisineSelect = documentRef.querySelector("[data-cuisine]");
  const searchInput = documentRef.querySelector("[data-search]");
  const sortSelect = documentRef.querySelector("[data-sort]");
  const surpriseButton = documentRef.querySelector("[data-surprise-button]");
  const locationButton = documentRef.querySelector("[data-location-button]");

  moodFilters.innerHTML = ["all", ...moods]
    .map(
      (mood) =>
        `<button class="chip${
          mood === state.mood ? " is-active" : ""
        }" type="button" data-mood="${mood}">${mood}</button>`
    )
    .join("");

  allergyFilters.innerHTML = allergens
    .map(
      (allergen) =>
        `<button class="chip" type="button" data-allergen="${allergen}">${allergen}</button>`
    )
    .join("");

  cuisineSelect.innerHTML = ["all", ...getCuisineOptions()]
    .map((cuisine) => `<option value="${cuisine}">${cuisine}</option>`)
    .join("");

  moodFilters.addEventListener("click", (event) => {
    const selectedMood = event.target.closest("[data-mood]");
    if (!selectedMood) {
      return;
    }

    state.mood = selectedMood.dataset.mood;
    setActiveChip(documentRef);
    update(documentRef);
  });

  allergyFilters.addEventListener("click", (event) => {
    const selectedAllergen = event.target.closest("[data-allergen]");
    if (!selectedAllergen) {
      return;
    }

    const allergen = selectedAllergen.dataset.allergen;
    state.avoidAllergens = state.avoidAllergens.includes(allergen)
      ? state.avoidAllergens.filter((item) => item !== allergen)
      : [...state.avoidAllergens, allergen];

    setActiveAllergyChips(documentRef);
    update(documentRef);
  });

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    update(documentRef);
  });

  cuisineSelect.addEventListener("change", (event) => {
    state.cuisine = event.target.value;
    update(documentRef);
  });

  sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    update(documentRef);
  });

  surpriseButton.addEventListener("click", () => {
    renderSurprise(documentRef, pickSurprise(places, state));
  });

  locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      setLocationStatus(documentRef, "Location is not available in this browser.");
      return;
    }

    setLocationStatus(documentRef, "Checking your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        state.sort = "distance";
        sortSelect.value = "distance";
        setLocationStatus(documentRef, "Using your location for distance sorting.");
        update(documentRef);
      },
      () => {
        setLocationStatus(
          documentRef,
          "Location permission was not granted. Showing sample distances."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  });

  update(documentRef);
}

if (typeof document !== "undefined") {
  init(document);
}
