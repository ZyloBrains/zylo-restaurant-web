"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AddToCartInput, CartItem } from "./cart.types";
import { cartService } from "@/services/cart.service";

type CartOpenBehavior = "manual" | "first-item" | "always";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  total: number;
  hasItems: boolean;
  cartId: number | null;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (input: AddToCartInput) => void;
  increaseQty: (menuItemId: string) => void;
  decreaseQty: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;

  isInCart: (menuItemId: string) => boolean;
  getItemQty: (menuItemId: string) => number;
  checkoutCart: (slug: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
  slug: string;
  openBehavior?: CartOpenBehavior;
};

function getAuthState(): { userId?: number; token?: string } {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      userId: parsed?.state?.user?.id ?? undefined,
      token: parsed?.state?.token ?? undefined,
    };
  } catch {
    return {};
  }
}

function generateSessionId(): string {
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem("cart_session_id", id);
  return id;
}

function deduplicateBackendItems(
  items: import("@/services/cart.service").CartItemResponse[]
): CartItem[] {
  const map = new Map<string, import("@/services/cart.service").CartItemResponse>();
  for (const item of items) {
    const key = item.itemId.toString();
    const existing = map.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(key, { ...item });
    }
  }
  return Array.from(map.values()).map((item) => ({
    id: `cart-${item.itemId}`,
    menuItemId: item.itemId.toString(),
    itemId: item.itemId,
    name: item.itemName,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.imageUrl || "",
    cartItemId: item.id,
    discountPercent: item.discountPercent,
    discountAmount: item.discountAmount,
  }));
}

export function CartProvider({
  children,
  slug,
  openBehavior = "manual",
}: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartId] = useState<number | null>(null);
  const sessionIdRef = useRef<string>("");
  const cartIdRef = useRef<number | null>(null);
  const loadedRef = useRef(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Load existing cart on mount
  useEffect(() => {
    if (!slug || loadedRef.current) return;
    loadedRef.current = true;

    const { userId } = getAuthState();
    const storedSessionId = localStorage.getItem("cart_session_id");

    if (userId) {
      cartService
        .getActiveCart(slug, userId)
        .then((res) => {
          if (res) {
            cartIdRef.current = res.id;
            setCartId(res.id);
            if (res.items?.length) {
              setItems(deduplicateBackendItems(res.items));
            }
          }
        })
        .catch(() => {});
    } else if (storedSessionId) {
      cartService
        .getActiveCart(slug, undefined, storedSessionId)
        .then((res) => {
          if (res) {
            cartIdRef.current = res.id;
            setCartId(res.id);
            sessionIdRef.current = storedSessionId;
            if (res.items?.length) {
              setItems(deduplicateBackendItems(res.items));
            }
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
    setCartId(null);
    const cartId = cartIdRef.current;
    if (cartId && slug) {
      cartIdRef.current = null;
      cartService.clearCart(slug,cartId).catch(() => {});
    }
  }, []);

  const checkoutCart = useCallback(async (slug: string) => {
    const cartId = cartIdRef.current;
    if (cartId) {
      await cartService.checkout(slug, cartId);
    }
  }, []);

  const addItem = useCallback(
    (input: AddToCartInput) => {
      const { userId } = getAuthState();
      const isAuthed = !!userId;
      let sessionId = sessionIdRef.current;

      // Guest: generate sessionId once on first add
      if (!isAuthed && !sessionId) {
        sessionId = generateSessionId();
        sessionIdRef.current = sessionId;
      }

      const identifier = isAuthed ? { userId } : { sessionId };
      let wasEmpty = false;

      setItems((prev) => {
        wasEmpty = prev.length === 0;
        const existing = prev.find((i) => i.menuItemId === input.menuItemId);
        if (existing) {
          return prev.map((item) =>
            item.menuItemId === input.menuItemId
              ? { ...item, quantity: item.quantity + 1, imageUrl: item.imageUrl || input.imageUrl }
              : item
          );
        }
        return [
          ...prev,
          {
            id: `cart-${input.menuItemId}`,
            menuItemId: input.menuItemId,
            itemId: input.itemId,
            name: input.name,
            price: input.price,
            quantity: 1,
            imageUrl: input.imageUrl,
            isSpicy: input.isSpicy,
            isFeatured: input.isFeatured,
            cartItemId: null,
          },
        ];
      });

      if (openBehavior === "always") setIsOpen(true);
      else if (openBehavior === "first-item" && wasEmpty) setIsOpen(true);

      cartService
        .addItem(slug, input.itemId, 1, identifier.userId, identifier.sessionId)
        .then((res) => {
          cartIdRef.current = res.id;
          setCartId(res.id);
          const backendItem = res.items.find(
            (i) => i.itemId === input.itemId
          );
          if (backendItem) {
            setItems((prev) =>
              prev.map((item) =>
                item.menuItemId === input.menuItemId
                  ? { ...item, cartItemId: backendItem.id }
                  : item
              )
            );
          }
        })
        .catch(() => {});
    },
    [slug, openBehavior]
  );

  const increaseQty = useCallback(
    (menuItemId: string) => {
      const target = itemsRef.current.find((i) => i.menuItemId === menuItemId);
      if (!target) return;

      const newQty = target.quantity + 1;
      setItems((prev) =>
        prev.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: newQty }
            : item
        )
      );

      if (slug &&target.cartItemId) {
        cartService
          .updateItem(target.cartItemId, slug,newQty)
          .catch(() => {});
      }
    },
    [slug]
  );

  const decreaseQty = useCallback(
    (menuItemId: string) => {
      const target = itemsRef.current.find((i) => i.menuItemId === menuItemId);
      if (!target) return;

      const newQty = target.quantity - 1;
      setItems((prev) =>
        prev
          .map((item) =>
            item.menuItemId === menuItemId
              ? { ...item, quantity: newQty }
              : item
          )
          .filter((item) => item.quantity > 0)
      );

      if (newQty > 0 && target.cartItemId && slug) {
        cartService
          .updateItem(target.cartItemId, slug, newQty)
          .catch(() => {});
      } else if (newQty === 0 && target.cartItemId && slug) {
        cartService
          .removeItem(slug,target.cartItemId)
          .catch(() => {});
      }
    },
    [slug]
  );

  const removeItem = useCallback(
    (menuItemId: string) => {
      const target = itemsRef.current.find((i) => i.menuItemId === menuItemId);

      setItems((prev) =>
        prev.filter((item) => item.menuItemId !== menuItemId)
      );

      if ( slug && target?.cartItemId) {
        cartService
          .removeItem(slug,target.cartItemId)
          .catch(() => {});
      }
    },
    [slug]
  );

  const isInCart = useCallback(
    (menuItemId: string) =>
      itemsRef.current.some((item) => item.menuItemId === menuItemId),
    []
  );

  const getItemQty = useCallback(
    (menuItemId: string) => {
      return itemsRef.current.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;
    },
    []
  );

  const itemCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  const total = subtotal;

  const hasItems = items.length > 0;

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      total,
      hasItems,
      cartId,

      openCart,
      closeCart,
      toggleCart,

      addItem,
      increaseQty,
      decreaseQty,
      removeItem,
  clearCart,

  isInCart,
  getItemQty,
  checkoutCart,
  }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      total,
      hasItems,
      cartId,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
      checkoutCart,
      isInCart,
      getItemQty,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
