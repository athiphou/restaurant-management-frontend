const IMG = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const RESTAURANT = {
  name: 'FreshBite',
  tagline: 'Fresh food. Happy moments.',
  phone: '+855 23 555 018',
  email: 'hello@freshbite.com',
  address: '168 Preah Monivong Blvd, Phnom Penh',
  slogan: 'FRESH • FAST • DELICIOUS',
}

export const CATEGORIES = [
  { id: 'burgers', label: 'Burgers', icon: '🍔', img: IMG('1568901346375-23c9450c58cd', 400) },
  { id: 'pizza', label: 'Pizza', icon: '🍕', img: IMG('1513104890138-7c749659a591', 400) },
  { id: 'chicken', label: 'Chicken', icon: '🍗', img: IMG('1598103442097-8b74394b95c6', 400) },
  { id: 'noodles', label: 'Noodles', icon: '🍜', img: IMG('1552611052-33e04de081de', 400) },
  { id: 'rice', label: 'Rice Bowls', icon: '🍚', img: IMG('1546069901-ba9599a7e63c', 400) },
  { id: 'healthy', label: 'Healthy', icon: '🥗', img: IMG('1512621776951-a57141f2eefd', 400) },
  { id: 'desserts', label: 'Desserts', icon: '🍰', img: IMG('1551024506-0bccd828d307', 400) },
  { id: 'drinks', label: 'Drinks', icon: '🥤', img: IMG('1600271886742-f049cd451bba', 400) },
]

