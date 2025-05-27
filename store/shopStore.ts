import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShopItem } from '@/types';
import { backgrounds, outfits, accessories, buddyModels } from '@/constants/petAssets';

// Convert assets to shop items
const createShopItems = (): ShopItem[] => {
  const bgItems = backgrounds.map(bg => ({
    id: bg.id,
    name: bg.name,
    type: 'background' as const,
    price: bg.price,
    imageUrl: bg.imageUrl,
    owned: false,
    equipped: false,
  }));

  const outfitItems = outfits.map(outfit => ({
    id: outfit.id,
    name: outfit.name,
    type: 'outfit' as const,
    price: outfit.price,
    imageUrl: outfit.imageUrl,
    owned: false,
    equipped: false,
  }));

  const accessoryItems = accessories.map(acc => ({
    id: acc.id,
    name: acc.name,
    type: 'accessory' as const,
    price: acc.price,
    imageUrl: acc.imageUrl,
    owned: false,
    equipped: false,
  }));

  const buddyItems = buddyModels.map(buddy => ({
    id: buddy.id,
    name: buddy.name,
    type: 'buddy' as const,
    price: buddy.price,
    imageUrl: buddy.imageUrl,
    owned: false,
    equipped: false,
    buddyType: buddy.type,
  }));

  return [...bgItems, ...outfitItems, ...accessoryItems, ...buddyItems];
};

interface ShopState {
  items: ShopItem[];
  purchaseItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  getItemById: (itemId: string) => ShopItem | undefined;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      items: createShopItems(),
      purchaseItem: (itemId) => {
        const { items } = get();
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return false;
        
        const updatedItems = [...items];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], owned: true };
        
        set({ items: updatedItems });
        return true;
      },
      equipItem: (itemId) => {
        const { items } = get();
        const itemToEquip = items.find(item => item.id === itemId);
        
        if (!itemToEquip || !itemToEquip.owned) return;
        
        const updatedItems = items.map(item => {
          // If same type as the item we're equipping, unequip it
          if (item.type === itemToEquip.type) {
            return { ...item, equipped: item.id === itemId };
          }
          return item;
        });
        
        set({ items: updatedItems });
      },
      unequipItem: (itemId) => {
        const { items } = get();
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;
        
        const updatedItems = [...items];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], equipped: false };
        
        set({ items: updatedItems });
      },
      getItemById: (itemId) => {
        return get().items.find(item => item.id === itemId);
      },
    }),
    {
      name: 'fitness-buddy-shop',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);