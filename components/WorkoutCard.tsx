import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '@/types';
import { colors } from '@/constants/colors';

interface WorkoutCardProps {
  title: string;
  exercises: Exercise[];
  onToggleExercise: (exerciseId: string, completed: boolean) => void;
  onComplete: () => void;
  completed: boolean;
}

export default function WorkoutCard({ 
  title, 
  exercises, 
  onToggleExercise, 
  onComplete,
  completed 
}: WorkoutCardProps) {
  // Calculate completion percentage
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const completionPercentage = totalExercises > 0 
    ? (completedExercises / totalExercises) * 100 
    : 0;

  return (
    <View style={[styles.card, completed && styles.completedCard]}>
      <Text style={styles.title}>{title}</Text>
      
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${completionPercentage}%` }
          ]} 
        />
      </View>
      
      <Text style={styles.progressText}>
        {completedExercises}/{totalExercises} exercises completed
      </Text>
      
      {/* Exercise list */}
      <View style={styles.exerciseList}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[
              styles.exerciseItem,
              exercise.completed && styles.completedExerciseItem
            ]}
            onPress={() => onToggleExercise(exercise.id, !exercise.completed)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              exercise.completed && styles.checkedBox
            ]} />
            
            <View style={styles.exerciseDetails}>
              <Text style={[
                styles.exerciseName,
                exercise.completed && styles.completedExerciseText
              ]}>
                {exercise.name}
              </Text>
              
              <Text style={styles.exerciseReps}>
                {exercise.sets} sets × {exercise.reps} reps
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Complete button */}
      {!completed && completedExercises === totalExercises && (
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.completeButtonText}>
            Complete Workout
          </Text>
        </TouchableOpacity>
      )}
      
      {completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>Completed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.progressBar,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 16,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  completedExerciseItem: {
    opacity: 0.7,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: colors.primary,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  completedExerciseText: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  exerciseReps: {
    fontSize: 14,
    color: colors.textLight,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  completedBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  completedBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});