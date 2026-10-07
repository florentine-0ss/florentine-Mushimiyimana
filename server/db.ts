import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent database path
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'fofo-database.json');

export interface Product {
  id: number;
  name: string;
  category: 'vegetables' | 'fruits' | 'meat' | 'dairy' | 'grains' | 'snacks';
  price: number;
  oldPrice?: number;
  spec: string;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: 'Fresh' | 'Popular' | 'Limited Time' | 'Organic';
  origin: string;
  farmer: string;
  description: string;
  inStock: boolean;
  calories?: string;
  harvested?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: Array<{ product: Product; quantity: number }>;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'mtn' | 'airtel' | 'card' | 'cod';
  address: string;
  district: string;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  courierName?: string;
  courierPhone?: string;
  courierVehicle?: string;
  estimatedMinutes?: number;
  temperatureCelsius?: number;
}

export interface MealKit {
  id: string;
  name: string;
  nameRw?: string;
  tagline: string;
  description: string;
  prepTime: string;
  servings: string;
  difficulty: 'Easy' | 'Medium' | 'Chef Special';
  image: string;
  badge: string;
  bundlePrice: number;
  originalPrice: number;
  discountPercent: number;
  itemsIncluded: string[];
  productIds: number[];
  recipeSteps: string[];
  nutritionHighlights: string;
}

export interface CustomerReview {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  productName?: string;
  verified: boolean;
}

export interface SystemActivity {
  id: string;
  title: string;
  detail: string;
  time: string;
  timestamp: string;
  type: 'order' | 'inventory' | 'user' | 'price' | 'review' | 'system';
  status: 'success' | 'info' | 'warning' | 'error';
  actor: string;
  actorRole: 'admin' | 'customer' | 'system' | 'courier';
  metadata?: Record<string, any>;
}

export interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  products: Product[];
  orders: Order[];
  mealKits: MealKit[];
  reviews: CustomerReview[];
  activities: SystemActivity[];
  settings: {
    storeName: string;
    currency: string;
    minDeliveryFee: number;
    freeDeliveryThreshold: number;
    contactPhone: string;
    contactEmail: string;
  };
}

