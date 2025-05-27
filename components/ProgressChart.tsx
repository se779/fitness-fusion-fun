import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { UserProgress } from '@/types';

interface ProgressChartProps {
  progress: UserProgress;
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  // Calculate streak percentage for visualization
  const streakPercentage = Math.min(100, (progress.streakDays / 7) * 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.workoutsCompleted}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.longestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>
      
      <View style={styles.streakContainer}>
        <Text style={styles.streakTitle}>Current Streak</Text>
        
        <View style={styles.streakBarContainer}>
          <View 
            style={[
              styles.streakBar, 
              { width: `${streakPercentage}%` }
            ]} 
          />
        </View>
        
        <View style={styles.streakLabels}>
          <Text style={styles.streakLabel}>0</Text>
          <Text style={styles.streakLabel}>7 days</Text>
        </View>
      </View>
      
      <View style={styles.coinsContainer}>
        <Text style={styles.coinsLabel}>Sweat Coins</Text>
        <Text style={styles.coinsValue}>{progress.sweatCoins}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    fontSize: 12,
    color: colors.textLight,
  },
  streakContainer: {
    marginBottom: 24,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  streakBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  streakBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  streakLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  coinsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 12,
  },
  coinsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.sweatCoin,
  },
});