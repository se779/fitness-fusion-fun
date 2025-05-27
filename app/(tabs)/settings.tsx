import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useProgressStore } from '@/store/progressStore';
import { useShopStore } from '@/store/shopStore';
import { usePetStore } from '@/store/petStore';
import { FitnessGoal, FitnessLevel, WorkoutPath } from '@/types';
import Button from '@/components/Button';
import { Settings, Dumbbell, User, Calendar, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, setUser, setOnboardingCompleted } = useUserStore();
  const { currentPlan, setCurrentPlan } = useWorkoutStore();
  const { progress } = useProgressStore();
  
  // Local state for settings
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(user.fitnessGoal);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(user.fitnessLevel);
  const [workoutPath, setWorkoutPath] = useState<WorkoutPath>(user.workoutPath);
  const [daysPerWeek, setDaysPerWeek] = useState(user.daysPerWeek);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Handle save settings
  const handleSaveSettings = () => {
    // Check if any settings changed
    const settingsChanged = 
      fitnessGoal !== user.fitnessGoal ||
      fitnessLevel !== user.fitnessLevel ||
      workoutPath !== user.workoutPath ||
      daysPerWeek !== user.daysPerWeek;
    
    // If workout settings changed, confirm with user
    if (settingsChanged && currentPlan) {
      Alert.alert(
        'Update Workout Plan?',
        'Changing these settings will require generating a new workout plan. Your current progress will be lost.',
        [
          { 
            text: 'Cancel', 
            style: 'cancel'
          },
          { 
            text: 'Update', 
            onPress: () => {
              // Update user settings immediately
              setUser({
                fitnessGoal,
                fitnessLevel,
                workoutPath,
                daysPerWeek
              });
              
              // Reset current plan
              setCurrentPlan(undefined);
              
              Alert.alert(
                'Settings Updated',
                'Your settings have been updated. Please go to the Workout tab to generate a new plan.',
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } else {
      // Just update settings without resetting plan
      setUser({
        fitnessGoal,
        fitnessLevel,
        workoutPath,
        daysPerWeek
      });
      
      Alert.alert(
        'Settings Updated',
        'Your settings have been saved successfully.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Handle reset progress
  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // Reset current plan
            setCurrentPlan(undefined);
            
            // Reset progress store
            useProgressStore.setState({
              progress: {
                workoutsCompleted: 0,
                streakDays: 0,
                longestStreak: 0,
                sweatCoins: 100, // Start with some coins
                lastWorkoutDate: undefined,
              }
            });
            
            // Reset shop store
            useShopStore.setState((state) => ({
              items: state.items.map(item => ({
                ...item,
                owned: false,
                equipped: false,
              }))
            }));
            
            // Reset pet store
            usePetStore.setState({
              pet: {
                type: 'fox',
                name: 'Buddy',
                mood: 'neutral',
                outfit: undefined,
                background: undefined,
                accessories: [],
              }
            });
            
            Alert.alert(
              'Progress Reset',
              'Your progress has been reset. You can generate a new workout plan in the Workout tab.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };
  
  // Handle restart onboarding
  const handleRestartOnboarding = () => {
    Alert.alert(
      'Restart Onboarding',
      'Are you sure you want to restart the onboarding process? Your current progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restart', 
          style: 'destructive',
          onPress: () => {
            // Reset all stores to initial state
            setCurrentPlan(undefined);
            
            // Reset progress
            useProgressStore.setState({
              progress: {
                workoutsCompleted: 0,
                streakDays: 0,
                longestStreak: 0,
                sweatCoins: 100,
                lastWorkoutDate: undefined,
              }
            });
            
            // Reset shop store
            useShopStore.setState((state) => ({
              items: state.items.map(item => ({
                ...item,
                owned: false,
                equipped: false,
              }))
            }));
            
            // Reset pet store
            usePetStore.setState({
              pet: {
                type: 'fox',
                name: 'Buddy',
                mood: 'neutral',
                outfit: undefined,
                background: undefined,
                accessories: [],
              }
            });
            
            // Reset user data and mark onboarding as incomplete
            setUser({
              name: '',
              fitnessLevel: 'beginner',
              fitnessGoal: 'maintain',
              workoutPath: 'NO-GYM',
              daysPerWeek: 3,
              onboardingCompleted: false,
            });
            
            // Navigate to onboarding
            router.replace('/onboarding');
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>
        
        {/* Current Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Your Stats</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.workoutsCompleted}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.streakDays}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.sweatCoins}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
          </View>
        </View>
        
        {/* Workout Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Dumbbell size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Workout Preferences</Text>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Fitness Goal</Text>
            <View style={styles.optionsContainer}>
              {(['bulk', 'maintain', 'cut'] as FitnessGoal[]).map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.optionButton,
                    fitnessGoal === goal && styles.selectedOption
                  ]}
                  onPress={() => setFitnessGoal(goal)}
                >
                  <Text style={[
                    styles.optionText,
                    fitnessGoal === goal && styles.selectedOptionText
                  ]}>
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Fitness Level</Text>
            <View style={styles.optionsContainer}>
              {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    fitnessLevel === level && styles.selectedOption
                  ]}
                  onPress={() => setFitnessLevel(level)}
                >
                  <Text style={[
                    styles.optionText,
                    fitnessLevel === level && styles.selectedOptionText
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Workout Environment</Text>
            <View style={styles.optionsContainer}>
              {(['GYM', 'NO-GYM'] as WorkoutPath[]).map((path) => (
                <TouchableOpacity
                  key={path}
                  style={[
                    styles.optionButton,
                    workoutPath === path && styles.selectedOption
                  ]}
                  onPress={() => setWorkoutPath(path)}
                >
                  <Text style={[
                    styles.optionText,
                    workoutPath === path && styles.selectedOptionText
                  ]}>
                    {path === 'GYM' ? 'Gym' : 'Home/Bodyweight'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>Days Per Week</Text>
            <View style={styles.daysContainer}>
              {[2, 3, 4, 5, 6].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dayButton,
                    daysPerWeek === days && styles.selectedDay
                  ]}
                  onPress={() => setDaysPerWeek(days)}
                >
                  <Text style={[
                    styles.dayText,
                    daysPerWeek === days && styles.selectedDayText
                  ]}>
                    {days}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* App Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingRowLabel}>Workout Reminders</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        {/* Account Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleResetProgress}
          >
            <Calendar size={20} color={colors.error} />
            <Text style={styles.actionButtonText}>Reset Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleRestartOnboarding}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.actionButtonText}>Restart Onboarding</Text>
          </TouchableOpacity>
        </View>
        
        {/* Save Button */}
        <Button
          title="Save Settings"
          onPress={handleSaveSettings}
          style={styles.saveButton}
        />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  section: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  settingGroup: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: 'white',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  selectedDayText: {
    color: 'white',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingRowLabel: {
    fontSize: 16,
    color: colors.text,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.error,
    marginLeft: 12,
  },
  saveButton: {
    marginTop: 8,
  },
});