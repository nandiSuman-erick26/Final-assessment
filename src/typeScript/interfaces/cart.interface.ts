export interface CartItem {
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface CartState {
  items: CartItem[];
  history: CartItem[][];
  appliedCoupon: string | null;
}
