export const places = [
  {
    id: "miso-moon",
    name: "Miso Moon",
    cuisine: "Japanese",
    neighborhood: "Downtown",
    address: "321 Market Street, San Francisco, CA",
    coordinates: {
      lat: 37.7898,
      lng: -122.4019
    },
    hours: "Open until 10 PM",
    distance: "0.4 mi",
    minutes: 8,
    rating: 4.8,
    reviewCount: 184,
    reviewSource: "Forked community",
    reviewSummary: "Fast ramen bowls, reliable solo seating, and strong late-lunch reviews.",
    price: "$$",
    vibe: "Cozy counter seats, fast service, warm bowls",
    tags: ["comfort", "quick", "solo"],
    dishes: [
      {
        name: "Spicy Miso Ramen",
        description: "Rich miso broth, chili oil, jammy egg, sweet corn",
        tags: ["comfort", "spicy", "dinner"],
        dietary: [],
        allergens: ["egg", "soy", "wheat"],
        mayContain: ["sesame"],
        allergyConfidence: "restaurant-confirmed"
      },
      {
        name: "Chicken Katsu Sando",
        description: "Crispy chicken cutlet, cabbage, tonkatsu sauce",
        tags: ["quick", "lunch", "crispy"],
        dietary: [],
        allergens: ["egg", "soy", "wheat"],
        mayContain: [],
        allergyConfidence: "menu-reviewed"
      }
    ]
  },
  {
    id: "verde-street",
    name: "Verde Street",
    cuisine: "Mexican",
    neighborhood: "Arts District",
    address: "55 Natoma Street, San Francisco, CA",
    coordinates: {
      lat: 37.7871,
      lng: -122.3997
    },
    hours: "Open until 11 PM",
    distance: "0.7 mi",
    minutes: 12,
    rating: 4.7,
    reviewCount: 231,
    reviewSource: "Forked community",
    reviewSummary: "Best for quick tacos, patio groups, and budget-friendly lunches.",
    price: "$",
    vibe: "Bright taqueria with patio tables and quick pickup",
    tags: ["quick", "group", "budget"],
    dishes: [
      {
        name: "Al Pastor Tacos",
        description: "Pineapple-marinated pork, salsa verde, cilantro",
        tags: ["quick", "spicy", "budget"],
        dietary: [],
        allergens: [],
        mayContain: ["soy"],
        allergyConfidence: "needs-confirmation"
      },
      {
        name: "Mushroom Quesadilla",
        description: "Oaxaca cheese, roasted mushrooms, poblano crema",
        tags: ["vegetarian", "comfort", "lunch"],
        dietary: ["vegetarian"],
        allergens: ["dairy", "wheat"],
        mayContain: [],
        allergyConfidence: "menu-reviewed"
      }
    ]
  },
  {
    id: "grain-good",
    name: "Grain & Good",
    cuisine: "Mediterranean",
    neighborhood: "Market Row",
    address: "1 Ferry Building, San Francisco, CA",
    coordinates: {
      lat: 37.7955,
      lng: -122.3937
    },
    hours: "Open until 8 PM",
    distance: "0.5 mi",
    minutes: 10,
    rating: 4.6,
    reviewCount: 156,
    reviewSource: "Forked community",
    reviewSummary: "Custom bowls make it easier to avoid ingredients and keep lunch light.",
    price: "$$",
    vibe: "Fresh bowls, lots of greens, easy customization",
    tags: ["healthy", "quick", "vegetarian"],
    dishes: [
      {
        name: "Harissa Chicken Bowl",
        description: "Charred chicken, couscous, cucumber, lemon tahini",
        tags: ["healthy", "spicy", "lunch"],
        dietary: [],
        allergens: ["sesame", "wheat"],
        mayContain: ["dairy"],
        allergyConfidence: "restaurant-confirmed"
      },
      {
        name: "Falafel Mezze Plate",
        description: "Herby falafel, hummus, tabbouleh, warm pita",
        tags: ["vegetarian", "healthy", "shareable"],
        dietary: ["vegetarian"],
        allergens: ["sesame", "wheat"],
        mayContain: [],
        allergyConfidence: "restaurant-confirmed"
      }
    ]
  },
  {
    id: "butter-bird",
    name: "Butter Bird",
    cuisine: "Southern",
    neighborhood: "Old Town",
    address: "580 Green Street, San Francisco, CA",
    coordinates: {
      lat: 37.7994,
      lng: -122.4075
    },
    hours: "Open until 9 PM",
    distance: "0.9 mi",
    minutes: 15,
    rating: 4.9,
    reviewCount: 318,
    reviewSource: "Forked community",
    reviewSummary: "Top-rated crispy chicken with clear menu notes for dairy and wheat.",
    price: "$$",
    vibe: "Laid-back chicken shop with crunchy sides",
    tags: ["comfort", "group", "crispy"],
    dishes: [
      {
        name: "Hot Honey Chicken Biscuit",
        description: "Buttermilk biscuit, fried chicken, hot honey drizzle",
        tags: ["comfort", "spicy", "crispy"],
        dietary: [],
        allergens: ["dairy", "egg", "wheat"],
        mayContain: [],
        allergyConfidence: "restaurant-confirmed"
      },
      {
        name: "Mac & Greens Bowl",
        description: "Creamy mac, collards, pickled onions, cornbread crumble",
        tags: ["comfort", "vegetarian", "dinner"],
        dietary: ["vegetarian"],
        allergens: ["dairy", "wheat"],
        mayContain: ["egg"],
        allergyConfidence: "menu-reviewed"
      }
    ]
  },
  {
    id: "little-lotus",
    name: "Little Lotus",
    cuisine: "Vietnamese",
    neighborhood: "Riverside",
    address: "900 Valencia Street, San Francisco, CA",
    coordinates: {
      lat: 37.7586,
      lng: -122.4213
    },
    hours: "Open until 10 PM",
    distance: "1.1 mi",
    minutes: 18,
    rating: 4.5,
    reviewCount: 127,
    reviewSource: "Forked community",
    reviewSummary: "Fresh herbs, helpful staff, and strong vegetarian quick-pick feedback.",
    price: "$",
    vibe: "Steamy noodle soups and fresh herb-heavy plates",
    tags: ["healthy", "budget", "solo"],
    dishes: [
      {
        name: "Beef Pho",
        description: "Slow broth, rice noodles, basil, lime, brisket",
        tags: ["comfort", "healthy", "dinner"],
        dietary: [],
        allergens: ["fish"],
        mayContain: ["soy"],
        allergyConfidence: "needs-confirmation"
      },
      {
        name: "Lemongrass Tofu Banh Mi",
        description: "Crisp baguette, tofu, pickled veg, jalapeno",
        tags: ["vegetarian", "quick", "budget"],
        dietary: ["vegetarian"],
        allergens: ["soy", "wheat"],
        mayContain: ["egg"],
        allergyConfidence: "menu-reviewed"
      }
    ]
  },
  {
    id: "slice-social",
    name: "Slice Social",
    cuisine: "Pizza",
    neighborhood: "University",
    address: "212 Stockton Street, San Francisco, CA",
    coordinates: {
      lat: 37.7885,
      lng: -122.4067
    },
    hours: "Open until midnight",
    distance: "0.6 mi",
    minutes: 11,
    rating: 4.4,
    reviewCount: 205,
    reviewSource: "Forked community",
    reviewSummary: "Good for groups and late slices, but allergy-safe choices are limited.",
    price: "$$",
    vibe: "Big tables, lively playlists, late-night slices",
    tags: ["group", "comfort", "shareable"],
    dishes: [
      {
        name: "Vodka Pepperoni Slice",
        description: "Vodka sauce, cup pepperoni, basil, chili flakes",
        tags: ["comfort", "spicy", "quick"],
        dietary: [],
        allergens: ["dairy", "wheat"],
        mayContain: [],
        allergyConfidence: "menu-reviewed"
      },
      {
        name: "Roasted Veggie Pie",
        description: "Zucchini, peppers, red onion, whipped ricotta",
        tags: ["vegetarian", "shareable", "dinner"],
        dietary: ["vegetarian"],
        allergens: ["dairy", "wheat"],
        mayContain: [],
        allergyConfidence: "menu-reviewed"
      }
    ]
  }
];