// Initial Seed Data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Organic Vine Tomatoes',
    category: 'vegetables',
    price: 3500,
    oldPrice: 4800,
    spec: '1 kg',
    rating: 4.8,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1546470427-227c7369a913?auto=format&fit=crop&w=700&q=80',
    badge: 'Fresh',
    origin: 'Bugesera District, Eastern Province',
    farmer: 'Abakundakurima Cooperative',
    description: 'Sun-ripened, fragrant red tomatoes grown organically in nutrient-rich volcanic soil without synthetic pesticides.',
    inStock: true,
    calories: '18 kcal / 100g',
    harvested: 'This morning at 5:30 AM'
  },
  {
    id: 2,
    name: 'Crisp Garden Carrots',
    category: 'vegetables',
    price: 2800,
    oldPrice: 3500,
    spec: '1 kg',
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Musanze District, Northern Province',
    farmer: 'Volcano Foothills Organic Farm',
    description: 'Sweet, vibrant orange roots harvested from the high-altitude rich volcanic soil of Musanze. High in beta-carotene.',
    inStock: true,
    calories: '41 kcal / 100g',
    harvested: 'Yesterday afternoon'
  },
  {
    id: 3,
    name: 'Organic Broccoli Crowns',
    category: 'vegetables',
    price: 4200,
    spec: '500g',
    rating: 4.7,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=700&q=80',
    badge: 'Organic',
    origin: 'Rulindo District, Northern Province',
    farmer: 'Green Valley Agro-Group',
    description: 'Tender florets and crunchy stems loaded with vitamins C and K, grown with natural mountain spring irrigation.',
    inStock: true,
    calories: '34 kcal / 100g',
    harvested: 'This morning'
  },
  {
    id: 4,
    name: 'Fresh Leafy Spinach & Greens',
    category: 'vegetables',
    price: 1500,
    spec: 'Bunch (400g)',
    rating: 4.6,
    reviewsCount: 44,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80',
    badge: 'Fresh',
    origin: 'Gicumbi District, Northern Province',
    farmer: 'Mama Keza Smallholder Plot',
    description: 'Deep green, mineral-dense spinach and local dodo leaves picked just hours before delivery.',
    inStock: true,
    calories: '23 kcal / 100g',
    harvested: 'Today at dawn'
  },
  {
    id: 5,
    name: 'Sweet Bell Peppers Trio',
    category: 'vegetables',
    price: 3800,
    oldPrice: 4500,
    spec: 'Pack of 3',
    rating: 4.8,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=80',
    origin: 'Bugesera District, Eastern Province',
    farmer: 'Sunrise Greenhouse Union',
    description: 'Crisp red, yellow, and green bell peppers bursting with natural sweetness and vitamin C.',
    inStock: true,
    calories: '31 kcal / 100g',
    harvested: 'Yesterday'
  },
  {
    id: 6,
    name: 'Red Bulb Onions',
    category: 'vegetables',
    price: 2200,
    spec: '1 kg bag',
    rating: 4.5,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=80',
    origin: 'Nyagatare District, Eastern Province',
    farmer: 'Savanna Organic Farmers',
    description: 'Firm, pungent red onions cured naturally in Rwandan sunshine for extended kitchen shelf life.',
    inStock: true,
    calories: '40 kcal / 100g',
    harvested: '3 days ago (cured)'
  },
  {
    id: 7,
    name: 'Fresh Zucchini Courgettes',
    category: 'vegetables',
    price: 2400,
    spec: '750g',
    rating: 4.7,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=700&q=80',
    origin: 'Musanze District, Northern Province',
    farmer: 'Volcano Foothills Organic Farm',
    description: 'Tender, glossy zucchini great for grilling, sautéing, or steaming. High in fiber and water content.',
    inStock: true,
    calories: '17 kcal / 100g',
    harvested: 'Yesterday'
  },
  {
    id: 8,
    name: 'Creamy Hass Avocados',
    category: 'fruits',
    price: 2500,
    oldPrice: 3200,
    spec: 'Pack of 3 (approx. 700g)',
    rating: 5.0,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Kamonyi District, Southern Province',
    farmer: 'Twitezimbere Avocado Growers',
    description: 'Buttery, rich Hass avocados renowned for their nutty flavor and healthy monounsaturated fats.',
    inStock: true,
    calories: '160 kcal / 100g',
    harvested: 'Tree-ripened, picked yesterday'
  },
  {
    id: 9,
    name: 'Sweet Rwandan Apple Bananas (Kamara)',
    category: 'fruits',
    price: 2000,
    spec: '1 bunch (approx. 1.2 kg)',
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=80',
    badge: 'Fresh',
    origin: 'Rwamagana District, Eastern Province',
    farmer: 'Lake Muhazi Cooperative',
    description: 'Small, intensely sweet local bananas with a hint of citrusy apple undertone. A beloved Rwandan pantry staple.',
    inStock: true,
    calories: '89 kcal / 100g',
    harvested: 'Today'
  },
  {
    id: 10,
    name: 'Golden Mangoes (Kent Variety)',
    category: 'fruits',
    price: 4500,
    oldPrice: 5500,
    spec: '1 kg (2 large mangoes)',
    rating: 4.9,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=80',
    badge: 'Limited Time',
    origin: 'Bugesera District, Eastern Province',
    farmer: 'SunTree Orchards',
    description: 'Juicy, fiberless golden mangoes bursting with tropical nectar. Naturally ripened on the branch.',
    inStock: true,
    calories: '60 kcal / 100g',
    harvested: '2 days ago'
  },
  {
    id: 11,
    name: 'Fresh Pineapple (Sugarloaf)',
    category: 'fruits',
    price: 2200,
    spec: '1 whole fruit (approx. 1.5 kg)',
    rating: 4.8,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=80',
    origin: 'Gatsibo District, Eastern Province',
    farmer: 'Akagera Basin Fruit Growers',
    description: 'Extremely sweet white-flesh pineapple with low acidity. You can even eat the tender core.',
    inStock: true,
    calories: '50 kcal / 100g',
    harvested: 'Yesterday'
  },
  {
    id: 12,
    name: 'Purple Passion Fruits (Maracuja)',
    category: 'fruits',
    price: 3600,
    spec: '500g pouch',
    rating: 4.7,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1536511136775-680f4f9f7a93?auto=format&fit=crop&w=700&q=80',
    origin: 'Nyamagabe District, Southern Province',
    farmer: 'Highland Orchardists',
    description: 'Fragrant purple passion fruit filled with tangy seeds, perfect for fresh juices or fruit salads.',
    inStock: true,
    calories: '97 kcal / 100g',
    harvested: 'This week'
  },
  {
    id: 13,
    name: 'Organic Tree Tomatoes (Ikinyomoro)',
    category: 'fruits',
    price: 3200,
    spec: '1 kg',
    rating: 4.9,
    reviewsCount: 57,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Musanze District, Northern Province',
    farmer: 'Volcano Foothills Organic Farm',
    description: 'Traditional Rwandan ruby-red tree tomato loaded with antioxidants and deep bittersweet flavor.',
    inStock: true,
    calories: '31 kcal / 100g',
    harvested: 'This morning'
  },
  {
    id: 14,
    name: 'Free-Range Village Eggs',
    category: 'meat',
    price: 4500,
    oldPrice: 5000,
    spec: 'Tray of 15 eggs',
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Bugesera District, Eastern Province',
    farmer: 'Uruhimbi Pastured Poultry',
    description: 'Deep golden yolks from free-roaming village hens fed non-GMO grains, greens, and sunshine.',
    inStock: true,
    calories: '72 kcal / egg',
    harvested: 'Collected yesterday'
  },
  {
    id: 15,
    name: 'Farm-Fresh Whole Chicken',
    category: 'meat',
    price: 8500,
    spec: '1 whole dressed bird (approx. 1.4 kg)',
    rating: 4.8,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=700&q=80',
    badge: 'Fresh',
    origin: 'Rwamagana District, Eastern Province',
    farmer: 'Kigali Valley Farms',
    description: 'Grain-fed, antibiotic-free whole chicken. Cleaned, chilled, and vacuum-sealed for maximum freshness.',
    inStock: true,
    calories: '215 kcal / 100g',
    harvested: 'Chilled this morning'
  },
  {
    id: 16,
    name: 'Lake Kivu Fresh Tilapia Fillets',
    category: 'meat',
    price: 9800,
    oldPrice: 11500,
    spec: 'Pack of 2 fillets (approx. 500g)',
    rating: 4.9,
    reviewsCount: 50,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80',
    badge: 'Organic',
    origin: 'Rubavu District, Western Province',
    farmer: 'Lake Kivu Artisanal Fishermen Guild',
    description: 'Wild-caught tilapia from the pristine waters of Lake Kivu. Flaky, mild, and delivered on cold ice.',
    inStock: true,
    calories: '96 kcal / 100g',
    harvested: 'Caught overnight'
  },
  {
    id: 17,
    name: 'Pasture-Raised Fresh Whole Milk',
    category: 'dairy',
    price: 1800,
    spec: '1 Liter Glass Bottle',
    rating: 4.8,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80',
    badge: 'Fresh',
    origin: 'Nyagatare District, Eastern Province',
    farmer: 'Gishwati Pastures Dairy',
    description: 'Whole pasteurized cow milk from grass-fed Inyambo crossbreeds. Rich, creamy, and unhomogenized.',
    inStock: true,
    calories: '64 kcal / 100ml',
    harvested: 'Milked yesterday, bottled today'
  },
  {
    id: 18,
    name: 'Rwandan Artisan Gouda Cheese',
    category: 'dairy',
    price: 6500,
    oldPrice: 7800,
    spec: 'Wheel wedge (350g)',
    rating: 4.9,
    reviewsCount: 26,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Gishwati Forest Border, Western Province',
    farmer: 'Fromagerie des Mille Collines',
    description: 'Matured for 3 months using pure mountain milk. Smooth, slightly nutty, and melts delightfully.',
    inStock: true,
    calories: '356 kcal / 100g',
    harvested: 'Aged 90 days'
  },
  {
    id: 19,
    name: 'Traditional Cultured Buttermilk (Ikivuguto)',
    category: 'dairy',
    price: 2200,
    spec: '1 Liter Bottle',
    rating: 5.0,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=700&q=80',
    badge: 'Organic',
    origin: 'Nyanza District, Southern Province',
    farmer: 'Inyambo Heritage Dairy',
    description: 'Thick, probiotic-packed fermented milk crafted according to century-old Rwandan royal tradition.',
    inStock: true,
    calories: '52 kcal / 100ml',
    harvested: 'Cultured fresh yesterday'
  },
  {
    id: 20,
    name: 'Artisan Salted Farm Butter',
    category: 'dairy',
    price: 4800,
    spec: '250g tub',
    rating: 4.8,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80',
    origin: 'Musanze District, Northern Province',
    farmer: 'Gishwati Pastures Dairy',
    description: 'Churned from cultured sweet cream and lightly salted with Lake Katwe crystals.',
    inStock: true,
    calories: '717 kcal / 100g',
    harvested: 'Churned this week'
  },
  {
    id: 21,
    name: 'Raw Organic Nyungwe Forest Honey',
    category: 'grains',
    price: 8500,
    oldPrice: 10000,
    spec: '500g Glass Jar',
    rating: 5.0,
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Nyungwe National Park Border, Southern Province',
    farmer: 'Koperative Abavumvu ba Nyungwe',
    description: 'Pure, unfiltered dark amber honey harvested from wild forest blossoms. Rich in pollen, enzymes, and antioxidants.',
    inStock: true,
    calories: '304 kcal / 100g',
    harvested: 'Last month harvest'
  },
  {
    id: 22,
    name: 'Cold-Pressed Virgin Sunflower Oil',
    category: 'grains',
    price: 5200,
    spec: '1 Liter Bottle',
    rating: 4.7,
    reviewsCount: 35,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80',
    origin: 'Kirehe District, Eastern Province',
    farmer: 'Kirehe SunGrowers Mill',
    description: 'Unrefined, mechanically cold-pressed sunflower seed oil. Excellent for heart-healthy high-heat sautéing.',
    inStock: true,
    calories: '884 kcal / 100ml',
    harvested: 'Pressed fresh'
  },
  {
    id: 23,
    name: 'Brown Organic Sorghum Grain (Amasaka)',
    category: 'grains',
    price: 2500,
    spec: '1 kg bag',
    rating: 4.6,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80',
    origin: 'Huye District, Southern Province',
    farmer: 'Koperative Dutezimbere Ubuhinzi',
    description: 'Ancient Rwandan super-grain packed with iron, protein, and gluten-free dietary fiber.',
    inStock: true,
    calories: '329 kcal / 100g',
    harvested: 'Harvested this season'
  },
  {
    id: 24,
    name: 'Artisan Roasted Macadamia Nuts',
    category: 'snacks',
    price: 7500,
    oldPrice: 9000,
    spec: '250g foil pouch',
    rating: 4.9,
    reviewsCount: 46,
    image: 'https://images.unsplash.com/photo-1543208543-6052014786af?auto=format&fit=crop&w=700&q=80',
    badge: 'Popular',
    origin: 'Kayonza District, Eastern Province',
    farmer: 'Rwanda Nut Company Cooperative',
    description: 'Dry roasted with a hint of sea salt. Decadently rich, crunchy, and packed with healthy fats.',
    inStock: true,
    calories: '718 kcal / 100g',
    harvested: 'Freshly roasted'
  },
  {
    id: 25,
    name: 'Sundried Pineapple Rings',
    category: 'snacks',
    price: 3800,
    spec: '150g pack',
    rating: 4.8,
    reviewsCount: 28,
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=700&q=80',
    origin: 'Bugesera District, Eastern Province',
    farmer: 'Solar Harvest Women Union',
    description: '100% pure sun-dried pineapple without added sugars, preservatives, or sulfur. Chewy and intensely sweet.',
    inStock: true,
    calories: '280 kcal / 100g',
    harvested: 'Dehydrated this week'
  },
  {
    id: 26,
    name: 'Single-Origin Rwandan Arabica Coffee Beans',
    category: 'snacks',
    price: 8900,
    spec: '350g whole bean bag',
    rating: 5.0,
    reviewsCount: 104,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=700&q=80',
    badge: 'Organic',
    origin: 'Huye Mountain, Southern Province',
    farmer: 'Maraba Coffee Growers Guild',
    description: 'High-altitude volcanic bourbon coffee. Tasting notes of floral bergamot, black tea, and juicy red berries.',
    inStock: true,
    calories: '0 kcal',
    harvested: 'Current crop specialty'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'FOFO-8842',
    customerName: 'Jean-Paul Habimana',
    phone: '+250 788 123 456',
    items: [
      { product: DEFAULT_PRODUCTS[0], quantity: 2 },
      { product: DEFAULT_PRODUCTS[7], quantity: 1 }
    ],
    subtotal: 9500,
    discount: 500,
    deliveryFee: 1500,
    total: 10500,
    paymentMethod: 'mtn',
    address: 'KG 549 St, House 12',
    district: 'Gasabo (Kacyiru)',
    status: 'Delivered',
    createdAt: '2026-10-07 08:30',
    courierName: 'Emmanuel N.',
    courierPhone: '+250 788 999 111',
    courierVehicle: 'E-Cargo Bike #04',
    estimatedMinutes: 0,
    temperatureCelsius: 4
  },
  {
    id: 'FOFO-8843',
    customerName: 'Grace Uwase',
    phone: '+250 783 654 321',
    items: [
      { product: DEFAULT_PRODUCTS[13], quantity: 1 },
      { product: DEFAULT_PRODUCTS[16], quantity: 2 },
      { product: DEFAULT_PRODUCTS[20], quantity: 1 }
    ],
    subtotal: 16600,
    discount: 1000,
    deliveryFee: 1500,
    total: 17100,
    paymentMethod: 'airtel',
    address: 'KK 15 Rd, Apt 4B',
    district: 'Kicukiro (Niboye)',
    status: 'Out for Delivery',
    createdAt: '2026-10-07 09:45',
    courierName: 'Patrick M.',
    courierPhone: '+250 788 888 222',
    courierVehicle: 'Solar Moto #12',
    estimatedMinutes: 18,
    temperatureCelsius: 5
  }
];

