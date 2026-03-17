import {
  Apple,
  Banana,
  Citrus,
  Cherry,
  Grape,
  Carrot,
  Salad,
  Leaf,
  Sprout,
  Flower2,
  Milk,
  IceCream,
  Sandwich,
  Pizza,
  Wheat,
  Croissant,
  Cookie,
  CakeSlice,
  Donut,
  Coffee,
  GlassWater,
  Beer,
  Nut,
} from "lucide-react";

import { Product } from "@/typeScript/interfaces/product.interface";

const groceryItems: Product[] = [
  // Fruits
  { name: "Apple", category: "Fruits", price: 120, unit: "kg", icon: Apple },
  { name: "Banana", category: "Fruits", price: 50, unit: "dozen", icon: Banana },
  { name: "Orange", category: "Fruits", price: 80, unit: "kg", icon: Citrus },
  { name: "Mango", category: "Fruits", price: 150, unit: "kg", icon: Cherry },
  { name: "Papaya", category: "Fruits", price: 60, unit: "piece", icon: Grape },

  // Vegetables
  { name: "Potato", category: "Vegetables", price: 30, unit: "kg", icon: Carrot },
  { name: "Tomato", category: "Vegetables", price: 40, unit: "kg", icon: Salad },
  { name: "Onion", category: "Vegetables", price: 35, unit: "kg", icon: Leaf },
  { name: "Carrot", category: "Vegetables", price: 55, unit: "kg", icon: Sprout },
  { name: "Spinach", category: "Vegetables", price: 25, unit: "bunch", icon: Flower2 },

  // Dairy
  { name: "Milk", category: "Dairy", price: 60, unit: "liter", icon: Milk },
  { name: "Curd", category: "Dairy", price: 50, unit: "500g", icon: IceCream },
  { name: "Paneer", category: "Dairy", price: 320, unit: "kg", icon: CakeSlice },
  { name: "Butter", category: "Dairy", price: 250, unit: "500g", icon: Sandwich },
  { name: "Cheese", category: "Dairy", price: 400, unit: "kg", icon: Pizza },

  // Grains
  { name: "Rice", category: "Grains", price: 70, unit: "kg", icon: Wheat },
  { name: "Wheat Flour", category: "Grains", price: 45, unit: "kg", icon: Croissant },
  { name: "Oats", category: "Grains", price: 180, unit: "packet", icon: Cookie },
  { name: "Poha", category: "Grains", price: 65, unit: "500g", icon: CakeSlice },
  { name: "Suji", category: "Grains", price: 50, unit: "500g", icon: Donut },

  // Beverages
  { name: "Tea", category: "Beverages", price: 220, unit: "500g", icon: Leaf },
  { name: "Coffee", category: "Beverages", price: 350, unit: "200g", icon: Coffee },
  { name: "Fruit Juice", category: "Beverages", price: 110, unit: "liter", icon: GlassWater },
  { name: "Soft Drink", category: "Beverages", price: 90, unit: "2 liter", icon: Beer },
  { name: "Coconut Water", category: "Beverages", price: 45, unit: "piece", icon: Nut },
];

export default groceryItems;
