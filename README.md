# Forked

A simple food discovery app to help you find what to eat nearby fast. Browse
places, explore dishes, filter by craving, and decide without overthinking.

## Features

- Curated nearby restaurant and dish cards
- Search across places, cuisines, neighborhoods, dishes, and tags
- Mood filters for quick, comfort, healthy, vegetarian, spicy, budget, group, and solo picks
- Cuisine and sorting controls
- Leaflet/OpenStreetMap map with place markers, addresses, directions links, and browser location sorting
- Owned allergy metadata with conservative allergen filters and dish safety badges
- Community-style review counts and summaries without scraped Google review data
- "Surprise me" recommendation for fast decisions
- Responsive, dependency-free static frontend

## Data approach

The MVP uses sample restaurant data in `src/data.js`. It is structured so a
future provider such as Foursquare or Yelp can hydrate place details, while
Forked owns dish, allergen, and food-specific review metadata.

Allergy information is intentionally conservative: if a dish needs restaurant
confirmation, it is not counted as a safer match for selected allergy filters.
Users should still confirm allergy safety directly with the restaurant.

## Run locally

```bash
npm start
```

Then open <http://localhost:4173>.

## Validate

```bash
npm run lint
npm test
```
