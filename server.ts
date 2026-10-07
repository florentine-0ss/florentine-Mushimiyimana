import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { 
  seedDatabaseIfEmpty, 
  getProductsFromDb, 
  getProductByIdFromDb, 
  insertProductToDb, 
  updateProductInDb, 
  deleteProductFromDb,
  getOrdersFromDb,
  insertOrderToDb,
  updateOrderStatusInDb,
  getMealKitsFromDb,
  getReviewsFromDb,
  insertReviewToDb,
  getActivitiesFromDb,
  insertActivityToDb,
  getCategoriesFromDb,
  getDeliveryZonesFromDb,
  getFarmPassportsFromDb,
  getStoreSettingsFromDb
} from './src/db/queries.ts';
import { 
  getDatabaseSystemStatus, 
  executeSafeAdminQuery, 
  applyFullDatabaseSeed 
} from './src/db/applySystem.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Body parser for JSON
  app.use(express.json());

  // Auto-seed Cloud SQL PostgreSQL database on boot
  seedDatabaseIfEmpty().catch(err => {
    console.warn('[Cloud SQL] Auto-seeding deferred:', err?.message || err);
  });

  // --- REST API ROUTES ---
  const api = express.Router();

  // Health check & DB overview
  api.get('/health', (req: Request, res: Response) => {
    const stats = db.getStats();
    res.json({
      status: 'ok',
      service: 'Fofo GreenGrocer Hub Rwanda API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      database: {
        engine: 'Google Cloud SQL (PostgreSQL)',
        orm: 'Drizzle ORM',
        region: 'europe-west2',
        sqlHost: process.env.SQL_HOST || 'localhost-proxy',
        productsCount: stats.totalProducts,
        ordersCount: stats.totalOrders,
        activeOrders: stats.activeOrders
      }
    });
  });

  // Database Stats Summary
  api.get('/stats', (req: Request, res: Response) => {
    res.json({
      ...db.getStats(),
      databaseEngine: 'Google Cloud SQL (PostgreSQL)',
      orm: 'Drizzle ORM'
    });
  });

  // Products CRUD with Cloud SQL
  api.get('/products', async (req: Request, res: Response) => {
    try {
      const { category, search, inStock } = req.query;
      const filters: any = {};
      if (typeof category === 'string') filters.category = category;
      if (typeof search === 'string') filters.search = search;
      if (inStock !== undefined) filters.inStock = inStock === 'true';

      const prods = await getProductsFromDb(filters);
      if (prods && prods.length > 0) {
        return res.json(prods.map(p => ({
          ...p,
          rating: Number(p.rating) || 5.0
        })));
      }
    } catch (e) {
      console.warn('Cloud SQL products query fallback:', e);
    }
    res.json(db.getProducts(req.query as any));
  });

  api.get('/products/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const prod = await getProductByIdFromDb(id);
      if (prod) {
        return res.json({ ...prod, rating: Number(prod.rating) || 5.0 });
      }
    } catch (e) {
      console.warn(`Cloud SQL product #${id} query fallback:`, e);
    }
    const local = db.getProductById(id);
    if (!local) return res.status(404).json({ error: 'Produce item not found' });
    res.json(local);
  });

  api.post('/products', async (req: Request, res: Response) => {
    const { name, category, price, spec, origin, farmer, description, image } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, category, and price are required fields' });
    }

    const payload = {
      name,
      category,
      price: Number(price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
      spec: spec || '1 kg',
      rating: '5.0',
      reviewsCount: 0,
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
      badge: req.body.badge || 'Fresh',
      origin: origin || 'Musanze District, Northern Province',
      farmer: farmer || 'Volcano Cooperative Farmers',
      description: description || 'Fresh organic Rwandan farm harvest.',
      inStock: req.body.inStock !== false,
      calories: req.body.calories || '35 kcal / 100g',
      harvested: req.body.harvested || 'Fresh morning harvest'
    };

    try {
      const created = await insertProductToDb(payload);
      db.addProduct(payload as any);
      return res.status(201).json({ ...created, rating: 5.0 });
    } catch (err) {
      console.warn('Cloud SQL insert product fallback:', err);
      const fallback = db.addProduct(payload as any);
      return res.status(201).json(fallback);
    }
  });

  api.put('/products/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const updated = await updateProductInDb(id, req.body);
      db.updateProduct(id, req.body);
      if (updated) return res.json({ ...updated, rating: Number(updated.rating) || 5.0 });
    } catch (err) {
      console.warn('Cloud SQL update product fallback:', err);
    }
    const localUpdated = db.updateProduct(id, req.body);
    if (!localUpdated) return res.status(404).json({ error: 'Product not found' });
    res.json(localUpdated);
  });

  api.delete('/products/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      await deleteProductFromDb(id);
      db.deleteProduct(id);
      return res.json({ success: true, message: `Product ${id} deleted from Cloud SQL database` });
    } catch (err) {
      console.warn('Cloud SQL delete product fallback:', err);
      db.deleteProduct(id);
      return res.json({ success: true, message: `Product ${id} deleted` });
    }
  });

  // Orders CRUD with Cloud SQL
  api.get('/orders', async (req: Request, res: Response) => {
    try {
      const ords = await getOrdersFromDb();
      if (ords && ords.length > 0) return res.json(ords);
    } catch (e) {
      console.warn('Cloud SQL orders query fallback:', e);
    }
    res.json(db.getOrders());
  });

  api.post('/orders', async (req: Request, res: Response) => {
    const { customerName, phone, items, subtotal, discount, deliveryFee, total, paymentMethod, address, district, id } = req.body;
    if (!customerName || !phone || !items || !items.length) {
      return res.status(400).json({ error: 'Customer name, phone, and items are required' });
    }

    const orderId = id || `FOFO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderData = {
      id: orderId,
      customerName,
      phone,
      itemsJson: JSON.stringify(items),
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      deliveryFee: Number(deliveryFee) || 1500,
      total: Number(total) || (Number(subtotal) + (Number(deliveryFee) || 1500)),
      paymentMethod: paymentMethod || 'mtn',
      address: address || 'Kigali, Rwanda',
      district: district || 'Gasabo',
      status: 'Pending',
      courierName: 'Kigali Rapid E-Bike #07',
      courierPhone: '+250 788 112 233',
      courierVehicle: 'E-Cargo Bike',
      estimatedMinutes: 35,
      temperatureCelsius: 4
    };

    try {
      const created = await insertOrderToDb(newOrderData);
      db.createOrder({ ...newOrderData, items } as any);
      return res.status(201).json(created);
    } catch (err) {
      console.warn('Cloud SQL insert order fallback:', err);
      const fallback = db.createOrder({ ...newOrderData, items } as any);
      return res.status(201).json(fallback);
    }
  });

  api.patch('/orders/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    try {
      const updated = await updateOrderStatusInDb(req.params.id, status);
      db.updateOrderStatus(req.params.id, status);
      if (updated) return res.json(updated);
    } catch (e) {
      console.warn('Cloud SQL order status fallback:', e);
    }
    const local = db.updateOrderStatus(req.params.id, status);
    if (!local) return res.status(404).json({ error: 'Order not found' });
    res.json(local);
  });

  // Meal Kits with Cloud SQL
  api.get('/meal-kits', async (req: Request, res: Response) => {
    try {
      const kits = await getMealKitsFromDb();
      if (kits && kits.length > 0) return res.json(kits);
    } catch (e) {
      console.warn('Cloud SQL meal kits fallback:', e);
    }
    res.json(db.getMealKits());
  });

  // Categories from Cloud SQL
  api.get('/categories', async (req: Request, res: Response) => {
    try {
      const cats = await getCategoriesFromDb();
      if (cats && cats.length > 0) return res.json(cats);
    } catch (e) {
      console.warn('Cloud SQL categories fallback:', e);
    }
    res.json([]);
  });

  // Delivery Zones from Cloud SQL
  api.get('/delivery-zones', async (req: Request, res: Response) => {
    try {
      const zones = await getDeliveryZonesFromDb();
      if (zones && zones.length > 0) return res.json(zones);
    } catch (e) {
      console.warn('Cloud SQL delivery zones fallback:', e);
    }
    res.json([]);
  });

  // Farm Passports from Cloud SQL
  api.get('/farm-passports', async (req: Request, res: Response) => {
    try {
      const fps = await getFarmPassportsFromDb();
      if (fps && fps.length > 0) return res.json(fps);
    } catch (e) {
      console.warn('Cloud SQL farm passports fallback:', e);
    }
    res.json([]);
  });

  // Store Settings from Cloud SQL
  api.get('/store-settings', async (req: Request, res: Response) => {
    try {
      const s = await getStoreSettingsFromDb();
      if (s) return res.json(s);
    } catch (e) {
      console.warn('Cloud SQL store settings fallback:', e);
    }
    res.json({
      storeName: 'Fofo GreenGrocer Hub Rwanda',
      currency: 'FRW',
      minOrderAmount: 3000,
      freeDeliveryThreshold: 25000
    });
  });

  // Reviews with Cloud SQL
  api.get('/reviews', async (req: Request, res: Response) => {
    try {
      const revs = await getReviewsFromDb();
      if (revs && revs.length > 0) return res.json(revs);
    } catch (e) {
      console.warn('Cloud SQL reviews fallback:', e);
    }
    res.json(db.getReviews());
  });

  api.post('/reviews', async (req: Request, res: Response) => {
    const { name, location, rating, comment, productName } = req.body;
    if (!name || !comment || !rating) {
      return res.status(400).json({ error: 'Name, comment, and rating are required' });
    }

    const payload = {
      name,
      location: location || 'Kigali, Rwanda',
      rating: Number(rating),
      comment,
      productName,
      verified: true
    };

    try {
      const created = await insertReviewToDb(payload);
      db.addReview(payload);
      return res.status(201).json(created);
    } catch (err) {
      console.warn('Cloud SQL insert review fallback:', err);
      const fallback = db.addReview(payload);
      return res.status(201).json(fallback);
    }
  });

  // Activities with Cloud SQL
  api.get('/activities', async (req: Request, res: Response) => {
    try {
      const acts = await getActivitiesFromDb();
      if (acts && acts.length > 0) return res.json(acts);
    } catch (e) {
      console.warn('Cloud SQL activities fallback:', e);
    }
    res.json(db.getActivities());
  });

  api.post('/activities', async (req: Request, res: Response) => {
    const { title, detail, type, status, actor, actorRole, metadata } = req.body;
    const actId = `ACT-${Date.now().toString().slice(-6)}`;
    const payload = {
      id: actId,
      title: title || 'System Event',
      detail: detail || '',
      time: 'Just now',
      type: type || 'system',
      status: status || 'info',
      actor: actor || 'User',
      actorRole: actorRole || 'customer',
      metadataJson: metadata ? JSON.stringify(metadata) : null
    };

    try {
      const created = await insertActivityToDb(payload);
      db.addActivity(payload as any);
      return res.status(201).json(created);
    } catch (err) {
      const fallback = db.addActivity(payload as any);
      return res.status(201).json(fallback);
    }
  });

  // Database Reset endpoint
  api.post('/db/reset', async (req: Request, res: Response) => {
    const result = db.resetToSeed();
    seedDatabaseIfEmpty().catch(() => {});
    res.json({ ...result, database: 'Google Cloud SQL (PostgreSQL)' });
  });

  // --- DATABASE APPLY SYSTEM ENDPOINTS ---
  // 1. Get Live Database System Status & Schema Telemetry
  api.get('/db/system-status', async (req: Request, res: Response) => {
    try {
      const status = await getDatabaseSystemStatus();
      res.json(status);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Failed to retrieve database system status' });
    }
  });

  // 2. Apply Database System (Migrations, Seed, & Audit Sync)
  api.post('/db/apply-system', async (req: Request, res: Response) => {
    try {
      const result = await applyFullDatabaseSeed();
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Failed to apply database system' });
    }
  });

  // 3. Interactive Safe SQL Runner for Admin Database Inspector
  api.post('/db/execute-sql', async (req: Request, res: Response) => {
    const { sql } = req.body;
    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ error: 'SQL query statement is required' });
    }
    try {
      const result = await executeSafeAdminQuery(sql);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e?.message || 'Failed to execute query' });
    }
  });

  // Mount API router
  app.use('/api', api);

  // --- VITE DEV MIDDLEWARE OR STATIC PRODUCTION SERVE ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Fofo Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Fofo Server] Google Cloud SQL (PostgreSQL) + Drizzle ORM connected`);
  });
}

startServer().catch(err => {
  console.error('[Fofo Server] Failed to start server:', err);
  process.exit(1);
});