export const moods = [
  "quick",
  "comfort",
  "healthy",
  "vegetarian",
  "spicy",
  "budget",
  "group",
  "solo"
];

export const allergens = [
  "peanut",
  "tree nut",
  "shellfish",
  "fish",
  "dairy",
  "egg",
  "soy",
  "wheat",
  "sesame"
];

export const foodStories = [
  {
    id: "ramen-rain-note",
    placeId: "miso-moon",
    title: "rainy day ramen",
    date: "today",
    dish: "Spicy Miso Ramen",
    author: "maya",
    mood: "comfort",
    excerpt:
      "sat at the counter, drew tiny steam clouds, and finally stopped scrolling for dinner.",
    tags: ["comfort", "solo", "spicy"],
    doodle: "steam swirls + egg"
  },
  {
    id: "taco-sidewalk",
    placeId: "verde-street",
    title: "sidewalk taco break",
    date: "yesterday",
    dish: "Al Pastor Tacos",
    author: "leo",
    mood: "quick",
    excerpt:
      "two tacos, one fizzy drink, and a note to come back when the patio lights turn on.",
    tags: ["quick", "budget", "group"],
    doodle: "little lime wedge"
  },
  {
    id: "market-bowl",
    placeId: "grain-good",
    title: "clean bowl, messy notes",
    date: "fri",
    dish: "Falafel Mezze Plate",
    author: "sam",
    mood: "healthy",
    excerpt:
      "marked sesame clearly, saved the tahini on the side, and made a tiny pita map.",
    tags: ["vegetarian", "healthy", "allergy-aware"],
    doodle: "pita triangle map"
  },
  {
    id: "late-slice",
    placeId: "slice-social",
    title: "late slice with friends",
    date: "thu",
    dish: "Vodka Pepperoni Slice",
    author: "nina",
    mood: "group",
    excerpt:
      "big table, loud playlist, everyone picked one slice and rated the crust crunch.",
    tags: ["group", "comfort", "shareable"],
    doodle: "pizza moon"
  }
];