export const DISHES = [
  {
    id: 'beef-burger',
    name: 'Beef Burger',
    category: 'burgers',
    description: 'Flame-grilled beef patty, melted cheddar, lettuce, tomato and house sauce on a toasted brioche bun.',
    price: 8.5,
    rating: 4.9,
    reviews: 312,
    tag: 'Most Popular',
    img: IMG('1568901346375-23c9450c58cd'),
    variants: [
      { id: 'single', name: 'Single', priceDelta: 0 },
      { id: 'double', name: 'Double', priceDelta: 3 },
    ],
    addons: [
      { id: 'cheese', name: 'Extra Cheese', price: 1 },
      { id: 'bacon', name: 'Bacon', price: 2 },
      { id: 'sauce', name: 'Extra Sauce', price: 0.5 },
    ],
  },
  {
    id: 'crispy-chicken-burger',
    name: 'Crispy Chicken Burger',
    category: 'burgers',
    description: 'Crunchy fried chicken fillet, slaw, pickles and spicy mayo in a soft brioche bun.',
    price: 7.5,
    rating: 4.8,
    reviews: 264,
    tag: 'Crispy',
    img: IMG('1571091718767-18b5b1457add'),
    variants: [
      { id: 'single', name: 'Single', priceDelta: 0 },
      { id: 'double', name: 'Double', priceDelta: 2.5 },
    ],
    addons: [
      { id: 'cheese', name: 'Extra Cheese', price: 1 },
      { id: 'jalapeno', name: 'Jalapeños', price: 0.5 },
      { id: 'sauce', name: 'Extra Sauce', price: 0.5 },
    ],
  },
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    category: 'pizza',
    description: 'Hand-stretched dough, fresh tomato sauce, mozzarella and basil baked in a wood-fired oven.',
    price: 12,
    rating: 4.8,
    reviews: 198,
    tag: 'Classic',
    img: IMG('1574071318501-1cd2461aaeab'),
    variants: [
      { id: 'medium', name: 'Medium 9"', priceDelta: 0 },
      { id: 'large', name: 'Large 12"', priceDelta: 4 },
      { id: 'family', name: 'Family 16"', priceDelta: 8 },
    ],
    addons: [
      { id: 'mozzarella', name: 'Extra Mozzarella', price: 2 },
      { id: 'basil', name: 'Fresh Basil', price: 1 },
      { id: 'olive', name: 'Olive Oil', price: 0.5 },
    ],
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    category: 'pizza',
    description: 'Loaded with spicy pepperoni, mozzarella and a hint of chili honey.',
    price: 14.5,
    rating: 4.9,
    reviews: 245,
    tag: 'Spicy',
    img: IMG('1513104890138-7c749659a591'),
    variants: [
      { id: 'medium', name: 'Medium 9"', priceDelta: 0 },
      { id: 'large', name: 'Large 12"', priceDelta: 4 },
      { id: 'family', name: 'Family 16"', priceDelta: 8 },
    ],
    addons: [
      { id: 'cheese', name: 'Extra Cheese', price: 2 },
      { id: 'peppers', name: 'Bell Peppers', price: 1 },
      { id: 'mushroom', name: 'Mushrooms', price: 1.5 },
    ],
  },
  {
    id: 'crispy-fried-chicken',
    name: 'Crispy Fried Chicken',
    category: 'chicken',
    description: 'Buttermilk-soaked chicken, double-coated and fried golden with a crunchy crust.',
    price: 6.5,
    rating: 4.7,
    reviews: 187,
    tag: 'Crispy',
    img: IMG('1598103442097-8b74394b95c6'),
    variants: [
      { id: '4pc', name: '4 Pieces', priceDelta: 0 },
      { id: '8pc', name: '8 Pieces', priceDelta: 10 },
    ],
    addons: [
      { id: 'bbq', name: 'BBQ Dip', price: 1 },
      { id: 'hot', name: 'Hot Sauce', price: 0.5 },
      { id: 'fries', name: 'Fries Upgrade', price: 2 },
    ],
  },
  {
    id: 'chicken-wings',
    name: 'Sticky Chicken Wings',
    category: 'chicken',
    description: 'Sweet-sour glazed wings with toasted sesame and spring onion.',
    price: 7,
    rating: 4.6,
    reviews: 142,
    tag: 'Best Seller',
    img: IMG('1608039755401-742074f0548d'),
    variants: [
      { id: '6pc', name: '6 Wings', priceDelta: 0 },
      { id: '12pc', name: '12 Wings', priceDelta: 7 },
    ],
    addons: [
      { id: 'bluecheese', name: 'Blue Cheese Dip', price: 1 },
      { id: 'celery', name: 'Celery Sticks', price: 0.5 },
    ],
  },
  {
    id: 'beef-noodles',
    name: 'Beef Stir-Fry Noodles',
    category: 'noodles',
    description: 'Wok-tossed egg noodles with tender beef, bok choy and garlic soy.',
    price: 9.5,
    rating: 4.8,
    reviews: 176,
    tag: 'Wok Tossed',
    img: IMG('1552611052-33e04de081de'),
    variants: [
      { id: 'regular', name: 'Regular', priceDelta: 0 },
      { id: 'extra-beef', name: 'Extra Beef', priceDelta: 3 },
    ],
    addons: [
      { id: 'egg', name: 'Fried Egg', price: 1 },
      { id: 'chili', name: 'Chili Oil', price: 0.5 },
      { id: 'peanut', name: 'Peanuts', price: 0.5 },
    ],
  },
  {
    id: 'ramen',
    name: 'Tonkotsu Ramen',
    category: 'noodles',
    description: 'Rich pork broth, ramen noodles, chashu, soft egg and nori.',
    price: 11,
    rating: 4.9,
    reviews: 231,
    tag: 'Rich & Warm',
    img: IMG('1569718212165-3a8278d5f624'),
    variants: [
      { id: 'regular', name: 'Regular', priceDelta: 0 },
      { id: 'extra-noodle', name: 'Extra Noodles', priceDelta: 2 },
    ],
    addons: [
      { id: 'egg', name: 'Extra Soft Egg', price: 1.5 },
      { id: 'corn', name: 'Sweet Corn', price: 1 },
      { id: 'butter', name: 'Butter', price: 0.5 },
    ],
  },
  {
    id: 'sambal-rice',
    name: 'Grilled Chicken Rice Bowl',
    category: 'rice',
    description: 'Char-grilled chicken thigh over jasmine rice with sambal and pickled cucumber.',
    price: 8,
    rating: 4.7,
    reviews: 158,
    tag: 'Hearty',
    img: IMG('1546069901-ba9599a7e63c'),
    variants: [
      { id: 'regular', name: 'Regular', priceDelta: 0 },
      { id: 'extra-rice', name: 'Extra Rice', priceDelta: 1.5 },
    ],
    addons: [
      { id: 'egg', name: 'Fried Egg', price: 1 },
      { id: 'sambal', name: 'Extra Sambal', price: 0.5 },
      { id: 'veggies', name: 'Extra Veggies', price: 1 },
    ],
  },
  {
    id: 'garden-salad',
    name: 'Garden Harvest Salad',
    category: 'healthy',
    description: 'Avocado, quinoa, chickpeas, roast squash and herbed tahini dressing.',
    price: 9,
    rating: 4.7,
    reviews: 121,
    tag: 'Fresh',
    img: IMG('1512621776951-a57141f2eefd'),
    variants: [
      { id: 'regular', name: 'Regular', priceDelta: 0 },
      { id: 'protein', name: 'Add Grilled Tofu', priceDelta: 2.5 },
    ],
    addons: [
      { id: 'avocado', name: 'Extra Avocado', price: 2 },
      { id: 'seeds', name: 'Toasted Seeds', price: 1 },
      { id: 'dressing', name: 'Extra Dressing', price: 0.5 },
    ],
  },
  {
    id: 'sundae',
    name: 'Chocolate Sundae',
    category: 'desserts',
    description: 'Vanilla soft serve, warm chocolate fudge, roasted hazelnuts and a cherry on top.',
    price: 4.5,
    rating: 4.8,
    reviews: 203,
    tag: 'Sweet',
    img: IMG('1551024506-0bccd828d307'),
    variants: [
      { id: 'small', name: 'Small', priceDelta: 0 },
      { id: 'large', name: 'Large', priceDelta: 2 },
    ],
    addons: [
      { id: 'fudge', name: 'Extra Fudge', price: 0.5 },
      { id: 'nuts', name: 'Extra Nuts', price: 0.5 },
    ],
  },
  {
    id: 'fresh-orange-juice',
    name: 'Fresh Orange Juice',
    category: 'drinks',
    description: 'Cold-pressed oranges, no added sugar. Served over ice.',
    price: 3,
    rating: 4.6,
    reviews: 98,
    tag: 'Cold',
    img: IMG('1600271886742-f049cd451bba'),
    variants: [
      { id: 'regular', name: '330ml', priceDelta: 0 },
      { id: 'large', name: '500ml', priceDelta: 1.5 },
    ],
    addons: [
      { id: 'ice', name: 'Extra Ice', price: 0 },
      { id: 'mint', name: 'Fresh Mint', price: 0.5 },
    ],
  },
]

