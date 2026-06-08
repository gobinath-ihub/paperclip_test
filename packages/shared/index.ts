export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  category?: Category;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  product?: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface Order {
  id: number;
  userId: number;
  user?: User;
  items: any; // Can be JSON string or parsed object
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
