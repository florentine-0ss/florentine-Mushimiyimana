import { db } from './index.ts';
import { products, orders, mealKits, reviews, activities, users, categories, deliveryZones, farmPassports, storeSettings, orderItems } from './schema.ts';
import { eq, desc, ilike, and } from 'drizzle-orm';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, MEAL_KITS, INITIAL_REVIEWS, INITIAL_ACTIVITIES } from '../data/mockData.ts';

// Auto-seed Cloud SQL PostgreSQL database if empty
export async function seedDatabaseIfEmpty() {
  try {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length === 0) {
      console.log('[Cloud SQL] Seeding products into PostgreSQL database...');
      for (const p of INITIAL_PRODUCTS) {
        await db.insert(products).values({
          name: p.name,
          category: p.category,
          price: p.price,
          oldPrice: p.oldPrice,
          spec: p.spec,
          rating: p.rating.toFixed(1),
          reviewsCount: p.reviewsCount,
          image: p.image,
          badge: p.badge,
          origin: p.origin,
          farmer: p.farmer,
          description: p.description,
          inStock: p.inStock,
          calories: p.calories,
          harvested: p.harvested
        });
      }
      console.log('[Cloud SQL] Seeded 26 Rwandan organic products.');

      // Seed Meal Kits
      for (const k of MEAL_KITS) {
        await db.insert(mealKits).values({
          id: k.id,
          name: k.name,
          nameRw: k.nameRw,
          tagline: k.tagline,
          description: k.description,
          prepTime: k.prepTime,
          servings: k.servings,
          difficulty: k.difficulty,
          image: k.image,
          badge: k.badge,
          bundlePrice: k.bundlePrice,
          originalPrice: k.originalPrice,
          discountPercent: k.discountPercent,
          itemsIncludedJson: JSON.stringify(k.itemsIncluded),
          recipeStepsJson: JSON.stringify(k.recipeSteps),
          nutritionHighlights: k.nutritionHighlights
        });
      }

      // Seed Reviews
      for (const r of INITIAL_REVIEWS) {
        await db.insert(reviews).values({
          name: r.name,
          location: r.location,
          rating: r.rating,
          comment: r.comment,
          productName: r.productName,
          verified: r.verified
        });
      }

      // Seed Initial Orders
      for (const o of INITIAL_ORDERS) {
        await db.insert(orders).values({
          id: o.id,
          customerName: o.customerName,
          phone: o.phone,
          itemsJson: JSON.stringify(o.items),
          subtotal: o.subtotal,
          discount: o.discount,
          deliveryFee: o.deliveryFee,
          total: o.total,
          paymentMethod: o.paymentMethod,
          address: o.address,
          district: o.district,
          status: o.status,
          courierName: o.courierName,
          courierPhone: o.courierPhone,
          courierVehicle: o.courierVehicle,
          estimatedMinutes: o.estimatedMinutes,
          temperatureCelsius: o.temperatureCelsius
        });
      }

      // Seed Initial Activity
      await db.insert(activities).values({
        id: `ACT-SQL-BOOT`,
        title: 'PostgreSQL Cloud SQL Initialized',
        detail: 'Connected to Google Cloud SQL PostgreSQL instance and seeded 26 organic produce items.',
        time: 'Just now',
        type: 'system',
        status: 'success',
        actor: 'Cloud SQL Engine',
        actorRole: 'system',
        metadataJson: JSON.stringify({ database: 'PostgreSQL', region: 'europe-west2' })
      });
    }
  } catch (error) {
    console.error('[Cloud SQL] Seeding check error:', error);
  }
}