const DEFAULT_MEAL_KITS: MealKit[] = [
  {
    id: 'kit-isombe',
    name: 'Traditional Royal Isombe Feast Kit',
    nameRw: 'Ifunguro rya Isombe gakondo',
    tagline: 'Cassava leaf stew with rich peanut butter & bone broth',
    description: 'The national comfort dish made effortless. Tender pounded cassava greens cooked with rich ground peanut butter, seasonal leeks, sweet bell peppers, and optional smoked meat seasoning.',
    prepTime: '45 mins',
    servings: '4–6 People',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    badge: 'Rwandan Classic',
    bundlePrice: 11500,
    originalPrice: 14800,
    discountPercent: 22,
    itemsIncluded: ['Fresh Pounded Cassava Leaves (800g)', 'Cold-Pressed Peanut Butter (300g)', 'Vine Tomatoes (500g)', 'Red Onions & Leeks', 'Green Bell Peppers', 'Garlic & Ginger Root'],
    productIds: [1, 4, 5, 6],
    recipeSteps: [
      'Rinse the tender pounded cassava leaves thoroughly with cold water.',
      'Simmer greens in a covered pot with sliced onions and leeks for 25 minutes.',
      'Whisk rich natural peanut butter with 200ml warm water until silky.',
      'Fold the peanut paste and chopped vine tomatoes into the pot.',
      'Simmer gently on low heat for 15 minutes until fragrant and creamy.',
      'Serve warm over steaming sweet plantains or white rice.'
    ],
    nutritionHighlights: 'Very high in dietary fiber, plant-based protein, iron, and vitamin A.'
  },
  {
    id: 'kit-tilapia-brochette',
    name: 'Lake Kivu Tilapia & Green Banana Brochette Kit',
    nameRw: 'Ifi y’i Kivu n’Igitoki cy’Inzoga',
    tagline: 'Lake fresh fish skewers with flame-roasted plantains',
    description: 'Recreate Kigali lakeside evenings at home. Cleaned Lake Kivu tilapia fillets marinated in piri-piri lemon oil, skewered with bell peppers and served alongside golden plantains.',
    prepTime: '30 mins',
    servings: '3–4 People',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    badge: 'Weekend Favorite',
    bundlePrice: 16800,
    originalPrice: 21000,
    discountPercent: 20,
    itemsIncluded: ['Fresh Lake Kivu Tilapia Fillets (500g)', 'Cooking Plantains (1.5 kg)', 'Sweet Bell Peppers Trio', 'Fresh Lime & Red Chilis', 'Virgin Sunflower Marinade', 'Bamboo Skewers (10 pcs)'],
    productIds: [16, 5, 9, 22],
    recipeSteps: [
      'Cube tilapia fillets into 3cm skewers pieces; season with chili, salt, and lime juice.',
      'Thread fish cubes alternatively with vibrant bell peppers onto bamboo skewers.',
      'Peel and parboil cooking plantains for 10 minutes until tender.',
      'Grill or pan-sear brochettes on high heat for 3–4 minutes per side until golden.',
      'Lightly brush plantains with sunflower oil and roast until caramelized.',
      'Garnish with fresh lime wedges and serve with akabanga hot pepper oil.'
    ],
    nutritionHighlights: 'High in lean omega-3 fatty acids, potassium, and vitamins B6 & B12.'
  }
];

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: 'Aline Mukamana',
    location: 'Kacyiru, Kigali',
    rating: 5,
    comment: 'The vegetables arrived at 8:30 AM smelling like fresh morning soil! The Hass avocados were at absolute peak ripeness. Truly game-changing service for Kigali.',
    date: '2026-10-05',
    productName: 'Creamy Hass Avocados',
    verified: true
  },
  {
    id: 2,
    name: 'Dr. David Kagame',
    location: 'Nyarutarama, Kigali',
    rating: 5,
    comment: 'Impressed by the cold-chain handling. Milk and Lake Kivu tilapia were packed with ice packs and thermometer reads 4°C. Top tier quality!',
    date: '2026-10-06',
    productName: 'Lake Kivu Fresh Tilapia Fillets',
    verified: true
  },
  {
    id: 3,
    name: 'Sandrine Ingabire',
    location: 'Kimihurura, Kigali',
    rating: 5,
    comment: 'The Isombe meal kit saved my family dinner on a busy Wednesday. Clear step-by-step instructions and the peanut butter is authentic and rich.',
    date: '2026-10-06',
    productName: 'Traditional Royal Isombe Feast Kit',
    verified: true
  }
];

