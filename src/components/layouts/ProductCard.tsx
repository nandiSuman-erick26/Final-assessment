import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/store/hooks";
import { addToCart, updateQuantity } from "@/hooks/slicers/cartSlice";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    name: string;
    category: string;
    price: number;
    unit: string;
    icon: React.ElementType;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const Icon = product.icon;
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item.name === product.name);

  const handleAdd = () => {
    // Destructure out `icon` — React components are non-serializable and must not go into Redux
    const { icon: _icon, ...serializableProduct } = product;
    dispatch(addToCart({ ...serializableProduct, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleIncrement = () => {
    if (cartItem) {
      dispatch(
        updateQuantity({ name: product.name, quantity: cartItem.quantity + 1 }),
      );
    } else {
      handleAdd();
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      dispatch(
        updateQuantity({ name: product.name, quantity: cartItem.quantity - 1 }),
      );
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl">
      <CardHeader className="bg-zinc-50 dark:bg-zinc-900 pb-4 items-center justify-center grow p-6">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-sm mb-4">
          <Icon
            size={48}
            className="text-emerald-600 dark:text-emerald-400 stroke-[1.5]"
          />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {product.name}
        </CardTitle>
        <p className="text-sm font-medium px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
          {product.category}
        </p>
      </CardHeader>
      <CardContent className="pt-6 pb-2 text-center">
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-baseline justify-center gap-1">
          ₹{product.price}{" "}
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            /{product.unit}
          </span>
        </p>
      </CardContent>
      <CardFooter className="pt-2 pb-6 px-6">
        {!cartItem ? (
          <Button
            onClick={handleAdd}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-200 dark:border-emerald-800 p-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              className="h-8 w-8 rounded-full border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-900 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-400"
            >
              -
            </Button>
            <span className="font-bold w-8 text-center text-emerald-800 dark:text-emerald-300">
              {cartItem.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 rounded-full border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-900 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-400"
            >
              +
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
