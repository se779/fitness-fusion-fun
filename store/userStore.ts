import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, FitnessLevel, FitnessGoal, WorkoutPath } from '@/types';

interface UserState {
  user: User;
  setUser: (user: Partial<User>) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        name: '',
        fitnessLevel: 'beginner',
        fitnessGoal: 'maintain',
        workoutPath: 'NO-GYM',
        daysPerWeek: 3,
        onboardingCompleted: false,
      },
      setUser: (userData) => 
        set((state) => ({ 
          user: { ...state.user, ...userData } 
        })),
      setOnboardingCompleted: (completed) => 
        set((state) => ({ 
          user: { ...state.user, onboardingCompleted: completed } 
        })),
    }),
    {
      name: 'fitness-buddy-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);