const DEFAULT_ACTIVITIES: SystemActivity[] = [
  {
    id: 'ACT-INIT-001',
    title: 'Database Engine Initialized',
    detail: 'Node.js persistent database seeded with 26 organic produce products and Kigali delivery districts.',
    time: 'System Boot',
    timestamp: new Date().toISOString(),
    type: 'system',
    status: 'success',
    actor: 'Node.js Express Engine',
    actorRole: 'system',
    metadata: { version: '2.4.0', engine: 'FofoDb-JSON' }
  },
  {
    id: 'ACT-ORD-8842',
    title: 'Express Delivery Dispatched',
    detail: 'Order FOFO-8842 dispatched via E-Cargo Bike to Kacyiru, Gasabo.',
    time: '2 hours ago',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'order',
    status: 'info',
    actor: 'Courier Emmanuel N.',
    actorRole: 'courier',
    metadata: { orderId: 'FOFO-8842', temperature: '4°C' }
  }
];

// Database Engine Implementation
class FofoDatabase {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadFromFile();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromFile(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.products && parsed.products.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('[FofoDB] Error reading database file, using seed data:', err);
    }

    // Seed default schema
    const initial: DatabaseSchema = {
      version: '2.4.0',
      lastUpdated: new Date().toISOString(),
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      mealKits: DEFAULT_MEAL_KITS,
      reviews: DEFAULT_REVIEWS,
      activities: DEFAULT_ACTIVITIES,
      settings: {
        storeName: 'Fofo GreenGrocer Hub Rwanda',
        currency: 'FRW',
        minDeliveryFee: 1500,
        freeDeliveryThreshold: 25000,
        contactPhone: '+250 788 123 456',
        contactEmail: 'orders@fofogreengrocer.rw'
      }
    };

