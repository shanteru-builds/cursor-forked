import assert from "node:assert/strict";
import test from "node:test";

import { filterPlaces, getAllDishes, getCuisineOptions, pickSurprise } from "../src/app.js";
import { places } from "../src/data.js";

const baseFilters = {
  query: "",
  mood: "all",
  cuisine: "all",
  sort: "distance"
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

test("all dishes include place metadata", () => {
  const [dish] = getAllDishes(places);

  assert.equal(dish.placeName, "Miso Moon");
  assert.equal(dish.cuisine, "Japanese");
  assert.equal(typeof dish.minutes, "number");
});
