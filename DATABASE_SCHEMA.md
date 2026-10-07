# Fofo GreenGrocer Hub (`fofogreen`) — SQL Database Schema Documentation

This document provides a comprehensive technical reference for the **`fofogreen`** relational SQL database running on **Google Cloud SQL (PostgreSQL)** and managed via **Drizzle ORM**.

---

## 1. Architecture Overview

- **Database Engine**: PostgreSQL 16 (Google Cloud SQL)
- **Database / Schema Name**: `fofogreen` (`public` schema)
- **Region**: `europe-west2`
- **ORM / Query Layer**: Drizzle ORM (`drizzle-orm/node-postgres`)
- **Connection Mechanism**: Connection pooling via `pg.Pool` over local Cloud SQL Auth Proxy
- **Authentication Integration**: Firebase Authentication (`users.uid` maps directly to Firebase Auth UIDs)

---

## 2. Entity-Relationship Diagram (ERD)

```
       +--------------------+
       |     categories     |
       +--------------------+
       | PK id (SERIAL)     |
       | UQ slug (TEXT)     |<-------------------+
       +--------------------+                    |
                 | 1                             |
                 | has many                      |
                 v N                             |
       +--------------------+                    |
       |      products      |                    |
       +--------------------+                    |
       | PK id (SERIAL)     |                    |
       | FK category (TEXT) |--------------------+
       +--------------------+
         | 1             | 1
         |               |
         | has one       | has many
         v 1             v N
+-------------------+  +--------------------+  +--------------------+
|   farm_passports  |  |    order_items     |  |      reviews       |
+-------------------+  +--------------------+  +--------------------+
| PK id (SERIAL)    |  | PK id (SERIAL)     |  | PK id (SERIAL)     |
| FK product_id(INT)|  | FK product_id (INT)|  | FK product_id (INT)|
+-------------------+  | FK order_id (TEXT) |  +--------------------+
                       +--------------------+
                                 ^ N
                                 | has many
                                 | 1
                       +--------------------+
                       |       orders       |
                       +--------------------+
                       | PK id (TEXT)       |
                       | FK district (TEXT) |---> [delivery_zones.district_name]
                       +--------------------+
                                 ^
                                 | placed by
                       +--------------------+
                       |       users        |
                       +--------------------+
                       | PK id (SERIAL)     |
                       | UQ uid (TEXT)      |
                       +--------------------+

                       +--------------------+
                       |     activities     |
                       |   (System Logs)    |
                       +--------------------+
                       | PK id (TEXT)       |
                       | type, actor, status|
                       +--------------------+
```

---

## 3. Core Tables Specification

---

### 3.1. `products` Table (Organic Farm Catalog)

The central catalog of all fresh produce items sourced from smallholder cooperatives across Rwandan districts (Musanze, Bugesera, Rulindo, Gicumbi, etc.).

| Column Name | SQL Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `INTEGER / SERIAL` | **PRIMARY KEY** | Auto-increment | Unique identifier for each harvest item |
| `name` | `VARCHAR / TEXT` | `NOT NULL` | — | Item title (e.g., *Organic Vine Tomatoes*) |
| `category` | `VARCHAR / TEXT` | `NOT NULL`, FK to `categories.slug` | — | Grouping category (`vegetables`, `fruits`, `meat`, `dairy`, `grains`, `snacks`) |
| `price` | `INTEGER` | `NOT NULL` | — | Current price in Rwandan Francs (FRW) |
| `old_price` | `INTEGER` | `NULLABLE` | `NULL` | Strikethrough promotional price in FRW |
| `spec` | `VARCHAR / TEXT` | `NOT NULL` | — | Packaging unit / metric (e.g., `1 kg`, `Bunch (400g)`, `Tray of 15 eggs`) |
| `rating` | `VARCHAR / TEXT` | `NOT NULL` | `'5.0'` | Average customer review rating |
| `reviews_count` | `INTEGER` | `NOT NULL` | `0` | Number of customer ratings recorded |
| `image` | `VARCHAR / TEXT` | `NOT NULL` | — | High-resolution CDN asset URL |
| `badge` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Visual tag (`Fresh`, `Popular`, `Limited Time`, `Organic`) |
| `origin` | `VARCHAR / TEXT` | `NOT NULL` | — | Provenance location (e.g., *Musanze District, Northern Province*) |
| `farmer` | `VARCHAR / TEXT` | `NOT NULL` | — | Cooperative / Producer name (e.g., *Volcano Foothills Organic Farm*) |
| `description` | `TEXT` | `NOT NULL` | — | Nutritional details and cultivation methods |
| `in_stock` | `BOOLEAN` | `NOT NULL` | `TRUE` | Instant inventory availability toggle |
| `calories` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Nutritional calorie density (e.g., `41 kcal / 100g`) |
| `harvested` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Time of morning picking (e.g., *Today at dawn*) |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Record creation timestamp |