    this.saveToFile(initial);
    return initial;
  }

  private saveToFile(state?: DatabaseSchema) {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      const dataToSave = state || this.data;
      dataToSave.lastUpdated = new Date().toISOString();
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[FofoDB] Error writing to database file:', err);
    } finally {
      this.isSaving = false;
    }
  }

  // --- Products CRUD ---
  public getProducts(filters?: { category?: string; search?: string; inStock?: boolean }): Product[] {
    let result = [...this.data.products];
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q)
      );
    }
    if (filters?.inStock !== undefined) {
      result = result.filter(p => p.inStock === filters.inStock);
    }
    return result;
  }

  public getProductById(id: number): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    const nextId = Math.max(0, ...this.data.products.map(p => p.id)) + 1;
    const newProduct: Product = { ...product, id: nextId };
    this.data.products.unshift(newProduct);
    
    this.addActivity({
      title: 'New Produce Added to Catalog',
      detail: `${newProduct.name} (${newProduct.spec}) priced at ${newProduct.price} FRW from ${newProduct.origin}.`,
      type: 'inventory',
      status: 'success',
      actor: 'Admin',
      actorRole: 'admin',
      metadata: { productId: newProduct.id }
    });

    this.saveToFile();
    return newProduct;
  }

  public updateProduct(id: number, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const prev = this.data.products[idx];
    const updated: Product = { ...prev, ...updates, id };
    this.data.products[idx] = updated;

    this.addActivity({
      title: 'Produce Details Updated',
      detail: `Updated ${updated.name} (Price: ${updated.price} FRW, InStock: ${updated.inStock ? 'Yes' : 'No'}).`,
      type: 'price',
      status: 'info',
      actor: 'Admin',
      actorRole: 'admin',
      metadata: { productId: id }
    });

    this.saveToFile();
    return updated;
  }

  public deleteProduct(id: number): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.data.products.splice(idx, 1)[0];
    
    this.addActivity({
      title: 'Produce Removed from Catalog',
      detail: `Removed ${removed.name} (ID: ${id}) from active harvest inventory.`,
      type: 'inventory',
      status: 'warning',
      actor: 'Admin',
      actorRole: 'admin',
      metadata: { productId: id }
    });

    this.saveToFile();
    return true;
  }

  // --- Orders CRUD ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'> & { id?: string }): Order {
    const orderId = orderData.id || `FOFO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      courierName: 'Kigali Rapid E-Bike #07',
      courierPhone: '+250 788 112 233',
      estimatedMinutes: 35,
      temperatureCelsius: 4
    };

    this.data.orders.unshift(newOrder);

    this.addActivity({
      title: 'New Customer Order Placed',
      detail: `${newOrder.customerName} ordered ${newOrder.items.length} items (${newOrder.total.toLocaleString()} FRW) for delivery to ${newOrder.district}.`,
      type: 'order',
      status: 'success',
      actor: newOrder.customerName,
      actorRole: 'customer',
      metadata: { orderId: newOrder.id, total: newOrder.total }
    });

    this.saveToFile();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    if (status === 'Delivered') {
      order.estimatedMinutes = 0;
    }

    this.addActivity({
      title: 'Order Status Changed',
      detail: `Order ${id} is now ${status}.`,
      type: 'order',
      status: 'info',
      actor: 'Delivery Coordinator',
      actorRole: 'courier',
      metadata: { orderId: id, status }
    });

    this.saveToFile();
    return order;
  }

  // --- Meal Kits ---
  public getMealKits(): MealKit[] {
    return this.data.mealKits;
  }

  // --- Reviews ---
  public getReviews(): CustomerReview[] {
    return this.data.reviews;
  }

  public addReview(reviewData: Omit<CustomerReview, 'id' | 'date'>): CustomerReview {
    const nextId = Math.max(0, ...this.data.reviews.map(r => r.id)) + 1;
    const newReview: CustomerReview = {
      ...reviewData,
      id: nextId,
      date: new Date().toISOString().slice(0, 10)
    };
    this.data.reviews.unshift(newReview);

    this.addActivity({
      title: 'Customer Review Posted',
      detail: `${newReview.name} rated ${newReview.rating}/5 stars: "${newReview.comment.slice(0, 50)}..."`,
      type: 'review',
      status: 'info',
      actor: newReview.name,
      actorRole: 'customer',
      metadata: { rating: newReview.rating }
    });

    this.saveToFile();
    return newReview;
  }

  // --- System Activities ---
  public getActivities(): SystemActivity[] {
    return this.data.activities;
  }

  public addActivity(act: Omit<SystemActivity, 'id' | 'timestamp' | 'time'>): SystemActivity {
    const id = `ACT-${Date.now().toString().slice(-6)}`;
    const newAct: SystemActivity = {
      ...act,
      id,
      timestamp: new Date().toISOString(),
      time: 'Just now'
    };
    this.data.activities.unshift(newAct);
    // Keep max 100 activities
    if (this.data.activities.length > 100) {
      this.data.activities = this.data.activities.slice(0, 100);
    }
    this.saveToFile();
    return newAct;
  }

  // --- Stats Summary ---
  public getStats() {
    const totalRevenue = this.data.orders.reduce((acc, o) => acc + o.total, 0);
    const activeOrders = this.data.orders.filter(o => o.status !== 'Delivered').length;
    const totalProducts = this.data.products.length;
    const inStockProducts = this.data.products.filter(p => p.inStock).length;
    const outOfStockProducts = totalProducts - inStockProducts;
    
    return {
      totalRevenue,
      totalOrders: this.data.orders.length,
      activeOrders,
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalReviews: this.data.reviews.length,
      totalActivities: this.data.activities.length,
      lastUpdated: this.data.lastUpdated,
      dbVersion: this.data.version
    };
  }

  // Reset database to factory seed
  public resetToSeed() {
    this.data.products = [...DEFAULT_PRODUCTS];
    this.data.orders = [...DEFAULT_ORDERS];
    this.data.mealKits = [...DEFAULT_MEAL_KITS];
    this.data.reviews = [...DEFAULT_REVIEWS];
    this.data.activities = [...DEFAULT_ACTIVITIES];
    this.saveToFile();
    return { success: true, message: 'Database reset to fresh Rwandan farm catalog seed' };
  }
}

export const db = new FofoDatabase();
