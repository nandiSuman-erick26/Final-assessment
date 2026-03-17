"use client";

import React, { useState, useEffect } from "react";
import { loadCart } from "@/hooks/slicers/cartSlice";
import { useAppDispatch } from "@/hooks/store/hooks";

export const CartInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("groceryCartState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch(loadCart(parsedState));
      } catch (e) {
        console.error("Could not parse saved cart state", e);
      }
    }
  }, [dispatch]);

  if (!mounted) return null; 
  return <>{children}</>;
};