#### Relationships & Foreign Keys:
- **`category`** references `categories.slug`
- **1-to-1** with `farm_passports.product_id`
- **1-to-Many** with `order_items.product_id`
- **1-to-Many** with `reviews.product_id`

---

### 3.2. `users` Table (Customer & Admin Accounts)

Handles user authentication, role-based access control (RBAC), and account persistence. Synchronized with Firebase Authentication tokens.

| Column Name | SQL Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `INTEGER / SERIAL` | **PRIMARY KEY** | Auto-increment | Internal surrogate primary key |
| `uid` | `VARCHAR / TEXT` | `NOT NULL`, **UNIQUE** | — | Firebase Auth UID (used for JWT Bearer token claims) |
| `email` | `VARCHAR / TEXT` | `NOT NULL` | — | User email address |
| `name` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Full display name |
| `role` | `VARCHAR / TEXT` | `NOT NULL` | `'customer'` | Security permission role (`customer` or `admin`) |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Registration date & time |

#### Relationships & Foreign Keys:
- **`uid`** links directly to Firebase Authentication tokens received on `/api/*` routes.
- **1-to-Many** with `orders` via customer profile linkage.

---

### 3.3. `orders` Table (Checkout & Delivery Tracking)

Stores all customer purchases, delivery addresses across Kigali districts, live cold-chain transit tracking, and payment method details.

| Column Name | SQL Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `VARCHAR / TEXT` | **PRIMARY KEY** | — | Human-readable order code (e.g., `FOFO-8842`) |
| `customer_name` | `VARCHAR / TEXT` | `NOT NULL` | — | Recipient full name |
| `phone` | `VARCHAR / TEXT` | `NOT NULL` | — | Contact telephone number (e.g., `+250 788 123 456`) |
| `items_json` | `TEXT` | `NOT NULL` | — | Denormalized JSON snapshot of cart items, quantities, and prices |
| `subtotal` | `INTEGER` | `NOT NULL` | — | Basket item total in FRW |
| `discount` | `INTEGER` | `NOT NULL` | `0` | Applied voucher / coupon discount in FRW |
| `delivery_fee` | `INTEGER` | `NOT NULL` | `1500` | Cold-chain shipping cost in FRW |
| `total` | `INTEGER` | `NOT NULL` | — | Net order amount payable (`subtotal - discount + delivery_fee`) |
| `payment_method` | `VARCHAR / TEXT` | `NOT NULL` | `'mtn'` | Payment channel (`mtn`, `airtel`, `card`, `cod`) |
| `address` | `VARCHAR / TEXT` | `NOT NULL` | — | Street address / landmark (e.g., `KG 549 St, House 12`) |
| `district` | `VARCHAR / TEXT` | `NOT NULL` | — | Destination Kigali district (`Gasabo`, `Kicukiro`, `Nyarugenge`) |
| `status` | `VARCHAR / TEXT` | `NOT NULL` | `'Pending'` | Lifecycle state: `Pending`, `Preparing`, `Out for Delivery`, `Delivered` |
| `courier_name` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Assigned courier (e.g., `Emmanuel N.`) |
| `courier_phone` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Assigned courier phone |
| `courier_vehicle` | `VARCHAR / TEXT` | `NULLABLE` | `NULL` | Vehicle type (e.g., `E-Cargo Bike #04`, `Solar Moto #12`) |
| `estimated_minutes`| `INTEGER` | `NULLABLE` | `35` | Real-time ETA remaining until delivery |
| `temperature_celsius`| `INTEGER` | `NULLABLE` | `4` | Cold-chain sensor reading (typically `4°C` for fresh milk/fish) |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Order submission timestamp |

