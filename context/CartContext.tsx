'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AddCartItemInput, CartItem } from '@/types/cart';

const CART_STORAGE_KEY = 'apsis-cart';

type CartContextValue = {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (cartId: string) => void;
  increaseQuantity: (cartId: string) => void;
  decreaseQuantity: (cartId: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function parseNtPrice(price: string) {
  const numericValue = Number(price.replace(/[^\d]/g, ''));

  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function formatNtPrice(value: number) {
  return `NT$ ${Math.max(0, value).toLocaleString('en-US')}`;
}

function readStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawCart) {
      return [];
    }

    const parsedCart = JSON.parse(rawCart);

    return Array.isArray(parsedCart) ? parsedCart as CartItem[] : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    const loadStoredCart = window.setTimeout(() => {
      setItems(readStoredCart());
      setHasLoadedStoredCart(true);
    }, 0);

    return () => {
      window.clearTimeout(loadStoredCart);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hasLoadedStoredCart, items]);

  const addItem = useCallback((item: AddCartItemInput) => {
    setItems((currentItems) => {
      const quantityToAdd = item.quantity ?? 1;
      const existingItem = currentItems.find((cartItem) => cartItem.cartId === item.cartId);

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.cartId === item.cartId
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem,
        );
      }

      return [...currentItems, { ...item, quantity: quantityToAdd }];
    });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.cartId !== cartId));
  }, []);

  const increaseQuantity = useCallback((cartId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((cartId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + parseNtPrice(item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      subtotal,
      itemCount,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [
      addItem,
      clearCart,
      closeCart,
      decreaseQuantity,
      increaseQuantity,
      isCartOpen,
      itemCount,
      items,
      openCart,
      removeItem,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
