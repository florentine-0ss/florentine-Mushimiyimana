import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (integrated with Firebase UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  nameRw: text('name_rw'),
  icon: text('icon').notNull(),
  description: text('description'),
  itemCount: integer('item_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products catalog
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().references(() => categories.slug),
  price: integer('price').notNull(),
  oldPrice: integer('old_price'),
  spec: text('spec').notNull(),
  rating: text('rating').notNull().default('5.0'),
  reviewsCount: integer('reviews_count').notNull().default(0),
  image: text('image').notNull(),
  badge: text('badge'),
  origin: text('origin').notNull(),
  farmer: text('farmer').notNull(),
  description: text('description').notNull(),
  inStock: boolean('in_stock').notNull().default(true),
  calories: text('calories'),
  harvested: text('harvested'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Farm Passports (Volcanic Soil Provenance & RSB Organic Certification)
export const farmPassports = pgTable('farm_passports', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  cooperativeName: text('cooperative_name').notNull(),
  district: text('district').notNull(),
  elevation: text('elevation').notNull(),
  soilType: text('soil_type').notNull(),
  leadFarmer: text('lead_farmer').notNull(),
  harvestTime: text('harvest_time').notNull(),
  batchNumber: text('batch_number').notNull(),
  rsbCertification: text('rsb_certification').notNull(),
  pesticideFree: boolean('pesticide_free').default(true),
  waterSource: text('water_source').notNull(),
  farmerStory: text('farmer_story').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  itemsJson: text('items_json').notNull(),
  subtotal: integer('subtotal').notNull(),
  discount: integer('discount').notNull().default(0),
  deliveryFee: integer('delivery_fee').notNull().default(1500),
  total: integer('total').notNull(),
  paymentMethod: text('payment_method').notNull().default('mtn'),
  address: text('address').notNull(),
  district: text('district').notNull(),
  status: text('status').notNull().default('Pending'),
  courierName: text('courier_name'),
  courierPhone: text('courier_phone'),
  courierVehicle: text('courier_vehicle'),
  estimatedMinutes: integer('estimated_minutes').default(35),
  temperatureCelsius: integer('temperature_celsius').default(4),
  createdAt: timestamp('created_at').defaultNow(),
});

// Order Items (Normalized line items)
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Kigali Delivery Zones
export const deliveryZones = pgTable('delivery_zones', {
  id: serial('id').primaryKey(),
  districtName: text('district_name').notNull(),
  sectors: text('sectors').notNull(),
  deliveryFee: integer('delivery_fee').notNull(),
  estimatedMinutes: integer('estimated_minutes').notNull(),
  courierType: text('courier_type').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customer Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  name: text('name').notNull(),
  location: text('location').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  productName: text('product_name'),
  verified: boolean('verified').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Meal Kits
export const mealKits = pgTable('meal_kits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameRw: text('name_rw'),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  prepTime: text('prep_time').notNull(),
  servings: text('servings').notNull(),
  difficulty: text('difficulty').notNull(),
  image: text('image').notNull(),
  badge: text('badge').notNull(),
  bundlePrice: integer('bundle_price').notNull(),
  originalPrice: integer('original_price').notNull(),
  discountPercent: integer('discount_percent').notNull(),
  itemsIncludedJson: text('items_included_json').notNull(),
  recipeStepsJson: text('recipe_steps_json').notNull(),
  nutritionHighlights: text('nutrition_highlights').notNull(),
});

// System Activities and Audit Logs
export const activities = pgTable('activities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  detail: text('detail').notNull(),
  time: text('time').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  actor: text('actor').notNull(),
  actorRole: text('actor_role').notNull(),
  metadataJson: text('metadata_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Store Settings
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  storeName: text('store_name').notNull().default('Fofo GreenGrocer Hub Rwanda'),
  currency: text('currency').notNull().default('FRW'),
  minOrderAmount: integer('min_order_amount').notNull().default(3000),
  freeDeliveryThreshold: integer('free_delivery_threshold').notNull().default(25000),
  contactPhone: text('contact_phone').notNull().default('+250 788 123 456'),
  contactEmail: text('contact_email').notNull().default('orders@fofogreengrocer.rw'),
  kigaliHubAddress: text('kigali_hub_address').notNull().default('KG 9 Ave, Nyarutarama, Kigali'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Schema Migrations Tracking
export const schemaMigrations = pgTable('schema_migrations', {
  id: serial('id').primaryKey(),
  version: text('version').notNull().unique(),
  name: text('name').notNull(),
  appliedAt: timestamp('applied_at').defaultNow(),
  checksum: text('checksum'),
  details: text('details'),
});

// --- Relations Definitions ---
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  categoryRel: one(categories, {
    fields: [products.category],
    references: [categories.slug],
  }),
  farmPassport: one(farmPassports, {
    fields: [products.id],
    references: [farmPassports.productId],
  }),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const farmPassportsRelations = relations(farmPassports, ({ one }) => ({
  product: one(products, {
    fields: [farmPassports.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));
