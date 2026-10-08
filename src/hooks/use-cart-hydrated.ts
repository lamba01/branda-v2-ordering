"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useCart.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }
    return useCart.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
