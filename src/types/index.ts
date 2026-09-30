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

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Language = 'en' | 'rw' | 'fr' | 'es' | 'ar';

export type PaymentMethod = 'mtn' | 'airtel' | 'card' | 'cod';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  joinedDate: string;
  ordersCount: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
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

export interface FarmPassport {
  productId: number;
  cooperativeName: string;
  district: string;
  elevation: string;
  soilType: string;
  leadFarmer: string;
  harvestTime: string;
  batchNumber: string;
  rsbCertification: string;
  pesticideFree: boolean;
  waterSource: string;
  farmerStory: string;
}

export interface CustomerReview {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatar: string;
}

export interface SystemActivity {
  id: string;
  title: string;
  detail: string;
  time: string;
  timestamp?: string;
  type: 'order' | 'product' | 'user' | 'system' | 'payment' | 'delivery' | 'review';
  status?: 'success' | 'pending' | 'warning' | 'info';
  actor?: string;
  actorRole?: 'admin' | 'customer' | 'system';
  metadata?: Record<string, any>;
}

export type ColorTheme = 'lush-emerald' | 'sunlit-terracotta' | 'ocean-teal' | 'golden-harvest' | 'royal-forest';
