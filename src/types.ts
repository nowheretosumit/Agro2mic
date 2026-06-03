/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'farmer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  location: string;
  description: string;
  rating: number;
  bannerImage: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  deliveryAddress: string;
  phone: string;
  balance: number;
}

export interface DriverProfile {
  id: string;
  userId: string;
  vehicleType: string;
  vehiclePlate: string;
  status: 'idle' | 'delivering';
  currentLat: number;
  currentLng: number;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  unit: string; // e.g. "kg", "crate", "bunch"
  stock: number;
  image: string;
  freshnessScore: number;
  freshnessLabel: 'AAA Super Fresh' | 'AA Very Fresh' | 'Good' | 'Fair';
  rating: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  farmerId: string;
  farmName: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'accepted' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  deliveryId?: string;
  deliveryETA: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  driverName: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivering' | 'delivered';
  originName: string;
  destName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  currentLat: number;
  currentLng: number;
  progress: number; // 0 to 100
  eta: number; // minutes remaining
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'system' | 'freshness';
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  customerProfile: CustomerProfile | null;
  farmerProfile: FarmerProfile | null;
  driverProfile: DriverProfile | null;
  products: Product[];
  orders: Order[];
  deliveries: Delivery[];
  notifications: Notification[];
  cart: { [productId: string]: number }; // productId -> quantity
  selectedRole: UserRole;
}
