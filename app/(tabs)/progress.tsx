import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/progressStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { colors } from '@/constants/colors';
import ProgressChart from '@/components/ProgressChart';

export default function ProgressScreen() {
  const { progress } = useProgressStore();
  const { currentPlan } = useWorkoutStore();
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!currentPlan) return 0;
    
    let totalDays = 0;
    let completedDays = 0;
    
    currentPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        totalDays++;
        if (day.completed) {
          completedDays++;
        }
      });
    });
    
    return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  };
  
  const completionPercentage = calculateCompletion();
  
  // Get feedback distribution
  const getFeedbackDistribution = () => {
    if (!currentPlan) return { tooEasy: 0, justRight: 0, tooHard: 0, total: 0 };
    
    let tooEasy = 0;
    let justRight = 0;
    let tooHard = 0;
    let total = 0;
    
    currentPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.completed && day.feedback) {
          total++;
          if (day.feedback === 'too_easy') tooEasy++;
          if (day.feedback === 'just_right') justRight++;
          if (day.feedback === 'too_hard') tooHard++;
        }
      });
    });
    
    return { tooEasy, justRight, tooHard, total };
  };
  
  const feedbackStats = getFeedbackDistribution();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress stats */}
        <ProgressChart progress={progress} />
        
        {/* Plan completion */}
        {currentPlan && (
          <View style={styles.completionCard}>
            <Text style={styles.cardTitle}>Current Plan Progress</Text>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${completionPercentage}%` }
                ]} 
              />
            </View>
            
            <Text style={styles.progressText}>
              {completionPercentage.toFixed(0)}% Complete
            </Text>
            
            <View style={styles.planDetails}>
              <Text style={styles.planName}>{currentPlan.name}</Text>
              <Text style={styles.planInfo}>
                {currentPlan.path === 'GYM' ? 'Gym Workouts' : 'Bodyweight Workouts'} • {currentPlan.level}
              </Text>
            </View>
          </View>
        )}
        
        {/* Workout feedback */}
        {feedbackStats.total > 0 && (
          <View style={styles.feedbackCard}>
            <Text style={styles.cardTitle}>Workout Feedback</Text>
            
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackItem}>
                <View style={[styles.feedbackBar, styles.tooEasyBar, { height: `${(feedbackStats.tooEasy / feedbackStats.total) * 100}%` }]} />
                <Text style={styles.feedbackPercentage}>
                  {Math.round((feedbackStats.tooEasy / feedbackStats.total) * 100)}%
                </Text>
                <Text style={styles.feedbackLabel}>Too Easy</Text>
              </View>
              
              <View style={styles.feedbackItem}>
                <View style={[styles.feedbackBar, styles.justRightBar, { height: `${(feedbackStats.justRight / feedbackStats.total) * 100}%` }]} />
                <Text style={styles.feedbackPercentage}>
                  {Math.round((feedbackStats.justRight / feedbackStats.total) * 100)}%
                </Text>
                <Text style={styles.feedbackLabel}>Just Right</Text>
              </View>
              
              <View style={styles.feedbackItem}>
                <View style={[styles.feedbackBar, styles.tooHardBar, { height: `${(feedbackStats.tooHard / feedbackStats.total) * 100}%` }]} />
                <Text style={styles.feedbackPercentage}>
                  {Math.round((feedbackStats.tooHard / feedbackStats.total) * 100)}%
                </Text>
                <Text style={styles.feedbackLabel}>Too Hard</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          
          <View style={styles.achievementsList}>
            <View style={[
              styles.achievement,
              progress.workoutsCompleted >= 1 && styles.achievementCompleted
            ]}>
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDesc}>Complete your first workout</Text>
            </View>
            
            <View style={[
              styles.achievement,
              progress.workoutsCompleted >= 5 && styles.achievementCompleted
            ]}>
              <Text style={styles.achievementTitle}>Getting Started</Text>
              <Text style={styles.achievementDesc}>Complete 5 workouts</Text>
            </View>
            
            <View style={[
              styles.achievement,
              progress.workoutsCompleted >= 10 && styles.achievementCompleted
            ]}>
              <Text style={styles.achievementTitle}>Dedicated</Text>
              <Text style={styles.achievementDesc}>Complete 10 workouts</Text>
            </View>
            
            <View style={[
              styles.achievement,
              progress.streakDays >= 3 && styles.achievementCompleted
            ]}>
              <Text style={styles.achievementTitle}>Consistency</Text>
              <Text style={styles.achievementDesc}>Maintain a 3-day streak</Text>
            </View>
            
            <View style={[
              styles.achievement,
              progress.streakDays >= 7 && styles.achievementCompleted
            ]}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDesc}>Maintain a 7-day streak</Text>
            </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  completionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  planDetails: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  planInfo: {
    fontSize: 14,
    color: colors.textLight,
  },
  feedbackCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  feedbackContainer: {
    flexDirection: 'row',
    height: 150,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },
  feedbackItem: {
    alignItems: 'center',
    width: '30%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  feedbackBar: {
    width: '60%',
    minHeight: 20,
    borderRadius: 4,
  },
  tooEasyBar: {
    backgroundColor: '#FFD166',
  },
  justRightBar: {
    backgroundColor: '#06D6A0',
  },
  tooHardBar: {
    backgroundColor: '#EF476F',
  },
  feedbackPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: colors.text,
  },
  feedbackLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  achievementsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievement: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    opacity: 0.6,
  },
  achievementCompleted: {
    backgroundColor: '#E8F5E9',
    opacity: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: colors.textLight,
  },
});