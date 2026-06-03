/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { User, FarmerProfile, CustomerProfile, DriverProfile, Product, Order, Delivery, Notification, Review } from '../src/types';

const DB_FILE = path.join(process.cwd(), 'server', 'db.json');

// Ensure database directory exists
const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export interface DBStructure {
  users: User[];
  farmerProfiles: FarmerProfile[];
  customerProfiles: CustomerProfile[];
  driverProfiles: DriverProfile[];
  products: Product[];
  orders: Order[];
  deliveries: Delivery[];
  notifications: Notification[];
  reviews: Review[];
}

const DEFAULT_DB: DBStructure = {
  users: [
    {
      id: 'usr_admin',
      name: 'System Root Admin',
      email: 'admin@farmfresh.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_farmer1',
      name: 'Hari Prasad Acharya',
      email: 'farmer1@farmfresh.com',
      role: 'farmer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_farmer2',
      name: 'Sita Ranabhat',
      email: 'farmer2@farmfresh.com',
      role: 'farmer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_customer1',
      name: 'Utsav Shrestha',
      email: 'customer1@gmail.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_driver1',
      name: 'Arjun Thapa',
      email: 'driver1@delivery.com',
      role: 'driver',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    }
  ],
  farmerProfiles: [
    {
      id: 'frm_1',
      userId: 'usr_farmer1',
      farmName: 'Gyaneshwor Organic Farm',
      location: 'Dhulikhel, Kavre (26 km)',
      description: 'Gyaneshwor Organic Farm is committed to heirloom and regenerative farming practices. We produce nutrient-rich leafy greens, tomatoes, and root crops using purely natural organic compost and biodynamic farming.',
      rating: 4.9,
      bannerImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'frm_2',
      userId: 'usr_farmer2',
      farmName: 'Mustang Agriculture & Creamery',
      location: 'Bidur, Nuwakot (35 km)',
      description: 'Three generations of growers specializing in sweet stone fruits, organic apples, and raw, grass-fed dairy products. Our cows roam and graze on Himalayan native foothills daily.',
      rating: 4.8,
      bannerImage: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80',
    }
  ],
  customerProfiles: [
    {
      id: 'cust_1',
      userId: 'usr_customer1',
      deliveryAddress: 'Jhamsikhel-3, Lalitpur, Nepal',
      phone: '+977-9851012345',
      balance: 15000.00,
    }
  ],
  driverProfiles: [
    {
      id: 'drv_1',
      userId: 'usr_driver1',
      vehicleType: 'Eco Electric Trike',
      vehiclePlate: 'BA-2-PA-739X',
      status: 'idle',
      currentLat: 27.6191,
      currentLng: 85.5531,
    }
  ],
  products: [
    {
      id: 'prd_1',
      farmerId: 'frm_1',
      farmerName: 'Hari Prasad Acharya',
      farmName: 'Gyaneshwor Organic Farm',
      title: 'Dhulikhel Butterhead Lettuce',
      description: 'Crisp, sweet organic head lettuce harvested at dawn with root balls kept intact for supreme freshness.',
      category: 'Vegetables',
      price: 120.00,
      unit: 'head',
      stock: 45,
      image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=600&q=80',
      freshnessScore: 97,
      freshnessLabel: 'AAA Super Fresh',
      rating: 4.9,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prd_2',
      farmerId: 'frm_1',
      farmerName: 'Hari Prasad Acharya',
      farmName: 'Gyaneshwor Organic Farm',
      title: 'Local Organic Tomatoes',
      description: 'Juicy, deep red tomatoes ripened on the vine in Dhulikhel hills. Exploding with sweetness and fresh aroma.',
      category: 'Vegetables',
      price: 150.00,
      unit: 'kg',
      stock: 120,
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
      freshnessScore: 94,
      freshnessLabel: 'AAA Super Fresh',
      rating: 4.7,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prd_3',
      farmerId: 'frm_2',
      farmerName: 'Sita Ranabhat',
      farmName: 'Mustang Agriculture & Creamery',
      title: 'Mustang Organic Apples',
      description: 'Crisp, sweet apples from orchards of Mustang foothills. Organic canopy grown, pesticide-free.',
      category: 'Fruits',
      price: 280.00,
      unit: 'kg',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      freshnessScore: 92,
      freshnessLabel: 'AA Very Fresh',
      rating: 4.8,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prd_4',
      farmerId: 'frm_2',
      farmerName: 'Sita Ranabhat',
      farmName: 'Mustang Agriculture & Creamery',
      title: 'Local Premium Whole Milk A2',
      description: 'Pure rich creamline milk from Himalayan grass-fed pasture cows. Refreshingly sweet & wholesome.',
      category: 'Dairy',
      price: 180.00,
      unit: 'litre',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
      freshnessScore: 99,
      freshnessLabel: 'AAA Super Fresh',
      rating: 5.0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prd_5',
      farmerId: 'frm_1',
      farmerName: 'Hari Prasad Acharya',
      farmName: 'Gyaneshwor Organic Farm',
      title: 'Fresh Swiss Rainbow Chard',
      description: 'Brilliant yellow, red, and pink organic leafy stalks. Perfect sweet-earthy tones for organic recipes.',
      category: 'Vegetables',
      price: 110.00,
      unit: 'bunch',
      stock: 40,
      image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=600&q=80',
      freshnessScore: 95,
      freshnessLabel: 'AAA Super Fresh',
      rating: 4.6,
      createdAt: new Date().toISOString(),
    }
  ],
  orders: [
    {
      id: 'ord_1',
      customerId: 'usr_customer1',
      customerName: 'Utsav Shrestha',
      customerAddress: 'Jhamsikhel-3, Lalitpur, Nepal',
      farmerId: 'frm_1',
      farmName: 'Gyaneshwor Organic Farm',
      items: [
        {
          id: 'itm_1',
          productId: 'prd_1',
          title: 'Dhulikhel Butterhead Lettuce',
          price: 120.00,
          quantity: 2,
        },
        {
          id: 'itm_2',
          productId: 'prd_2',
          title: 'Local Organic Tomatoes',
          price: 150.00,
          quantity: 1,
        }
      ],
      totalPrice: 390.00,
      status: 'delivered',
      deliveryId: 'del_1',
      deliveryETA: '0 min (Delivered)',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24h ago
    }
  ],
  deliveries: [
    {
      id: 'del_1',
      orderId: 'ord_1',
      driverId: 'drv_1',
      driverName: 'Arjun Thapa',
      status: 'delivered',
      originName: 'Gyaneshwor Organic Farm',
      destName: 'Jhamsikhel-3, Lalitpur, Nepal',
      originLat: 27.6191,
      originLng: 85.5531,
      destLat: 27.6796,
      destLng: 85.3123,
      currentLat: 27.6796,
      currentLng: 85.3123,
      progress: 100,
      eta: 0,
    }
  ],
  notifications: [
    {
      id: 'not_1',
      userId: 'usr_farmer1',
      title: 'Order Delivered!',
      message: 'Order #ord_1 has been safely delivered to Utsav Shrestha.',
      type: 'order',
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    },
    {
      id: 'not_2',
      userId: 'usr_customer1',
      title: 'Welcome to Agro2mic!',
      message: 'You have been credited Rs. 15,000 inside your digital wallet. Start shopping organic!',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    }
  ],
  reviews: [
    {
      id: 'rev_1',
      productId: 'prd_1',
      customerName: 'Utsav Shrestha',
      rating: 5,
      comment: 'This is the most crisp salad I have had in five years! Kept fresh in my crisper for a week.',
      createdAt: new Date(Date.now() - 3600000 * 23).toISOString(),
    }
  ]
};

