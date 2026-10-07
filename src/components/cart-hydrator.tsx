"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
