import { Product, Order, CustomerReview, SystemActivity, MealKit } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, MEAL_KITS, INITIAL_ACTIVITIES, INITIAL_REVIEWS } from '../data/mockData';

export interface DatabaseHealth {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  nodeVersion: string;
  database: {
    engine: string;
    version?: string;
    lastUpdated?: string;
    productsCount: number;
    ordersCount: number;
    activeOrders: number;
    orm?: string;
    region?: string;
    sqlHost?: string;
  };
}

export interface DbTableStat {
  tableName: string;
  rowCount: number;
  columnCount: number;
}

export interface DbMigrationRecord {
  id: number;
  version: string;
  name: string;
  appliedAt: string | null;
  details: string | null;
}

export interface DbSystemStatus {
  status: 'connected' | 'degraded' | 'error';
  engine: string;
  region: string;
  databaseName: string;
  pingMs: number;
  tables: DbTableStat[];
  totalTables: number;
  totalRows: number;
  migrations: DbMigrationRecord[];
  activeForeignKeysCount: number;
  mode?: string;
}

export interface SqlQueryResult {
  columns: string[];
  rows: any[];
  rowCount: number;
  durationMs: number;
}

export const api = {
  // Check Node.js and database connection
  async checkHealth(): Promise<DatabaseHealth | null> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; inStock?: boolean }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.inStock !== undefined) query.set('inStock', String(params.inStock));

      const url = `/api/products${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('[API Client] Backend unreachable, using local fallback:', err);
      let list = [...INITIAL_PRODUCTS];
      if (params?.category && params.category !== 'all') {
        list = list.filter(p => p.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q));
      }
      return list;
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Failed to create product');
      return await res.json();
    } catch {
      return { ...product, id: Date.now() };
    }
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update product');
      return await res.json();
    } catch {
      return null;
    }
  },

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async createOrder(orderData: any): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to create order');
      return await res.json();
    } catch {
      return {
        ...orderData,
        id: orderData.id || `FOFO-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
    }
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Meal Kits
  async getMealKits(): Promise<MealKit[]> {
    try {
      const res = await fetch('/api/meal-kits');
      if (!res.ok) throw new Error('Failed to fetch meal kits');
      return await res.json();
    } catch {
      return MEAL_KITS;
    }
  },

  // Reviews
  async getReviews(): Promise<CustomerReview[]> {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  async addReview(review: any): Promise<CustomerReview> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (!res.ok) throw new Error('Failed to post review');
      return await res.json();
    } catch {
      return { ...review, id: Date.now(), date: new Date().toISOString().slice(0, 10), verified: true };
    }
  },

  // System Activities
  async getActivities(): Promise<SystemActivity[]> {
    try {
      const res = await fetch('/api/activities');
      if (!res.ok) throw new Error('Failed to fetch activities');
      return await res.json();
    } catch {
      return INITIAL_ACTIVITIES;
    }
  },

  async addActivity(act: any): Promise<SystemActivity> {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(act)
      });
      if (!res.ok) throw new Error('Failed to log activity');
      return await res.json();
    } catch {
      return { ...act, id: `ACT-${Date.now()}`, time: 'Just now', timestamp: new Date().toISOString() };
    }
  },

  // Reset database
  async resetDatabase(): Promise<boolean> {
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // --- Database Apply System ---
  async getDbSystemStatus(): Promise<DbSystemStatus | null> {
    try {
      const res = await fetch('/api/db/system-status');
      if (!res.ok) throw new Error('Failed to fetch DB system status');
      return await res.json();
    } catch {
      return null;
    }
  },

  async applyDatabaseSystem(): Promise<{ success: boolean; message: string; timestamp?: string }> {
    try {
      const res = await fetch('/api/db/apply-system', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to apply database system');
      return await res.json();
    } catch (e: any) {
      return { 
        success: false, 
        message: e?.message || 'Error executing database system apply' 
      };
    }
  },

  async executeAdminSql(sql: string): Promise<SqlQueryResult> {
    try {
      const res = await fetch('/api/db/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'SQL execution failed');
      }
      return await res.json();
    } catch (err: any) {
      return {
        columns: ['error_status', 'message'],
        rows: [{ error_status: 'Query Failed', message: err?.message || 'Unknown error' }],
        rowCount: 0,
        durationMs: 0
      };
    }
  }
};
