import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import PetAvatar from '@/components/PetAvatar';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { usePetStore } from '@/store/petStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useProgressStore } from '@/store/progressStore';
import { generateWorkoutPlan } from '@/utils/aiWorkoutGenerator';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { pet, setPetMood } = usePetStore();
  const { currentPlan, setCurrentPlan, getCurrentWorkout } = useWorkoutStore();
  const { progress, updateStreak, resetStreak } = useProgressStore();
  
  const [greeting, setGreeting] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  
  // Get current workout
  const { week, day } = getCurrentWorkout();
  
  // Generate workout plan if not exists (fast)
  useEffect(() => {
    const generatePlan = async () => {
      if (!currentPlan && user.onboardingCompleted) {
        try {
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
        }
      }
    };
    
    generatePlan();
  }, [currentPlan, user, setCurrentPlan]);
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour < 12) {
      newGreeting = 'Good morning';
      setPetMood('happy');
    } else if (hour < 18) {
      newGreeting = 'Good afternoon';
      setPetMood('neutral');
    } else {
      newGreeting = 'Good evening';
      setPetMood('sleepy');
    }
    
    setGreeting(`${newGreeting}, ${user.name}!`);
  }, [user.name, setPetMood]);
  
  // Set motivational quote
  useEffect(() => {
    const quotes = [
      "Every workout brings you closer to your goals.",
      "The only bad workout is the one that didn't happen.",
      "Small steps, big results. Keep going!",
      "Your body can do it. It's your mind you need to convince.",
      "Fitness is not about being better than someone else. It's about being better than you used to be.",
    ];
    
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  
  // Check streak
  useEffect(() => {
    const checkStreak = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastWorkout = progress.lastWorkoutDate;
      
      if (!lastWorkout) return;
      
      const lastWorkoutDate = new Date(lastWorkout);
      const currentDate = new Date(today);
      
      // Calculate the difference in days
      const timeDiff = currentDate.getTime() - lastWorkoutDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day, update streak
        updateStreak();
      } else if (daysDiff > 1) {
        // Streak broken
        resetStreak();
      }
    };
    
    checkStreak();
  }, [progress.lastWorkoutDate, updateStreak, resetStreak]);
  
  // Start workout
  const handleStartWorkout = () => {
    router.push('/plan');
  };
  
  // Visit buddy room
  const handleVisitBuddy = () => {
    router.push('/buddy');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>Let's crush today's workout!</Text>
          </View>
          
          <View style={styles.streakContainer}>
            <Text style={styles.streakValue}>{progress.streakDays}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>
        
        {/* Pet Avatar */}
        <View style={styles.petContainer}>
          <PetAvatar size="large" showMood={true} />
          
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>"{motivationalQuote}"</Text>
          </View>
        </View>
        
        {/* Workout Card */}
        <View style={styles.workoutCard}>
          <Text style={styles.cardTitle}>Today's Workout</Text>
          
          {currentPlan ? (
            <>
              <Text style={styles.workoutTitle}>
                {day ? day.name : 'Rest Day'}
              </Text>
              
              {day ? (
                <>
                  <Text style={styles.workoutInfo}>
                    {day.exercises.length} exercises • {week?.name}
                  </Text>
                  
                  <View style={styles.exercisePreview}>
                    {day.exercises.slice(0, 3).map((exercise, index) => (
                      <Text key={exercise.id} style={styles.exerciseItem}>
                        • {exercise.name}
                      </Text>
                    ))}
                    {day.exercises.length > 3 && (
                      <Text style={styles.moreExercises}>
                        +{day.exercises.length - 3} more
                      </Text>
                    )}
                  </View>
                  
                  <Button
                    title="Start Workout"
                    onPress={handleStartWorkout}
                    style={styles.startButton}
                  />
                </>
              ) : (
                <View style={styles.restDayContainer}>
                  <Text style={styles.restDayText}>
                    Today is your rest day. Take time to recover and prepare for your next workout!
                  </Text>
                  
                  <Button
                    title="View Workout Plan"
                    onPress={handleStartWorkout}
                    variant="outline"
                    style={styles.viewPlanButton}
                  />
                </View>
              )}
            </>
          ) : (
            <View style={styles.noWorkoutContainer}>
              <Text style={styles.noWorkoutText}>
                Creating your personalized workout plan...
              </Text>
            </View>
          )}
        </View>
        
        {/* Visit Buddy Button */}
        <TouchableOpacity 
          style={styles.visitBuddyButton}
          onPress={handleVisitBuddy}
          activeOpacity={0.8}
        >
          <Text style={styles.visitBuddyText}>
            Visit {pet.name}'s Room
          </Text>
        </TouchableOpacity>
        
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.workoutsCompleted}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.sweatCoins}</Text>
            <Text style={styles.statLabel}>Sweat Coins</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  streakContainer: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  petContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  quoteContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.text,
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  workoutInfo: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  exercisePreview: {
    marginBottom: 20,
  },
  exerciseItem: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  moreExercises: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  startButton: {
    width: '100%',
  },
  restDayContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  restDayText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  viewPlanButton: {
    width: '100%',
  },
  noWorkoutContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noWorkoutText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  visitBuddyButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  visitBuddyText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
});