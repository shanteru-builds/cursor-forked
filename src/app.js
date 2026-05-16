import { moods, places } from "./data.js";

const state = {
  query: "",
  mood: "all",
  cuisine: "all",
  sort: "distance"
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
      distance: place.distance,
      minutes: place.minutes,
      rating: place.rating,
      price: place.price
    }))
  );
}

export function filterPlaces(placeList, filters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

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
        place.vibe,
        ...place.tags,
        ...place.dishes.flatMap((dish) => [
          dish.name,
          dish.description,
          ...dish.tags
        ])
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesCuisine && matchesMood && matchesSearch;
    })
    .sort((first, second) => {
      if (filters.sort === "rating") {
        return second.rating - first.rating;
      }

      if (filters.sort === "name") {
        return first.name.localeCompare(second.name);
      }

      return first.minutes - second.minutes;
    });
}

export function pickSurprise(placeList, filters, random = Math.random) {
  const filteredPlaces = filterPlaces(placeList, filters);
  const dishOptions = getAllDishes(filteredPlaces).filter(
    (dish) => filters.mood === "all" || dish.tags.includes(filters.mood)
  );

  if (dishOptions.length === 0) {
    return null;
  }

  return dishOptions[Math.floor(random() * dishOptions.length)];
}

function createDishTag(tag) {
  return `<span>${tag}</span>`;
}

function renderPlaceCard(place) {
  const dishMarkup = place.dishes
    .map(
      (dish) => `
        <article class="dish-card">
          <div>
            <h4>${dish.name}</h4>
            <p>${dish.description}</p>
          </div>
          <div class="tag-row">${dish.tags.map(createDishTag).join("")}</div>
        </article>
      `
    )
    .join("");

  return `
    <article class="place-card">
      <div class="place-card__header">
        <div>
          <p class="eyebrow">${place.cuisine} • ${place.neighborhood}</p>
          <h3>${place.name}</h3>
        </div>
        <div class="rating" aria-label="${place.rating} out of 5 stars">★ ${place.rating}</div>
      </div>
      <p class="vibe">${place.vibe}</p>
      <div class="meta-row">
        <span>${place.distance}</span>
        <span>${place.minutes} min</span>
        <span>${place.price}</span>
      </div>
      <div class="tag-row">${place.tags.map(createDishTag).join("")}</div>
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
    <h3>${recommendation.name}</h3>
    <p>${recommendation.description}</p>
    <div class="meta-row">
      <span>${recommendation.placeName}</span>
      <span>${recommendation.minutes} min</span>
      <span>${recommendation.price}</span>
    </div>
  `;
}

function update(documentRef) {
  const filteredPlaces = filterPlaces(places, state);
  renderPlaces(documentRef, filteredPlaces);
  renderSurprise(documentRef, pickSurprise(places, state));
}

function setActiveChip(documentRef) {
  documentRef.querySelectorAll("[data-mood]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mood === state.mood);
  });
}

function init(documentRef = document) {
  const moodFilters = documentRef.querySelector("[data-mood-filters]");
  const cuisineSelect = documentRef.querySelector("[data-cuisine]");
  const searchInput = documentRef.querySelector("[data-search]");
  const sortSelect = documentRef.querySelector("[data-sort]");
  const surpriseButton = documentRef.querySelector("[data-surprise-button]");

  moodFilters.innerHTML = ["all", ...moods]
    .map(
      (mood) =>
        `<button class="chip${
          mood === state.mood ? " is-active" : ""
        }" type="button" data-mood="${mood}">${mood}</button>`
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

  update(documentRef);
}

if (typeof document !== "undefined") {
  init(document);
}
