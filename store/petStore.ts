import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, PetType, PetMood } from '@/types';

interface PetState {
  pet: Pet;
  setPet: (pet: Partial<Pet>) => void;
  setPetType: (type: PetType) => void;
  setPetName: (name: string) => void;
  setPetMood: (mood: PetMood) => void;
  equipOutfit: (outfitId: string | undefined) => void;
  equipBackground: (backgroundId: string | undefined) => void;
  toggleAccessory: (accessoryId: string) => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      pet: {
        type: 'fox',
        name: 'Buddy',
        mood: 'neutral',
        outfit: undefined,
        background: undefined,
        accessories: [],
      },
      setPet: (petData) => 
        set((state) => ({ 
          pet: { ...state.pet, ...petData } 
        })),
      setPetType: (type) => 
        set((state) => ({ 
          pet: { ...state.pet, type } 
        })),
      setPetName: (name) => 
        set((state) => ({ 
          pet: { ...state.pet, name } 
        })),
      setPetMood: (mood) => 
        set((state) => ({ 
          pet: { ...state.pet, mood } 
        })),
      equipOutfit: (outfitId) => 
        set((state) => ({ 
          pet: { ...state.pet, outfit: outfitId } 
        })),
      equipBackground: (backgroundId) => 
        set((state) => ({ 
          pet: { ...state.pet, background: backgroundId } 
        })),
      toggleAccessory: (accessoryId) => 
        set((state) => {
          const accessories = [...state.pet.accessories];
          const index = accessories.indexOf(accessoryId);
          
          if (index === -1) {
            accessories.push(accessoryId);
          } else {
            accessories.splice(index, 1);
          }
          
          return { pet: { ...state.pet, accessories } };
        }),
    }),
    {
      name: 'fitness-buddy-pet',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);