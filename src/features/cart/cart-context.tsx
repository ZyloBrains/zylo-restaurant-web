"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { AddToCartInput, CartItem } from "./cart.types";

type CartOpenBehavior = "manual" | "first-item" | "always";

type CartContextValue = {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    subtotal: number;
    hasItems: boolean;
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
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
    children: ReactNode;
    openBehavior?: CartOpenBehavior;
};

export function CartProvider({
                                 children,
                                 openBehavior = "manual",
                             }: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const openCart = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggleCart = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setIsOpen(false);
    }, []);

    const addItem = useCallback(
        (input: AddToCartInput) => {
            let wasCartEmpty = false;

            setItems((prev) => {
                wasCartEmpty = prev.length === 0;

                const existing = prev.find(
                    (item) => item.menuItemId === input.menuItemId
                );

                if (existing) {
                    return prev.map((item) =>
                        item.menuItemId === input.menuItemId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }

                return [
                    ...prev,
                    {
                        id: `cart-${input.menuItemId}`,
                        menuItemId: input.menuItemId,
                        name: input.name,
                        price: input.price,
                        quantity: 1,
                    },
                ];
            });

            if (openBehavior === "always") {
                setIsOpen(true);
            } else if (openBehavior === "first-item" && wasCartEmpty) {
                setIsOpen(true);
            }
        },
        [openBehavior]
    );

    const increaseQty = useCallback((menuItemId: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.menuItemId === menuItemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }, []);

    const decreaseQty = useCallback((menuItemId: string) => {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.menuItemId === menuItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const removeItem = useCallback((menuItemId: string) => {
        setItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
    }, []);

    const isInCart = useCallback(
        (menuItemId: string) => {
            return items.some((item) => item.menuItemId === menuItemId);
        },
        [items]
    );

    const getItemQty = useCallback(
        (menuItemId: string) => {
            const item = items.find((cartItem) => cartItem.menuItemId === menuItemId);
            return item?.quantity ?? 0;
        },
        [items]
    );

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const hasItems = items.length > 0;

    const value = useMemo<CartContextValue>(
        () => ({
            items,
            isOpen,
            itemCount,
            subtotal,
            hasItems,
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
        }),
        [
            items,
            isOpen,
            itemCount,
            subtotal,
            hasItems,
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
        ]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}