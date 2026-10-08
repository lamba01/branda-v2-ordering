import { create } from "zustand";
import type { CartItem, MarketCode } from "@/types";

export interface PlacedOrder {
  id: string;
  market: MarketCode;
  name: string;
  email: string;
  items: CartItem[];
}

interface OrderState {
  order: PlacedOrder | null;
  setOrder: (order: PlacedOrder) => void;
}

export const useOrder = create<OrderState>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
}));
