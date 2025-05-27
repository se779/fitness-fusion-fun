import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '@/types';

interface ProgressState {
  progress: UserProgress;
  addWorkout: () => void;
  addSweatCoins: (amount: number) => void;
  spendSweatCoins: (amount: number) => void;
  updateStreak: () => void;
  resetStreak: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {
        workoutsCompleted: 0,
        streakDays: 0,
        longestStreak: 0,
        sweatCoins: 100, // Start with some coins
        lastWorkoutDate: undefined,
      },
      addWorkout: () => 
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          return { 
            progress: { 
              ...state.progress, 
              workoutsCompleted: state.progress.workoutsCompleted + 1,
              lastWorkoutDate: today,
            } 
          };
        }),
      addSweatCoins: (amount) => 
        set((state) => ({ 
          progress: { 
            ...state.progress, 
            sweatCoins: state.progress.sweatCoins + amount 
          } 
        })),
      spendSweatCoins: (amount) => 
        set((state) => ({ 
          progress: { 
            ...state.progress, 
            sweatCoins: Math.max(0, state.progress.sweatCoins - amount) 
          } 
        })),
      updateStreak: () => 
        set((state) => {
          const newStreakDays = state.progress.streakDays + 1;
          const newLongestStreak = Math.max(newStreakDays, state.progress.longestStreak);
          
          return { 
            progress: { 
              ...state.progress, 
              streakDays: newStreakDays,
              longestStreak: newLongestStreak,
            } 
          };
        }),
      resetStreak: () => 
        set((state) => ({ 
          progress: { 
            ...state.progress, 
            streakDays: 0 
          } 
        })),
    }),
    {
      name: 'fitness-buddy-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);