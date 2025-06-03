
import React, { createContext, useContext, useState } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  requestedBy: string;
  createdAt: Date;
}

interface WishlistContextType {
  items: WishlistItem[];
  addWishlistRequest: (item: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
  removeWishlistItem: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addWishlistRequest = (newItem: Omit<WishlistItem, 'id' | 'createdAt'>) => {
    const item: WishlistItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setItems(prev => [...prev, item]);
  };

  const removeWishlistItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addWishlistRequest,
      removeWishlistItem,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