#### Relationships & Foreign Keys:
- **1-to-Many** with `order_items` via `order_items.order_id`
- **`district`** maps to `delivery_zones.district_name`

---

### 3.4. `order_items` Table (Normalized Order Details)

Provides normalized row-level storage for items inside each order, supporting revenue analysis, inventory depletion, and item re-orders.

| Column Name | SQL Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `INTEGER / SERIAL` | **PRIMARY KEY** | Auto-increment | Line item identifier |
| `order_id` | `VARCHAR / TEXT` | `NOT NULL`, FK to `orders.id` | — | Parent order reference |
| `product_id` | `INTEGER` | `NOT NULL`, FK to `products.id` | — | Ordered produce item reference |
| `product_name` | `VARCHAR / TEXT` | `NOT NULL` | — | Historical snapshot of produce name at purchase |
| `quantity` | `INTEGER` | `NOT NULL` | `1` | Quantity ordered |
| `unit_price` | `INTEGER` | `NOT NULL` | — | Unit price at the time of purchase (FRW) |
| `total_price` | `INTEGER` | `NOT NULL` | — | Line item subtotal (`quantity * unit_price`) |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Creation timestamp |

---

### 3.5. `activities` Table (System Logs & Audit Trail)

Records administrative, transactional, and security telemetry for comprehensive system auditing and operational compliance.

| Column Name | SQL Data Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | `VARCHAR / TEXT` | **PRIMARY KEY** | — | Unique event identifier (e.g., `ACT-ORD-8842`, `ACT-STK-1123`) |
| `title` | `VARCHAR / TEXT` | `NOT NULL` | — | Short human-readable summary of the action |
| `detail` | `TEXT` | `NOT NULL` | — | Comprehensive explanation of what changed |
| `time` | `VARCHAR / TEXT` | `NOT NULL` | — | Relative time indicator (e.g., `Just now`, `2 hours ago`) |
| `type` | `VARCHAR / TEXT` | `NOT NULL` | — | Category: `order`, `inventory`, `price`, `user`, `payment`, `review`, `system` |
| `status` | `VARCHAR / TEXT` | `NOT NULL` | — | Severity / Outcome: `success`, `info`, `warning`, `error` |
| `actor` | `VARCHAR / TEXT` | `NOT NULL` | — | Name / Identity of the initiator |
| `actor_role` | `VARCHAR / TEXT` | `NOT NULL` | — | Role: `admin`, `customer`, `courier`, `system` |
| `metadata_json` | `TEXT` | `NULLABLE` | `NULL` | Structured payload (order IDs, previous price, new price, etc.) |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | High-resolution timestamp of event occurrence |

---

## 4. Supporting Domain Tables

### 4.1. `categories` Table
Categorization taxonomy for organic produce.
- **PK**: `id (SERIAL)`
- **UQ**: `slug (TEXT)` (`vegetables`, `fruits`, `meat`, `dairy`, `grains`, `snacks`)
- **Columns**: `name (TEXT)`, `name_rw (TEXT)` (Kinyarwanda translation), `icon (TEXT)`, `description (TEXT)`, `item_count (INTEGER)`.

### 4.2. `farm_passports` Table
Deep traceability data showcasing Rwandan terroir, volcanic soil properties, and Rwanda Standards Board (RSB) organic certification.
- **PK**: `id (SERIAL)`
- **FK**: `product_id (INTEGER)` -> references `products.id`
- **Columns**: `cooperative_name`, `district`, `elevation`, `soil_type`, `lead_farmer`, `harvest_time`, `batch_number`, `rsb_certification`, `pesticide_free (BOOLEAN)`, `water_source`, `farmer_story`.

