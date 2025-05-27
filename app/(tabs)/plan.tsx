import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/store/workoutStore';
import { useProgressStore } from '@/store/progressStore';
import { colors } from '@/constants/colors';
import WorkoutCard from '@/components/WorkoutCard';
import Button from '@/components/Button';
import { generateWorkoutPlan } from '@/utils/aiWorkoutGenerator';
import { useUserStore } from '@/store/userStore';

export default function PlanScreen() {
  const { user } = useUserStore();
  const { currentPlan, setCurrentPlan, completeExercise, completeDay, setDayFeedback } = useWorkoutStore();
  const { addWorkout, addSweatCoins, updateStreak, progress } = useProgressStore();
  
  const [activeWeek, setActiveWeek] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Set active week to current week in plan
  useEffect(() => {
    if (currentPlan) {
      setActiveWeek(currentPlan.currentWeek);
    }
  }, [currentPlan]);
  
  // Generate workout plan if not exists
  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      // Fast generation without AI call
      const plan = await generateWorkoutPlan(
        user.workoutPath,
        user.fitnessLevel,
        user.fitnessGoal,
        user.daysPerWeek,
        user.name
      );
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      Alert.alert('Error', 'Failed to generate workout plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle exercise completion
  const handleToggleExercise = (weekId: string, dayId: string, exerciseId: string, completed: boolean) => {
    completeExercise(weekId, dayId, exerciseId, completed);
  };
  
  // Handle day completion
  const handleCompleteDay = (weekId: string, dayId: string) => {
    // Show feedback dialog
    Alert.alert(
      'How was your workout?',
      'Let us know so we can adjust your future workouts.',
      [
        {
          text: 'Too Easy',
          onPress: () => {
            setDayFeedback(weekId, dayId, 'too_easy');
            finishWorkout(weekId, dayId);
          },
        },
        {
          text: 'Just Right',
          onPress: () => {
            setDayFeedback(weekId, dayId, 'just_right');
            finishWorkout(weekId, dayId);
          },
        },
        {
          text: 'Too Hard',
          onPress: () => {
            setDayFeedback(weekId, dayId, 'too_hard');
            finishWorkout(weekId, dayId);
          },
        },
      ]
    );
  };
  
  // Complete workout and award coins
  const finishWorkout = (weekId: string, dayId: string) => {
    completeDay(weekId, dayId, true);
    addWorkout();
    updateStreak();
    
    // Award coins (base + streak bonus)
    const baseCoins = 20;
    const streakBonus = Math.min(10, progress.streakDays * 2);
    const totalCoins = baseCoins + streakBonus;
    
    addSweatCoins(totalCoins);
    
    Alert.alert(
      'Workout Complete!',
      `Great job! You earned ${totalCoins} Sweat Coins.`,
      [{ text: 'Awesome!' }]
    );
  };
  
  // If no plan exists yet
  if (!currentPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Workout Plan</Text>
          <Text style={styles.emptyText}>
            You don't have a workout plan yet. Let's create one tailored to your goals!
          </Text>
          <Button
            title="Create Workout Plan"
            onPress={handleGeneratePlan}
            loading={loading}
            style={styles.createButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  // Get current week
  const currentWeek = currentPlan.weeks[activeWeek];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentPlan.name}</Text>
        <Text style={styles.subtitle}>
          {currentPlan.path === 'GYM' ? 'Gym Workouts' : 'Bodyweight Workouts'} • {currentPlan.daysPerWeek} days/week
        </Text>
      </View>
      
      {/* Week tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.weekTabs}
        contentContainerStyle={styles.weekTabsContent}
      >
        {currentPlan.weeks.map((week, index) => (
          <TouchableOpacity
            key={week.id}
            style={[
              styles.weekTab,
              activeWeek === index && styles.activeWeekTab
            ]}
            onPress={() => setActiveWeek(index)}
          >
            <Text style={[
              styles.weekTabText,
              activeWeek === index && styles.activeWeekTabText
            ]}>
              {week.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Week progression notes */}
      {currentWeek.progressionNotes && (
        <View style={styles.progressionContainer}>
          <Text style={styles.progressionTitle}>Week Focus:</Text>
          <Text style={styles.progressionText}>{currentWeek.progressionNotes}</Text>
        </View>
      )}
      
      {/* Workout days */}
      <ScrollView 
        style={styles.workoutList}
        contentContainerStyle={styles.workoutListContent}
        showsVerticalScrollIndicator={false}
      >
        {currentWeek.days.map((day) => (
          <WorkoutCard
            key={day.id}
            title={day.name}
            exercises={day.exercises}
            onToggleExercise={(exerciseId, completed) => 
              handleToggleExercise(currentWeek.id, day.id, exerciseId, completed)
            }
            onComplete={() => handleCompleteDay(currentWeek.id, day.id)}
            completed={day.completed}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  weekTabs: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weekTabsContent: {
    paddingHorizontal: 16,
  },
  weekTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
  },
  activeWeekTab: {
    backgroundColor: colors.primary,
  },
  weekTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeWeekTabText: {
    color: 'white',
  },
  progressionContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  progressionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  progressionText: {
    fontSize: 14,
    color: colors.text,
  },
  workoutList: {
    flex: 1,
  },
  workoutListContent: {
    padding: 20,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    width: '80%',
  },
});