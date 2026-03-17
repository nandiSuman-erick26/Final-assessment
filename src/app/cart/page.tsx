"use client";

import { useState } from "react";
import {
  Trash2,
  Undo2,
  X,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  ChevronDown,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  undoAction,
  applyCoupon,
  removeCoupon,
  VALID_COUPONS,
  THRESHOLD_AMOUNT,
  THRESHOLD_DISCOUNT_PERCENTAGE,
} from "@/hooks/slicers/cartSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, appliedCoupon, history } = useAppSelector(
    (state) => state.cart,
  );
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [offersOpen, setOffersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Coupon metadata for display cards
  const couponDetails: Record<
    string,
    { label: string; description: string; color: string }
  > = {
    SAVE10: {
      label: "10% OFF",
      description: "Get 10% off on your total order",
      color: "emerald",
    },
    SAVE20: {
      label: "20% OFF",
      description: "Get 20% off on your total order",
      color: "blue",
    },
    HALFPRICE: {
      label: "50% OFF",
      description: "Half price on your entire cart!",
      color: "purple",
    },
  };

  const hasHistory = history.length > 1;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calculate Threshold Discount
  const hasThresholdDiscount = subtotal >= THRESHOLD_AMOUNT;
  const thresholdDiscountValue = hasThresholdDiscount
    ? (subtotal * THRESHOLD_DISCOUNT_PERCENTAGE) / 100
    : 0;

  // Calculate Coupon Discount
  const couponDiscountPercentage = appliedCoupon
    ? VALID_COUPONS[appliedCoupon].discount
    : 0;
  const intermediateTotal = subtotal - thresholdDiscountValue;
  const couponDiscountValue = appliedCoupon
    ? (intermediateTotal * couponDiscountPercentage) / 100
    : 0;

  const finalTotal = intermediateTotal - couponDiscountValue;
  const totalSavings = thresholdDiscountValue + couponDiscountValue;

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponInput) return;
    const code = couponInput.toUpperCase();
    const coupon = VALID_COUPONS[code];
    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }
    if (subtotal < coupon.minCartValue) {
      setCouponError(
        `Add ₹${(coupon.minCartValue - subtotal).toFixed(0)} more to unlock ${code}.`,
      );
      return;
    }
    dispatch(applyCoupon(code));
    setCouponInput("");
  };

  const handleApplyCouponCode = (code: string) => {
    const coupon = VALID_COUPONS[code];
    if (!coupon || subtotal < coupon.minCartValue) return;
    dispatch(applyCoupon(code));
    setOffersOpen(false);
    setCouponInput("");
    setCouponError("");
  };

  const handleProceedToPay = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    dispatch(clearCart());
    router.push("/");
    toast.success("Thank you for shopping with us! 🛍️");
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-8">
        <div className="p-8 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-8 shadow-inner shadow-zinc-200 dark:shadow-zinc-900 border border-zinc-200 dark:border-zinc-700">
          <ShoppingCart
            size={80}
            className="text-zinc-300 dark:text-zinc-600"
          />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-10 max-w-sm text-center">
          Looks like you haven't added anything to your cart yet. Let's find
          something delicious!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button className="h-14 px-8 text-lg font-bold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              Start Shopping <ArrowRight className="ml-2" />
            </Button>
          </Link>

          {hasHistory && (
            <Button
              variant="outline"
              onClick={() => dispatch(undoAction())}
              className="h-14 px-8 text-lg font-bold rounded-full border-2 border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center bg-white dark:bg-zinc-900"
            >
              <Undo2 size={20} className="mr-2" /> Undo Last Action
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hover:bg-zinc-100 dark:hover:bg-zinc-900 p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 group"
            >
              <ArrowLeft className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </Link>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl">
                <ShoppingCart size={24} strokeWidth={2.5} />
              </span>
              Shopping Cart
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hidden sm:block">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
            {hasHistory && (
              <Button
                variant="outline"
                className="rounded-full shadow-sm text-zinc-600 dark:text-zinc-300 font-medium"
                onClick={() => dispatch(undoAction())}
                title="Undo Last Action"
              >
                <Undo2 size={16} className="mr-2" />{" "}
                <span className="hidden sm:inline">Undo</span>
              </Button>
            )}
            <Button
              variant="destructive"
              className="rounded-full shadow-sm"
              onClick={() => dispatch(clearCart())}
              title="Clear entire cart"
            >
              <Trash2 size={16} className="mr-2 hidden sm:inline" /> Clear Cart
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-sm font-bold tracking-wide text-zinc-500 uppercase">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 p-6 items-center group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                >
                  {/* Product Info */}
                  <div className="w-full sm:col-span-6 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex shrink-0 items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                      <span className="text-3xl font-black text-emerald-200 dark:text-emerald-800 uppercase leading-none">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 inline-block px-2 py-0.5 rounded-md mb-2">
                        {item.category}
                      </p>
                      <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                        ₹{item.price} /{" "}
                        <span className="font-normal text-[10px] tracking-wider">
                          {item?.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto sm:col-span-3 flex justify-between sm:justify-center items-center">
                    <span className="sm:hidden text-sm font-bold text-zinc-500">
                      Quantity
                    </span>
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              name: item.name,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-600 hover:text-red-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              name: item.name,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-600 hover:text-emerald-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-end items-center">
                    <span className="sm:hidden text-sm font-bold text-zinc-500">
                      Total
                    </span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto sm:col-span-1 flex justify-end">
                    <button
                      onClick={() => dispatch(removeFromCart(item.name))}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900"
                      title="Remove product"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 sticky top-28">
            <h2 className="text-2xl font-black mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>
            <div className="mb-8 space-y-3">
              <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                Coupons & Offers
              </label>

              {!appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex gap-2 relative">
                    <Input
                      placeholder="Enter promo code..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      className="rounded-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 h-12 pl-4 pr-24 focus-visible:ring-emerald-500 shadow-inner font-medium uppercase placeholder:normal-case placeholder:font-normal"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      className="absolute right-1 top-1 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white font-bold"
                    >
                      Apply
                    </Button>
                  </div>

                  {couponError && (
                    <p className="text-red-500 text-sm font-medium flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-100 dark:border-red-900">
                      <AlertCircle size={16} /> {couponError}
                    </p>
                  )}

                  <button
                    onClick={() => setOffersOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all group"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      <Tag size={15} /> View Available Offers
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 group-hover:text-emerald-500 transition-all duration-300 ${
                        offersOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      offersOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-2 space-y-3">
                      {Object.entries(VALID_COUPONS).map(([code, coupon]) => {
                        const meta = couponDetails[code];
                        const isUnlocked = subtotal >= coupon.minCartValue;
                        const amountNeeded = coupon.minCartValue - subtotal;
                        const progress =
                          coupon.minCartValue > 0
                            ? Math.min(
                                (subtotal / coupon.minCartValue) * 100,
                                100,
                              )
                            : 100;

                        const colorMap: Record<string, string> = {
                          emerald:
                            "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/50",
                          blue: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/50",
                          purple:
                            "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/50",
                        };
                        const lockedStyle =
                          "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 opacity-70 cursor-not-allowed";
                        const badgeMap: Record<string, string> = {
                          emerald:
                            "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
                          blue: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
                          purple:
                            "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
                        };
                        const accentColor =
                          meta.color === "emerald"
                            ? "text-emerald-500"
                            : meta.color === "blue"
                              ? "text-blue-500"
                              : "text-purple-500";
                        const progressColor =
                          meta.color === "emerald"
                            ? "bg-emerald-400"
                            : meta.color === "blue"
                              ? "bg-blue-400"
                              : "bg-purple-400";
                        const tapColor =
                          meta.color === "emerald"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : meta.color === "blue"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-purple-600 dark:text-purple-400";

                        return (
                          <button
                            key={code}
                            onClick={() =>
                              isUnlocked && handleApplyCouponCode(code)
                            }
                            disabled={!isUnlocked}
                            className={`w-full flex flex-col p-4 rounded-2xl border-2 transition-all text-left ${
                              isUnlocked
                                ? `group ${colorMap[meta.color]}`
                                : lockedStyle
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-3xl font-black leading-none ${isUnlocked ? accentColor : "text-zinc-400"}`}
                                >
                                  {coupon.discount}%
                                </span>
                                <div>
                                  <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">
                                    {meta.description}
                                  </p>
                                  <span
                                    className={`text-xs font-black tracking-widest uppercase px-2 py-0.5 rounded-md mt-1 inline-block ${
                                      isUnlocked
                                        ? badgeMap[meta.color]
                                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                                    }`}
                                  >
                                    {code}
                                  </span>
                                </div>
                              </div>
                              {isUnlocked ? (
                                <span
                                  className={`text-xs font-bold shrink-0 ${tapColor} group-hover:scale-110 transition-transform`}
                                >
                                  Tap to Apply →
                                </span>
                              ) : (
                                <span className="text-lg">🔒</span>
                              )}
                            </div>

                            {!isUnlocked && coupon.minCartValue > 0 && (
                              <div className="mt-3 w-full">
                                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                  <span>
                                    Add ₹{amountNeeded.toFixed(0)} more to
                                    unlock
                                  </span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Alert className="bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shadow-sm rounded-2xl pr-12 relative animate-in fade-in zoom-in-95 duration-300">
                  <AlertDescription className="text-emerald-800 dark:text-emerald-300 font-medium flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      Code applied:{" "}
                      <strong className="text-emerald-900 dark:text-white uppercase tracking-wider">
                        {appliedCoupon}
                      </strong>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">
                        (-{VALID_COUPONS[appliedCoupon].discount}%)
                      </span>
                    </span>
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-800 hover:text-emerald-900 rounded-full"
                    onClick={() => dispatch(removeCoupon())}
                  >
                    <X size={16} />
                  </Button>
                </Alert>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800 border-dashed">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-lg">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {hasThresholdDiscount ? (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold text-lg items-center bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <span className="flex flex-col">
                    <span>
                      Store Discount (-{THRESHOLD_DISCOUNT_PERCENTAGE}%)
                    </span>
                    <span className="text-xs font-medium text-emerald-500 opacity-80">
                      For orders over ₹{THRESHOLD_AMOUNT}
                    </span>
                  </span>
                  <span>-₹{thresholdDiscountValue.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-zinc-500 dark:text-zinc-400 text-sm bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 border-dashed">
                  <span>
                    Spend{" "}
                    <strong className="text-zinc-900 dark:text-white">
                      ₹{(THRESHOLD_AMOUNT - subtotal).toFixed(2)}
                    </strong>{" "}
                    more to get {THRESHOLD_DISCOUNT_PERCENTAGE}% off your entire
                    order!
                  </span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold text-lg items-center bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <span>
                    Promo {appliedCoupon} (-{couponDiscountPercentage}%)
                  </span>
                  <span>-₹{couponDiscountValue.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-6 mt-6 border-t-2 border-zinc-900 dark:border-zinc-100 flex justify-between items-end">
                <div>
                  <span className="text-xl font-bold text-zinc-900 dark:text-white block">
                    Total Amount
                  </span>
                  {totalSavings > 0 && (
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                      Total Savings: ₹{totalSavings.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full h-16 text-xl font-bold rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-900/20 mt-8 transition-all hover:-translate-y-1 group"
                onClick={handleProceedToPay}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Spinner className="size-6 text-white" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="text-center mt-6">
                <Link
                  href="/"
                  className="text-zinc-500 hover:text-emerald-600 font-medium transition-colors text-sm hover:underline underline-offset-4"
                >
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
