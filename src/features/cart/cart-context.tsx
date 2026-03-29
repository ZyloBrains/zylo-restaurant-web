"use client";

import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { AddToCartInput, CartItem } from "./cart.types";

type CartContextValue = {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    subtotal: number;
    openCart: () => void;
    closeCart: () => void;
    addItem: (input: AddToCartInput) => void;
    increaseQty: (menuItemId: string) => void;
    decreaseQty: (menuItemId: string) => void;
    removeItem: (menuItemId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    function openCart() {
        setIsOpen(true);
    }

    function closeCart() {
        setIsOpen(false);
    }

    function addItem(input: AddToCartInput) {
        setItems((prev) => {
            const existing = prev.find((item) => item.menuItemId === input.menuItemId);

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

        setIsOpen(true);
    }

    function increaseQty(menuItemId: string) {
        setItems((prev) =>
            prev.map((item) =>
                item.menuItemId === menuItemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQty(menuItemId: string) {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.menuItemId === menuItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeItem(menuItemId: string) {
        setItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
    }

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const value: CartContextValue = {
        items,
        isOpen,
        itemCount,
        subtotal,
        openCart,
        closeCart,
        addItem,
        increaseQty,
        decreaseQty,
        removeItem,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}