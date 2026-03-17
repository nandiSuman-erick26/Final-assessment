import React from "react";

export interface Product {
  name: string;
  category: string;
  price: number;
  unit: string;
  icon: React.ElementType;
}