export const BRANCHES = [
  {
    id: 'riverside',
    name: 'FreshBite Riverside',
    city: 'Phnom Penh',
    address: '168 Preah Monivong Blvd, Phnom Penh',
    hours: '10:00 – 22:00',
    phone: '+855 23 555 018',
    distance: '0.8 km',
    open: true,
    lat: 11.5686,
    lng: 104.9169,
    img: IMG('1517248135467-4c7edcad34c4', 700),
  },
  {
    id: 'toul-kork',
    name: 'FreshBite Toul Kork',
    city: 'Phnom Penh',
    address: '32 Street 315, Phnom Penh',
    hours: '10:00 – 22:00',
    phone: '+855 23 555 019',
    distance: '3.2 km',
    open: true,
    lat: 11.6046,
    lng: 104.8728,
    img: IMG('1414235077428-338989a2e8c0', 700),
  },
  {
    id: 'bkk',
    name: 'FreshBite BKK1',
    city: 'Phnom Penh',
    address: '148 Street 51, Phnom Penh',
    hours: '11:00 – 23:00',
    phone: '+855 23 555 020',
    distance: '5.1 km',
    open: false,
    lat: 11.5485,
    lng: 104.9244,
    img: IMG('1552566626-52f8b828add9', 700),
  },
  {
    id: 'siem-reap-downtown',
    name: 'FreshBite Siem Reap Downtown',
    city: 'Siem Reap',
    address: 'Pub Street, Wat Bo Road, Siem Reap',
    hours: '10:00 – 22:00',
    phone: '+855 63 555 021',
    distance: '0.5 km',
    open: true,
    lat: 13.3602,
    lng: 103.8565,
    img: IMG('1559339352-11d035aa65de', 700),
  },
  {
    id: 'siem-reap-airport',
    name: 'FreshBite Siem Reap Airport',
    city: 'Siem Reap',
    address: 'National Road 6, Siem Reap',
    hours: '06:00 – 20:00',
    phone: '+855 63 555 022',
    distance: '8 km',
    open: true,
    lat: 13.4104,
    lng: 103.8128,
    img: IMG('1517699152581-bb49cf0c13c9', 700),
  },
]

export const CITIES = [...new Set(BRANCHES.map((b) => b.city))]

export const REVIEWS = [
  {
    id: 1,
    name: 'Sreypich Chan',
    avatar: 'SC',
    rating: 5,
    text: 'Fresh food, fast delivery and very easy to order. The app kept me updated the whole way.',
  },
  {
    id: 2,
    name: 'Dara Kim',
    avatar: 'DK',
    rating: 5,
    text: 'The beef burger arrived hot and juicy. Tracking driver to my door was a game changer.',
  },
  {
    id: 3,
    name: 'Malis Sok',
    avatar: 'MS',
    rating: 4,
    text: 'Love the customisation — I always ask for extra cheese and it never disappoints.',
  },
  {
    id: 4,
    name: 'Vuthy Heng',
    avatar: 'VH',
    rating: 5,
    text: 'Ordered for dine-in and the table was ready when we arrived. Super smooth.',
  },
]

export const PROMO = {
  headline: '20% OFF YOUR FIRST ORDER',
  code: 'WELCOME20',
  endsAt: 'September 30, 2026',
  note: 'Min. order $10 · Delivery or pickup · Use code at checkout',
}

export const STEPS = [
  {
    id: 1,
    icon: 'menu',
    title: 'Choose Your Food',
    text: 'Browse the menu and pick what you’re craving.',
  },
  {
    id: 2,
    icon: 'sparkles',
    title: 'Customize Your Meal',
    text: 'Size, add-ons and special instructions in a tap.',
  },
  {
    id: 3,
    icon: 'deliveries',
    title: 'Choose Delivery or Pickup',
    text: 'Dine-in, takeaway or delivery straight to your door.',
  },
  {
    id: 4,
    icon: 'trendingUp',
    title: 'Enjoy Your Food',
    text: 'Track your order live from kitchen to table.',
  },
]

export function dishById(id) {
  return DISHES.find((d) => d.id === id)
}

export function dishesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return DISHES
  return DISHES.filter((d) => d.category === categoryId)
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
}