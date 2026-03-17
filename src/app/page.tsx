"use client";

import React, { useState, useEffect } from "react";
import groceryItems from "@/services/JSON/dummyList";
import { ProductCard } from "@/components/layouts/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, ShoppingCart } from "lucide-react";
import ReduxProvider from "@/hooks/utils/ReduxProvider";
import { useAppSelector } from "@/hooks/store/hooks";
import Link from "next/link";
import { CartInitializer } from "@/components/layouts/CartInitializer";

// Main Page Content
const StoreFront = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<
    "default" | "low-high" | "high-low"
  >("default");

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(groceryItems.map((item) => item.category))),
  ];

  // Filter and Sort Logic
  const filteredItems = groceryItems
    .filter((item) => {
      // Search matches
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // Category matches
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0; // default order from dummyList
    });

  return (
    <div className="min-h-screen bg-[#F4F4F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 flex flex-col pb-12">
      {/* Header spanning full width */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg">
              <ShoppingBag size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
                FreshBasket
              </h1>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 mt-1 uppercase tracking-wider hidden sm:block">
                Grocery shopping made easy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-full md:w-80 relative group hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-full border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 shadow-inner focus-visible:ring-emerald-500 font-medium w-full text-sm"
              />
            </div>

            <Link href="/cart">
              <Button className="rounded-full shadow-md bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-10 px-4 flex items-center gap-2 group transition-all hover:scale-105 active:scale-95">
                <ShoppingCart
                  size={18}
                  className="group-hover:-rotate-12 transition-transform"
                />
                <span className="font-bold">Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full ml-1 min-w-[20px] text-center border-2 border-zinc-900 dark:border-white">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {/* Mobile Search - Only visible on small screens */}
        <div className="mb-6 w-full relative group sm:hidden pointer-events-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Search for fresh groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm focus-visible:ring-emerald-500 font-medium w-full pointer-events-auto"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 pointer-events-auto">
          <div className="flex flex-wrap gap-2 flex-1 pointer-events-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full shadow-sm font-bold transition-all border-2 ${
                  selectedCategory === category
                    ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 hover:border-emerald-700"
                    : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-black p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-inner">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder("default")}
              className={`rounded-full h-9 px-5 text-sm font-bold transition-all ${sortOrder === "default" && "bg-white dark:bg-zinc-800 shadow-md text-emerald-600 dark:text-emerald-400"}`}
            >
              Popular
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder("low-high")}
              className={`rounded-full h-9 px-5 text-sm font-bold transition-all ${sortOrder === "low-high" && "bg-white dark:bg-zinc-800 shadow-md text-emerald-600 dark:text-emerald-400"}`}
            >
              $ Low-High
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder("high-low")}
              className={`rounded-full h-9 px-5 text-sm font-bold transition-all ${sortOrder === "high-low" && "bg-white dark:bg-zinc-800 shadow-md text-emerald-600 dark:text-emerald-400"}`}
            >
              $ High-Low
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
          {filteredItems.map((item) => (
            <ProductCard key={item.name} product={item} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <Search
                size={48}
                className="text-zinc-300 dark:text-zinc-700 mb-6"
              />
              <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-3">
                No items found
              </h3>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-sm">
                We couldn't find anything matching your search. Try different
                keywords or filters!
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-8 rounded-full h-12 px-8 font-bold bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <ReduxProvider>
      <StoreFront />
    </ReduxProvider>
  );
}
