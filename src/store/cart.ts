import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

const clamp = (n: number) => Math.min(99, Math.max(1, n));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity) =>
        set((state) => {
          const existing = state.items.find((i) => i.key === item.key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === item.key
                  ? { ...i, quantity: clamp(i.quantity + quantity) }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: clamp(quantity) }],
          };
        }),
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: clamp(quantity) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "branda-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
