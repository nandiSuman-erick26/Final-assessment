import { configureStore, Middleware } from "@reduxjs/toolkit";
import cartReducer from "../slicers/cartSlice";

// Middleware to sync cart state to localStorage automatically
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const state = storeAPI.getState();

  if (typeof window !== "undefined") {
   
    localStorage.setItem(
      "groceryCartState",
      JSON.stringify({
        items: state.cart.items,
        history: state.cart.history,
        appliedCoupon: state.cart.appliedCoupon,
      }),
    );
  }

  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