// Products Queries
export async function getProductsFromDb(filters?: { category?: string; search?: string; inStock?: boolean }) {
  try {
    let query = db.select().from(products);
    const conditions = [];

    if (filters?.category && filters.category !== 'all') {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters?.inStock !== undefined) {
      conditions.push(eq(products.inStock, filters.inStock));
    }
    if (filters?.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    return await query;
  } catch (error) {
    console.error('Error querying products from Cloud SQL:', error);
    throw new Error('Database query for products failed', { cause: error });
  }
}

export async function getProductByIdFromDb(id: number) {
  try {
    const res = await db.select().from(products).where(eq(products.id, id));
    return res[0] || null;
  } catch (error) {
    console.error(`Error querying product #${id} from Cloud SQL:`, error);
    throw new Error(`Database query for product #${id} failed`, { cause: error });
  }
}

export async function insertProductToDb(prod: typeof products.$inferInsert) {
  try {
    const res = await db.insert(products).values(prod).returning();
    return res[0];
  } catch (error) {
    console.error('Error inserting product to Cloud SQL:', error);
    throw new Error('Database insert product failed', { cause: error });
  }
}

export async function updateProductInDb(id: number, updates: Partial<typeof products.$inferInsert>) {
  try {
    const res = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return res[0] || null;
  } catch (error) {
    console.error(`Error updating product #${id} in Cloud SQL:`, error);
    throw new Error(`Database update product #${id} failed`, { cause: error });
  }
}

export async function deleteProductFromDb(id: number) {
  try {
    const res = await db.delete(products).where(eq(products.id, id)).returning();
    return res.length > 0;
  } catch (error) {
    console.error(`Error deleting product #${id} from Cloud SQL:`, error);
    throw new Error(`Database delete product #${id} failed`, { cause: error });
  }
}

// Orders Queries
export async function getOrdersFromDb() {
  try {
    const list = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return list.map(o => ({
      ...o,
      items: JSON.parse(o.itemsJson || '[]')
    }));
  } catch (error) {
    console.error('Error querying orders from Cloud SQL:', error);
    throw new Error('Database query for orders failed', { cause: error });
  }
}

export async function insertOrderToDb(order: typeof orders.$inferInsert) {
  try {
    const res = await db.insert(orders).values(order).returning();
    const created = res[0];
    const parsedItems = JSON.parse(created.itemsJson || '[]');

    // Insert normalized line items into order_items table
    for (const item of parsedItems) {
      if (item && item.product) {
        await db.insert(orderItems).values({
          orderId: created.id,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.quantity * item.product.price,
        }).catch((err: any) => {
          console.warn('[Cloud SQL] Order item insert warning:', err);
        });
      }
    }

    return {
      ...created,
      items: parsedItems
    };
  } catch (error) {
    console.error('Error inserting order into Cloud SQL:', error);
    throw new Error('Database insert order failed', { cause: error });
  }
}

export async function updateOrderStatusInDb(id: string, status: string) {
  try {
    const res = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    const updated = res[0];
    if (!updated) return null;
    return {
      ...updated,
      items: JSON.parse(updated.itemsJson || '[]')
    };
  } catch (error) {
    console.error(`Error updating order status in Cloud SQL:`, error);
    throw new Error(`Database update order status failed`, { cause: error });
  }
}

// Meal Kits Queries
export async function getMealKitsFromDb() {
  try {
    const kits = await db.select().from(mealKits);
    return kits.map(k => ({
      ...k,
      itemsIncluded: JSON.parse(k.itemsIncludedJson || '[]'),
      recipeSteps: JSON.parse(k.recipeStepsJson || '[]')
    }));
  } catch (error) {
    console.error('Error querying meal kits from Cloud SQL:', error);
    throw new Error('Database query for meal kits failed', { cause: error });
  }
}

// Reviews Queries
export async function getReviewsFromDb() {
  try {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error('Error querying reviews from Cloud SQL:', error);
    throw new Error('Database query for reviews failed', { cause: error });
  }
}

export async function insertReviewToDb(rev: typeof reviews.$inferInsert) {
  try {
    const res = await db.insert(reviews).values(rev).returning();
    return res[0];
  } catch (error) {
    console.error('Error inserting review into Cloud SQL:', error);
    throw new Error('Database insert review failed', { cause: error });
  }
}

// Activities Queries
export async function getActivitiesFromDb() {
  try {
    const list = await db.select().from(activities).orderBy(desc(activities.createdAt)).limit(100);
    return list.map(a => ({
      ...a,
      metadata: a.metadataJson ? JSON.parse(a.metadataJson) : undefined
    }));
  } catch (error) {
    console.error('Error querying activities from Cloud SQL:', error);
    throw new Error('Database query for activities failed', { cause: error });
  }
}

export async function insertActivityToDb(act: typeof activities.$inferInsert) {
  try {
    const res = await db.insert(activities).values(act).returning();
    return res[0];
  } catch (error) {
    console.error('Error inserting activity into Cloud SQL:', error);
    throw new Error('Database insert activity failed', { cause: error });
  }
}

// Categories Queries
export async function getCategoriesFromDb() {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.error('Error querying categories from Cloud SQL:', error);
    throw new Error('Database query for categories failed', { cause: error });
  }
}

// Delivery Zones Queries
export async function getDeliveryZonesFromDb() {
  try {
    return await db.select().from(deliveryZones);
  } catch (error) {
    console.error('Error querying delivery zones from Cloud SQL:', error);
    throw new Error('Database query for delivery zones failed', { cause: error });
  }
}

// Farm Passports Queries
export async function getFarmPassportsFromDb() {
  try {
    return await db.select().from(farmPassports);
  } catch (error) {
    console.error('Error querying farm passports from Cloud SQL:', error);
    throw new Error('Database query for farm passports failed', { cause: error });
  }
}

// Store Settings Queries
export async function getStoreSettingsFromDb() {
  try {
    const list = await db.select().from(storeSettings).limit(1);
    return list[0] || null;
  } catch (error) {
    console.error('Error querying store settings from Cloud SQL:', error);
    throw new Error('Database query for store settings failed', { cause: error });
  }
}

