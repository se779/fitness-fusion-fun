import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutPlan, WorkoutWeek, WorkoutDay, Exercise } from '@/types';

interface WorkoutState {
  currentPlan: WorkoutPlan | undefined;
  setCurrentPlan: (plan: WorkoutPlan | undefined) => void;
  completeExercise: (weekId: string, dayId: string, exerciseId: string, completed: boolean) => void;
  completeDay: (weekId: string, dayId: string, completed: boolean) => void;
  setDayFeedback: (weekId: string, dayId: string, feedback: 'too_easy' | 'just_right' | 'too_hard') => void;
  getCurrentWorkout: () => { week: WorkoutWeek | null; day: WorkoutDay | null };
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentPlan: undefined,
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      completeExercise: (weekId, dayId, exerciseId, completed) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const updatedPlan = { ...currentPlan };
        const weekIndex = updatedPlan.weeks.findIndex(week => week.id === weekId);
        if (weekIndex === -1) return;

        const dayIndex = updatedPlan.weeks[weekIndex].days.findIndex(day => day.id === dayId);
        if (dayIndex === -1) return;

        const exerciseIndex = updatedPlan.weeks[weekIndex].days[dayIndex].exercises.findIndex(
          exercise => exercise.id === exerciseId
        );
        if (exerciseIndex === -1) return;

        updatedPlan.weeks[weekIndex].days[dayIndex].exercises[exerciseIndex].completed = completed;

        set({ currentPlan: updatedPlan });
      },
      completeDay: (weekId, dayId, completed) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const updatedPlan = { ...currentPlan };
        const weekIndex = updatedPlan.weeks.findIndex(week => week.id === weekId);
        if (weekIndex === -1) return;

        const dayIndex = updatedPlan.weeks[weekIndex].days.findIndex(day => day.id === dayId);
        if (dayIndex === -1) return;

        updatedPlan.weeks[weekIndex].days[dayIndex].completed = completed;

        // Update current day/week if this day is completed
        if (completed) {
          // Find next day in the week
          const nextDayIndex = updatedPlan.weeks[weekIndex].days.findIndex(
            (day, index) => index > dayIndex && !day.completed
          );

          if (nextDayIndex !== -1) {
            updatedPlan.currentDay = nextDayIndex;
          } else {
            // All days in this week are completed, move to next week
            const nextWeekIndex = weekIndex + 1;
            if (nextWeekIndex < updatedPlan.weeks.length) {
              updatedPlan.currentWeek = nextWeekIndex;
              updatedPlan.currentDay = 0;
            }
          }
        }

        set({ currentPlan: updatedPlan });
      },
      setDayFeedback: (weekId, dayId, feedback) => {
        const { currentPlan } = get();
        if (!currentPlan) return;

        const updatedPlan = { ...currentPlan };
        const weekIndex = updatedPlan.weeks.findIndex(week => week.id === weekId);
        if (weekIndex === -1) return;

        const dayIndex = updatedPlan.weeks[weekIndex].days.findIndex(day => day.id === dayId);
        if (dayIndex === -1) return;

        updatedPlan.weeks[weekIndex].days[dayIndex].feedback = feedback;

        set({ currentPlan: updatedPlan });
      },
      getCurrentWorkout: () => {
        const { currentPlan } = get();
        if (!currentPlan) return { week: null, day: null };

        const currentWeek = currentPlan.weeks[currentPlan.currentWeek];
        const currentDay = currentWeek?.days[currentPlan.currentDay];

        return { week: currentWeek || null, day: currentDay || null };
      },
    }),
    {
      name: 'fitness-buddy-workout',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);