### 4.3. `delivery_zones` Table
Kigali express courier zone rules and fee tables.
- **PK**: `id (SERIAL)`
- **Columns**: `district_name` (`Gasabo`, `Kicukiro`, `Nyarugenge`), `sectors`, `delivery_fee (INT)`, `estimated_minutes (INT)`, `courier_type`, `is_active (BOOLEAN)`.

### 4.4. `meal_kits` Table
Chef-curated traditional Rwandan recipe meal bundles (e.g., *Royal Isombe Feast*, *Lake Kivu Tilapia Brochettes*).
- **PK**: `id (TEXT)`
- **Columns**: `name`, `name_rw`, `tagline`, `description`, `prep_time`, `servings`, `difficulty`, `image`, `badge`, `bundle_price`, `original_price`, `discount_percent`, `items_included_json`, `recipe_steps_json`, `nutrition_highlights`.

### 4.5. `reviews` Table
Customer feedback and ratings.
- **PK**: `id (SERIAL)`
- **FK**: `product_id (INTEGER, NULLABLE)` -> references `products.id`
- **Columns**: `name`, `location`, `rating (INTEGER 1-5)`, `comment`, `product_name`, `verified (BOOLEAN)`.

### 4.6. `store_settings` Table
Global store settings, currency rules, and headquarters details.
- **PK**: `id (SERIAL)`
- **Columns**: `store_name`, `currency` (`FRW`), `min_order_amount`, `free_delivery_threshold`, `contact_phone`, `contact_email`, `kigali_hub_address`.

---

## 5. Column Relationships & Foreign Key Reference

| Source Table | Source Column | Target Table | Target Column | Relationship Type | Purpose |
|---|---|---|---|---|---|
| `products` | `category` | `categories` | `slug` | Many-to-One (N:1) | Categorization & navigation filters |
| `farm_passports` | `product_id` | `products` | `id` | One-to-One (1:1) | RSB Bio-certification & farm terroir |
| `order_items` | `order_id` | `orders` | `id` | Many-to-One (N:1) | Line items contained within order |
| `order_items` | `product_id` | `products` | `id` | Many-to-One (N:1) | Product associated with line item |
| `reviews` | `product_id` | `products` | `id` | Many-to-One (N:1) | Reviews attached to specific produce |
| `orders` | `district` | `delivery_zones` | `district_name` | Many-to-One (N:1) | Kigali shipping fee and ETA calculation |

---

## 6. Sample Production SQL Queries

### 6.1. Product Catalog with Category & Farm Passport
```sql
SELECT 
    p.id,
    p.name,
    c.name AS category_name,
    p.price,
    p.spec,
    fp.cooperative_name,
    fp.district AS harvest_district,
    fp.rsb_certification,
    fp.elevation
FROM products p
JOIN categories c ON p.category = c.slug
LEFT JOIN farm_passports fp ON p.id = fp.product_id
WHERE p.in_stock = TRUE
ORDER BY p.price ASC;
```

### 6.2. Detailed Order Breakdown with Line Items
```sql
SELECT 
    o.id AS order_code,
    o.customer_name,
    o.phone,
    o.status,
    o.district,
    oi.product_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    o.total AS order_total
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = 'FOFO-8842';
```

### 6.3. Recent Administrative Audit Logs
```sql
SELECT 
    a.id,
    a.title,
    a.type,
    a.status,
    a.actor,
    a.actor_role,
    a.created_at
FROM activities a
ORDER BY a.created_at DESC
LIMIT 20;
```

---

## 7. Drizzle ORM Schema Source File
The programmatic schema definitions are located in:
- **`src/db/schema.ts`**: Table definitions, relations, and types.
- **`src/db/drizzle.config.ts`**: Drizzle Kit migration configuration.
- **`src/db/queries.ts`**: Type-safe query repository layer.
