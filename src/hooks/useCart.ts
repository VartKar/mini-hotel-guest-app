import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

interface UseCartOptions {
  storageKey?: string;
  withQuantity?: boolean;
}

export function useCart<T extends CartItem>(options: UseCartOptions = {}) {
  const { storageKey, withQuantity = false } = options;
  const [items, setItems] = useState<T[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
  }, [storageKey]);

  // Save to localStorage when items change
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, storageKey]);

  const addItem = (item: T) => {
    if (withQuantity) {
      setItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i =>
            i.id === item.id
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    } else {
      setItems(prev => {
        if (prev.find(i => i.id === item.id)) return prev;
        return [...prev, item];
      });
    }
  };

  const removeItem = (itemId: string) => {
    if (withQuantity) {
      setItems(prev =>
        prev
          .map(i =>
            i.id === itemId
              ? { ...i, quantity: (i.quantity || 1) - 1 }
              : i
          )
          .filter(i => (i.quantity || 0) > 0)
      );
    } else {
      setItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const removeItemCompletely = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!withQuantity) return;
    
    if (quantity <= 0) {
      removeItemCompletely(itemId);
    } else {
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const clearCart = () => {
    setItems([]);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = withQuantity ? (item.quantity || 1) : 1;
      return sum + item.price * quantity;
    }, 0);
  };

  const getTotalItems = () => {
    if (withQuantity) {
      return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
    return items.length;
  };

  return {
    items,
    addItem,
    removeItem,
    removeItemCompletely,
    updateQuantity,
    clearCart,
    calculateTotal,
    getTotalItems,
  };
}
