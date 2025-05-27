import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { usePetStore } from '@/store/petStore';
import { FitnessLevel, FitnessGoal, WorkoutPath, PetType } from '@/types';
import { petImages } from '@/constants/petAssets';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUser, setOnboardingCompleted } = useUserStore();
  const { setPetType, setPetName } = usePetStore();
  
  // Onboarding steps
  const [step, setStep] = useState(1);
  
  // User inputs
  const [name, setName] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('beginner');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('maintain');
  const [workoutPath, setWorkoutPath] = useState<WorkoutPath>('NO-GYM');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [petType, setPetTypeState] = useState<PetType>('fox');
  const [petName, setPetNameState] = useState('Buddy');
  
  // Handle next step
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save user preferences
      setUser({
        name,
        fitnessLevel,
        fitnessGoal,
        workoutPath,
        daysPerWeek,
        onboardingCompleted: true,
      });
      
      // Save pet preferences
      setPetType(petType);
      setPetName(petName);
      
      // Mark onboarding as completed
      setOnboardingCompleted(true);
      
      // Navigate to main app
      router.replace('/(tabs)');
    }
  };
  
  // Handle back
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Welcome to Fitness Buddy!</Text>
            <Text style={styles.stepDescription}>
              Let's get to know you better to create your personalized fitness journey.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What's your name?</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#AAAAAA"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What's your fitness level?</Text>
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
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Fitness Goals</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>What's your primary goal?</Text>
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
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Preferred workout environment?</Text>
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
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>How many days per week can you workout?</Text>
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
        );
      
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choose Your Gym Buddy</Text>
            <Text style={styles.stepDescription}>
              Select a virtual pet companion to join you on your fitness journey!
            </Text>
            
            <ScrollView style={styles.petsScrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.petsContainer}>
                {(['fox', 'panda', 'corgi', 'koala', 'dragon', 'cat', 'rabbit', 'owl'] as PetType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.petOption,
                      petType === type && styles.selectedPet
                    ]}
                    onPress={() => setPetTypeState(type)}
                  >
                    <Image
                      source={{ uri: petImages[type].neutral }}
                      style={styles.petImage}
                    />
                    <Text style={[
                      styles.petText,
                      petType === type && styles.selectedPetText
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Give your buddy a name:</Text>
              <TextInput
                style={styles.textInput}
                value={petName}
                onChangeText={setPetNameState}
                placeholder="Enter a name"
                placeholderTextColor="#AAAAAA"
              />
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>You're All Set!</Text>
            <Text style={styles.stepDescription}>
              We've created a personalized 5-week workout plan just for you.
            </Text>
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Your Goal:</Text>
                <Text style={styles.summaryValue}>
                  {fitnessGoal.charAt(0).toUpperCase() + fitnessGoal.slice(1)}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Workout Type:</Text>
                <Text style={styles.summaryValue}>
                  {workoutPath === 'GYM' ? 'Gym Workouts' : 'Bodyweight Workouts'}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Frequency:</Text>
                <Text style={styles.summaryValue}>
                  {daysPerWeek} days per week
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Your Buddy:</Text>
                <Text style={styles.summaryValue}>
                  {petName} the {petType.charAt(0).toUpperCase() + petType.slice(1)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.finalNote}>
              Complete workouts to earn Sweat Coins and unlock items for your buddy!
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((stepNumber) => (
              <View
                key={stepNumber}
                style={[
                  styles.progressDot,
                  step >= stepNumber && styles.activeDot
                ]}
              />
            ))}
          </View>
          
          {/* Step content */}
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <View style={styles.buttonsContainer}>
            {step > 1 && (
              <Button
                title="Back"
                onPress={handleBack}
                variant="outline"
                style={{ marginRight: 12, flex: 1 }}
              />
            )}
            
            <Button
              title={step < 4 ? "Next" : "Start Your Journey"}
              onPress={handleNext}
              style={{ flex: step > 1 ? 1 : undefined, width: step > 1 ? undefined : '100%' }}
              disabled={step === 1 && !name.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
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
  petsScrollContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  petsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  petOption: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedPet: {
    backgroundColor: '#E8EFFF',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  petText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedPetText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  finalNote: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});