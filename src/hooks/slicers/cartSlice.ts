import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, CartItem } from "@/typeScript/interfaces/cart.interface";

const initialState: CartState = {
  items: [],
  history: [],
  appliedCoupon: null,
};

// Coupon definition type
export interface CouponDef {
  discount: number;      // percentage
  minCartValue: number;  // minimum subtotal required to use this coupon
}

// Valid coupons map (Code -> CouponDef)
export const VALID_COUPONS: Record<string, CouponDef> = {
  SAVE10:    { discount: 10, minCartValue: 0   },  // always available
  SAVE20:    { discount: 20, minCartValue: 500 },  // unlock at ₹500
  HALFPRICE: { discount: 50, minCartValue: 1000 }, // unlock at ₹1000
};

// Threshold discount (automatic — if subtotal > THRESHOLD_AMOUNT, deduct THRESHOLD_DISCOUNT_PERCENTAGE%)
export const THRESHOLD_AMOUNT = 500;
export const THRESHOLD_DISCOUNT_PERCENTAGE = 10;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items || [];
      state.history = action.payload.history || [];
      state.appliedCoupon = action.payload.appliedCoupon || null;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Save deep copy to history for undo
      state.history.push(JSON.parse(JSON.stringify(state.items)));

      const existingItem = state.items.find((item) => item.name === action.payload.name);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      // action.payload is the item name
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      state.items = state.items.filter((item) => item.name !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ name: string; quantity: number }>) => {
      state.history.push(JSON.parse(JSON.stringify(state.items)));
      const item = state.items.find((i) => i.name === action.payload.name);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.name !== action.payload.name);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.history=[];
      state.items = [];
    },
    undoAction: (state) => {
      if (state.history.length > 1) {
        const previousState = state.history.pop();
        if (previousState) {
          state.items = previousState;
        }
      }
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase();
      if (VALID_COUPONS[code]) {
        state.appliedCoupon = code;
      }
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
});

export const {
  loadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  undoAction,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
