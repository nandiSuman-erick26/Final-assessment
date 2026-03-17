# 🛒 FreshBasket — Grocery Cart App

A fully-featured grocery cart application built with **Next.js 15**, **Redux Toolkit**, and **Tailwind CSS**. FreshBasket lets users browse groceries, manage their cart, apply discount coupons with threshold-gating, and persist their session across page reloads — all with a premium, modern UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛍️ **Product Browsing** | 25 grocery items across 5 categories with name, price, and unit |
| 🔍 **Search** | Real-time search bar to filter products by name |
| 🏷️ **Category Filters** | Filter products by Fruits, Vegetables, Dairy, Grains, or Beverages |
| 🔃 **Sorting** | Sort by popularity, price low→high, or price high→low |
| ➕ **Cart Management** | Add, increment, decrement, and remove items from the cart |
| 💾 **Local Storage Persistence** | Cart survives page reloads via Redux middleware → localStorage |
| ↩️ **Undo Last Action** | Revert the last cart change using a saved history stack |
| 🏷️ **Coupon Code System** | Enter promo codes manually or pick from collapsible coupon cards |
| 🔒 **Threshold-Gated Coupons** | Coupons unlock only when cart total meets minimum spend requirements |
| 📊 **Progress Bars** | Visual progress showing how close you are to unlocking a locked coupon |
| 💸 **Automatic Store Discount** | 10% off automatically applied when subtotal exceeds ₹500 |
| 🧾 **Full Cart Page** | Dedicated `/cart` page with item list, quantity controls, and order summary |
| ✅ **Checkout Flow** | "Proceed to Checkout" with a loading spinner, cart clear, and toast confirmation |
| 🔔 **Toast Notifications** | Success feedback when adding items or checking out (via Sonner) |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | Full-stack React framework, file-based routing |
| **TypeScript** | Strong typing throughout |
| **Redux Toolkit** | Global state management for cart |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn UI** | Pre-built `Button`, `Input`, `Card`, `Alert`, etc. |
| **Sonner** | Toast notification library |
| **Lucide React** | Icon library |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── page.tsx                  # Main storefront — search, filters, sorting, product grid
│   ├── layout.tsx                # Root layout — sets up Redux, CartInitializer, Toaster
│   └── cart/
│       └── page.tsx              # Full cart page — items, coupon panel, order summary, checkout
│
├── components/
│   ├── layouts/
│   │   ├── ProductCard.tsx       # Individual product card with add/increment/decrement
│   │   └── CartInitializer.tsx   # Loads cart from localStorage into Redux on mount
│   └── ui/                       # Shadcn UI primitives (Button, Input, Card, etc.)
│       └── spinner.tsx           # Custom SVG spinner (no external dependencies)
│
├── hooks/
│   ├── slicers/
│   │   └── cartSlice.ts          # Redux slice — all cart logic, coupons, undo history
│   ├── store/
│   │   ├── store.ts              # Redux store config + localStorage middleware
│   │   └── hooks.ts              # Typed useAppDispatch / useAppSelector hooks
│   └── utils/
│       └── ReduxProvider.tsx     # Client-side Redux <Provider> wrapper
│
├── services/
│   └── JSON/
│       └── dummyList.ts          # 25 grocery items with name, category, price, unit, icon
│
├── typeScript/
│   ├── interfaces/
│   │   ├── cart.interface.ts     # CartItem and CartState interfaces
│   │   └── product.interface.ts  # Product interface for dummyList items
│   └── types/
│       └── hook.types.ts         # RootState and AppDispatch type exports
│
└── lib/
    └── utils.ts                  # Shadcn utility (cn helper)
```

---

## 🧠 State Management Architecture

The entire cart state lives in **Redux**:

```
CartState {
  items: CartItem[]          // current cart items
  history: CartItem[][]      // stack of previous states (for undo)
  appliedCoupon: string|null // currently active promo code
}
```

### Persistence Flow

```
App Mount
  → CartInitializer reads localStorage["groceryCartState"]
  → Dispatches loadCart() to hydrate Redux

User Action (add/remove/update)
  → Redux reducer updates state
  → localStorage Middleware intercepts
  → Saves { items, history, appliedCoupon } to localStorage
```

### Undo Flow

Every mutating action (`addToCart`, `removeFromCart`, `updateQuantity`) pushes a **deep copy** of the current `items` array onto `history` before modifying state. `undoAction` pops the last snapshot and restores it.

---

## 🎟️ Coupon System

| Code | Discount | Minimum Cart Value |
|---|---|---|
| `SAVE10` | 10% off | ₹0 (always available) |
| `SAVE20` | 20% off | ₹500 |
| `HALFPRICE` | 50% off | ₹1000 |

**Discount stacking order:**
1. Subtotal calculated
2. Automatic store discount applied if subtotal ≥ ₹500 (10% off)
3. Coupon discount applied on the resulting intermediate total

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd mybusket

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📸 Pages

| Route | Description |
|---|---|
| `/` | Main storefront with product grid, search, filters, and cart button |
| `/cart` | Full cart page with item management, coupons, and checkout |

---

## 📝 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
