import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartDB, type CartItem, type CartData } from '@/lib/cart-db';

interface CartContextType {
  items: CartData;
  addItem: (productUuid: string, item: Omit<CartItem, 'uuid' | 'dateAdded'>) => Promise<void>;
  removeItem: (productUuid: string) => Promise<void>;
  updateQuantity: (productUuid: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from IndexedDB on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        const cartData = await cartDB.getAllItems();
        setItems(cartData);
        setError(null);
      } catch (err) {
        console.error('Failed to load cart from IndexedDB:', err);
        setError('Failed to load cart data');
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const addItem = async (productUuid: string, newItem: Omit<CartItem, 'uuid' | 'dateAdded'>) => {
    try {
      await cartDB.addItem(productUuid, newItem);
      // Refresh items from DB to get updated state
      const updatedItems = await cartDB.getAllItems();
      setItems(updatedItems);
      setError(null);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const removeItem = async (productUuid: string) => {
    try {
      await cartDB.removeItem(productUuid);
      setItems(prev => {
        const newItems = { ...prev };
        delete newItems[productUuid];
        return newItems;
      });
      setError(null);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      setError('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productUuid: string, quantity: number) => {
    try {
      await cartDB.updateQuantity(productUuid, quantity);
      if (quantity <= 0) {
        setItems(prev => {
          const newItems = { ...prev };
          delete newItems[productUuid];
          return newItems;
        });
      } else {
        setItems(prev => ({
          ...prev,
          [productUuid]: {
            ...prev[productUuid],
            quantity
          }
        }));
      }
      setError(null);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await cartDB.clearCart();
      setItems({});
      setError(null);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return Object.values(items).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return Object.keys(items).length; // Count unique products
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isLoading,
      error,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
