export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  tendered: number;
  change: number;
  timestamp: number;
  paymentMethod: 'CASH';
}

export interface SalesSummary {
  totalRevenue: number;
  totalTransactions: number;
  itemsSold: number;
  averageOrderValue: number;
}