export class Database {
  private data: DBStructure;

  constructor() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure standard fields are populated
        this.data.users = this.data.users || [];
        this.data.farmerProfiles = this.data.farmerProfiles || [];
        this.data.customerProfiles = this.data.customerProfiles || [];
        this.data.driverProfiles = this.data.driverProfiles || [];
        this.data.products = this.data.products || [];
        this.data.orders = this.data.orders || [];
        this.data.deliveries = this.data.deliveries || [];
        this.data.notifications = this.data.notifications || [];
        this.data.reviews = this.data.reviews || [];
      } catch (err) {
        console.error('Failed to parse database. Recreating with defaults.', err);
        this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
        this.save();
      }
    } else {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public get(): DBStructure {
    return this.data;
  }

  // Generic querying helpers
  public users = {
    findMany: () => this.data.users,
    findUnique: (predicate: (u: User) => boolean) => this.data.users.find(predicate),
    create: (user: User) => {
      this.data.users.push(user);
      this.save();
      return user;
    }
  };

  public farmerProfiles = {
    findMany: () => this.data.farmerProfiles,
    findUnique: (predicate: (f: FarmerProfile) => boolean) => this.data.farmerProfiles.find(predicate),
    create: (profile: FarmerProfile) => {
      this.data.farmerProfiles.push(profile);
      this.save();
      return profile;
    }
  };

  public customerProfiles = {
    findMany: () => this.data.customerProfiles,
    findUnique: (predicate: (c: CustomerProfile) => boolean) => this.data.customerProfiles.find(predicate),
    create: (profile: CustomerProfile) => {
      this.data.customerProfiles.push(profile);
      this.save();
      return profile;
    },
    update: (id: string, updates: Partial<CustomerProfile>) => {
      const idx = this.data.customerProfiles.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.data.customerProfiles[idx] = { ...this.data.customerProfiles[idx], ...updates };
        this.save();
        return this.data.customerProfiles[idx];
      }
      return null;
    }
  };

  public driverProfiles = {
    findMany: () => this.data.driverProfiles,
    findUnique: (predicate: (d: DriverProfile) => boolean) => this.data.driverProfiles.find(predicate),
    create: (profile: DriverProfile) => {
      this.data.driverProfiles.push(profile);
      this.save();
      return profile;
    },
    update: (id: string, updates: Partial<DriverProfile>) => {
      const idx = this.data.driverProfiles.findIndex(d => d.id === id);
      if (idx !== -1) {
        this.data.driverProfiles[idx] = { ...this.data.driverProfiles[idx], ...updates };
        this.save();
        return this.data.driverProfiles[idx];
      }
      return null;
    }
  };

  public products = {
    findMany: () => this.data.products,
    findUnique: (predicate: (p: Product) => boolean) => this.data.products.find(predicate),
    create: (product: Product) => {
      this.data.products.push(product);
      this.save();
      return product;
    },
    update: (id: string, updates: Partial<Product>) => {
      const idx = this.data.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.data.products[idx] = { ...this.data.products[idx], ...updates };
        this.save();
        return this.data.products[idx];
      }
      return null;
    },
    delete: (id: string) => {
      this.data.products = this.data.products.filter(p => p.id !== id);
      this.save();
    }
  };

  public orders = {
    findMany: () => this.data.orders,
    findUnique: (predicate: (o: Order) => boolean) => this.data.orders.find(predicate),
    create: (order: Order) => {
      this.data.orders.push(order);
      this.save();
      return order;
    },
    update: (id: string, updates: Partial<Order>) => {
      const idx = this.data.orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
        this.save();
        return this.data.orders[idx];
      }
      return null;
    }
  };

  public deliveries = {
    findMany: () => this.data.deliveries,
    findUnique: (predicate: (d: Delivery) => boolean) => this.data.deliveries.find(predicate),
    create: (delivery: Delivery) => {
      this.data.deliveries.push(delivery);
      this.save();
      return delivery;
    },
    update: (id: string, updates: Partial<Delivery>) => {
      const idx = this.data.deliveries.findIndex(d => d.id === id);
      if (idx !== -1) {
        this.data.deliveries[idx] = { ...this.data.deliveries[idx], ...updates };
        this.save();
        return this.data.deliveries[idx];
      }
      return null;
    }
  };

  public notifications = {
    findMany: () => this.data.notifications,
    create: (notif: Notification) => {
      this.data.notifications.unshift(notif);
      this.save();
      return notif;
    },
    markAllAsRead: (userId: string) => {
      this.data.notifications.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      this.save();
    }
  };

  public reviews = {
    findMany: () => this.data.reviews,
    create: (rev: Review) => {
      this.data.reviews.push(rev);
      this.save();
      return rev;
    }
  };

  public reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
    this.save();
  }
}

export const db = new Database();
