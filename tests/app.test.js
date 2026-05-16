import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateDistanceMiles,
  filterPlaces,
  getAllDishes,
  getCuisineOptions,
  getDishAllergyStatus,
  getJournalStats,
  getPlaceMetrics,
  pickSurprise
} from "../src/app.js";
import { foodStories, places } from "../src/data.js";

const baseFilters = {
  query: "",
  mood: "all",
  cuisine: "all",
  sort: "distance",
  avoidAllergens: [],
  userLocation: null
};

test("returns cuisine options alphabetically", () => {
  assert.deepEqual(getCuisineOptions(places), [
    "Japanese",
    "Mediterranean",
    "Mexican",
    "Pizza",
    "Southern",
    "Vietnamese"
  ]);
});

test("filters places by mood across place and dish tags", () => {
  const results = filterPlaces(places, {
    ...baseFilters,
    mood: "vegetarian"
  });

  assert.ok(results.length > 0);
  assert.ok(
    results.every(
      (place) =>
        place.tags.includes("vegetarian") ||
        place.dishes.some((dish) => dish.tags.includes("vegetarian"))
    )
  );
});

test("filters places by searchable dish text", () => {
  const results = filterPlaces(places, {
    ...baseFilters,
    query: "ramen"
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].name, "Miso Moon");
});

test("sorts by highest rating", () => {
  const results = filterPlaces(places, {
    ...baseFilters,
    sort: "rating"
  });

  assert.equal(results[0].name, "Butter Bird");
});

test("surprise picks from the current filtered dishes", () => {
  const recommendation = pickSurprise(
    places,
    {
      ...baseFilters,
      cuisine: "Mexican",
      mood: "quick"
    },
    () => 0
  );

  assert.equal(recommendation.placeName, "Verde Street");
  assert.equal(recommendation.name, "Al Pastor Tacos");
});

test("allergy filtering only keeps places with at least one safer dish", () => {
  const results = filterPlaces(places, {
    ...baseFilters,
    avoidAllergens: ["dairy"]
  });
  const names = results.map((place) => place.name);

  assert.ok(names.includes("Miso Moon"));
  assert.ok(names.includes("Grain & Good"));
  assert.ok(!names.includes("Verde Street"));
  assert.ok(!names.includes("Butter Bird"));
  assert.ok(!names.includes("Slice Social"));
});

test("dish allergy status separates contains, caution, clear, and unknown", () => {
  const [ramen] = places[0].dishes;
  const [tacos] = places[1].dishes;
  const [pho] = places[4].dishes;

  assert.equal(getDishAllergyStatus(ramen, ["soy"]).level, "contains");
  assert.equal(getDishAllergyStatus(tacos, ["soy"]).level, "caution");
  assert.equal(getDishAllergyStatus(tacos, ["dairy"]).level, "unknown");
  assert.equal(getDishAllergyStatus(ramen, ["dairy"]).level, "clear");
  assert.equal(getDishAllergyStatus(ramen).level, "neutral");
  assert.equal(getDishAllergyStatus(pho, ["fish"]).label, "Contains fish");
});

test("distance metrics use user coordinates when available", () => {
  const userLocation = {
    lat: 37.7898,
    lng: -122.4019
  };
  const metrics = getPlaceMetrics(places[0], userLocation);

  assert.equal(calculateDistanceMiles(userLocation, places[0].coordinates), 0);
  assert.equal(metrics.distanceLabel, "0.0 mi");
  assert.equal(metrics.minutes, 1);
});

test("journal stats summarize scrollable food stories", () => {
  const stats = getJournalStats(foodStories);

  assert.equal(stats.storyCount, 4);
  assert.equal(stats.placeCount, 4);
  assert.ok(stats.tagCount >= 8);
});

test("all dishes include place metadata", () => {
  const [dish] = getAllDishes(places);

  assert.equal(dish.placeName, "Miso Moon");
  assert.equal(dish.cuisine, "Japanese");
  assert.equal(dish.address, "321 Market Street, San Francisco, CA");
  assert.deepEqual(dish.coordinates, {
    lat: 37.7898,
    lng: -122.4019
  });
  assert.equal(typeof dish.minutes, "number");
});
