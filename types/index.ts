// Type definitions for the app

export type PetType = 'fox' | 'panda' | 'corgi' | 'koala' | 'dragon' | 'cat' | 'rabbit' | 'owl' | 'tiger' | 'wolf';

export type PetMood = 'happy' | 'sleepy' | 'excited' | 'neutral';

export type WorkoutPath = 'GYM' | 'NO-GYM';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal = 'bulk' | 'cut' | 'maintain';

export type WorkoutDay = {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
  feedback?: 'too_easy' | 'just_right' | 'too_hard';
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  notes?: string;
};

export type WorkoutWeek = {
  id: string;
  name: string;
  days: WorkoutDay[];
  progressionNotes?: string;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  weeks: WorkoutWeek[];
  path: WorkoutPath;
  goal: FitnessGoal;
  level: FitnessLevel;
  daysPerWeek: number;
  currentWeek: number;
  currentDay: number;
};

export type ShopItem = {
  id: string;
  name: string;
  type: 'outfit' | 'background' | 'accessory' | 'buddy';
  price: number;
  imageUrl: string;
  owned: boolean;
  equipped: boolean;
  buddyType?: PetType; // For buddy items
};

export type UserProgress = {
  workoutsCompleted: number;
  streakDays: number;
  longestStreak: number;
  sweatCoins: number;
  lastWorkoutDate?: string;
};

export type Pet = {
  type: PetType;
  name: string;
  mood: PetMood;
  outfit?: string;
  background?: string;
  accessories: string[];
};

export type User = {
  name: string;
  fitnessLevel: FitnessLevel;
  fitnessGoal: FitnessGoal;
  workoutPath: WorkoutPath;
  daysPerWeek: number;
  onboardingCompleted: boolean;
};