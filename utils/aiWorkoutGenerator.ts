import { WorkoutPlan, WorkoutPath, FitnessLevel, FitnessGoal } from '@/types';

// Function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// AI-powered workout plan generation using the API
export const generateWorkoutPlan = async (
  path: WorkoutPath,
  level: FitnessLevel,
  goal: FitnessGoal,
  daysPerWeek: number,
  userName: string
): Promise<WorkoutPlan> => {
  try {
    // Create the prompt for the AI
    const prompt = `Create a comprehensive 5-week workout plan for ${userName}.

Requirements:
- Fitness Goal: ${goal} (${goal === 'bulk' ? 'muscle building with strength focus' : goal === 'cut' ? 'fat loss with muscle preservation' : 'general fitness and health'})
- Fitness Level: ${level}
- Workout Environment: ${path === 'GYM' ? 'Full gym access with weights, machines, and equipment' : 'Home/bodyweight only - no equipment needed'}
- Frequency: ${daysPerWeek} days per week
- Duration: 5 weeks with progressive overload

For ${path === 'GYM' ? 'GYM' : 'NO-GYM'} workouts, ensure exercises are ${path === 'GYM' ? 'utilizing gym equipment like barbells, dumbbells, machines, cables, etc.' : 'purely bodyweight movements that can be done at home without any equipment'}.

Structure each week with:
1. Week name (e.g., "Foundation Week", "Progression Week")
2. ${daysPerWeek} workout days with specific focus areas
3. Each workout should have 8-12 exercises
4. Include sets and reps appropriate for ${goal} goal
5. Progressive overload notes for each week

Format as JSON with this structure:
{
  "name": "Plan name",
  "weeks": [
    {
      "name": "Week 1 name",
      "days": [
        {
          "name": "Day focus (e.g., Upper Body, Push, Legs)",
          "exercises": [
            {
              "name": "Exercise name",
              "sets": number,
              "reps": number
            }
          ]
        }
      ],
      "progressionNotes": "Week-specific progression guidance"
    }
  ]
}

Make sure ${path === 'GYM' ? 'gym exercises use proper equipment names and are clearly different from bodyweight exercises' : 'all exercises are bodyweight-only and can be performed at home without any equipment'}.`;

    // Call the AI API
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a certified personal trainer and fitness expert. Create detailed, progressive workout plans that are safe and effective. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the AI response
    let planData;
    try {
      // Try to parse the completion as JSON
      planData = JSON.parse(data.completion);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to template generation
      return generateTemplateWorkoutPlan(path, level, goal, daysPerWeek, userName);
    }

    // Convert AI response to our WorkoutPlan format
    const workoutPlan: WorkoutPlan = {
      id: generateId(),
      name: planData.name || `${userName}'s ${goal.charAt(0).toUpperCase() + goal.slice(1)} Plan`,
      weeks: planData.weeks.map((week: any, weekIndex: number) => ({
        id: generateId(),
        name: week.name || `Week ${weekIndex + 1}`,
        days: week.days.map((day: any) => ({
          id: generateId(),
          name: day.name,
          exercises: day.exercises.map((exercise: any) => ({
            id: generateId(),
            name: exercise.name,
            sets: exercise.sets || 3,
            reps: exercise.reps || 10,
            completed: false,
          })),
          completed: false,
        })),
        progressionNotes: week.progressionNotes || getProgressionNotes(weekIndex, goal, path),
      })),
      path,
      goal,
      level,
      daysPerWeek,
      currentWeek: 0,
      currentDay: 0,
    };

    return workoutPlan;
  } catch (error) {
    console.error('Error generating AI workout plan:', error);
    // Fallback to template generation if AI fails
    return generateTemplateWorkoutPlan(path, level, goal, daysPerWeek, userName);
  }
};

// Fallback template-based workout plan generation
const generateTemplateWorkoutPlan = (
  path: WorkoutPath,
  level: FitnessLevel,
  goal: FitnessGoal,
  daysPerWeek: number,
  userName: string
): WorkoutPlan => {
  // Define exercises based on path and level
  const gymExercises = {
    beginner: {
      chest: ['Bench Press', 'Incline Dumbbell Press', 'Chest Fly Machine', 'Cable Crossovers'],
      back: ['Lat Pulldown', 'Seated Cable Row', 'Assisted Pull-ups', 'T-Bar Row'],
      legs: ['Leg Press', 'Leg Extensions', 'Leg Curls', 'Calf Raises'],
      shoulders: ['Shoulder Press Machine', 'Lateral Raise Machine', 'Cable Lateral Raises'],
      arms: ['Cable Bicep Curls', 'Tricep Pushdowns', 'Hammer Curls'],
      core: ['Cable Crunches', 'Hanging Leg Raises', 'Russian Twists'],
    },
    intermediate: {
      chest: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Decline Bench Press'],
      back: ['Pull-ups', 'Barbell Rows', 'T-Bar Rows', 'Single-Arm Dumbbell Rows'],
      legs: ['Barbell Squats', 'Romanian Deadlifts', 'Bulgarian Split Squats', 'Leg Press'],
      shoulders: ['Overhead Press', 'Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises'],
      arms: ['Barbell Curls', 'Close Grip Bench Press', 'Preacher Curls', 'Tricep Dips'],
      core: ['Hanging Leg Raises', 'Cable Crunches', 'Ab Wheel Rollouts', 'Russian Twists'],
    },
    advanced: {
      chest: ['Barbell Bench Press', 'Weighted Dips', 'Decline Bench Press', 'Incline Bench Press'],
      back: ['Weighted Pull-ups', 'Deadlifts', 'Barbell Rows', 'T-Bar Rows'],
      legs: ['Back Squats', 'Front Squats', 'Romanian Deadlifts', 'Bulgarian Split Squats'],
      shoulders: ['Overhead Press', 'Push Press', 'Arnold Press', 'Lateral Raise Drop Sets'],
      arms: ['Weighted Chin-ups', 'Close Grip Bench Press', 'Barbell Curls', 'Skull Crushers'],
      core: ['Dragon Flags', 'Weighted Decline Sit-ups', 'Toes to Bar', 'Hanging Windshield Wipers'],
    },
  };

  const noGymExercises = {
    beginner: {
      chest: ['Push-ups', 'Incline Push-ups', 'Wall Push-ups', 'Knee Push-ups'],
      back: ['Superman', 'Prone Y-T-W', 'Reverse Snow Angels', 'Bird Dog'],
      legs: ['Bodyweight Squats', 'Lunges', 'Glute Bridges', 'Calf Raises'],
      shoulders: ['Pike Push-ups', 'Arm Circles', 'Wall Angels', 'Shoulder Shrugs'],
      arms: ['Tricep Dips (on chair)', 'Diamond Push-ups', 'Pike Push-ups'],
      core: ['Crunches', 'Plank', 'Mountain Climbers', 'Bicycle Crunches'],
    },
    intermediate: {
      chest: ['Diamond Push-ups', 'Decline Push-ups', 'Pseudo Planche Push-ups', 'Explosive Push-ups'],
      back: ['Inverted Rows (under table)', 'Superman Holds', 'Archer Rows', 'Single Arm Rows'],
      legs: ['Jump Squats', 'Pistol Squats (assisted)', 'Walking Lunges', 'Single Leg Glute Bridges'],
      shoulders: ['Pike Push-ups (feet elevated)', 'Handstand Hold (against wall)', 'Wall Walks'],
      arms: ['Tricep Dips (feet elevated)', 'Close Push-ups', 'Diamond Push-ups'],
      core: ['Hollow Body Hold', 'V-ups', 'Side Plank', 'Russian Twists'],
    },
    advanced: {
      chest: ['One Arm Push-up Progressions', 'Archer Push-ups', 'Clapping Push-ups', 'Handstand Push-ups'],
      back: ['Pull-ups (if available)', 'Towel Rows (single arm)', 'Back Lever Progressions'],
      legs: ['Pistol Squats', 'Shrimp Squats', 'Jump Squats', 'Plyometric Lunges'],
      shoulders: ['Handstand Push-up Progressions', 'Pike Push-ups (high elevation)', 'Wall Walks'],
      arms: ['One Arm Push-up Progressions', 'Pseudo Planche Push-ups', 'Diamond Push-ups (single arm)'],
      core: ['L-sit Progressions', 'Dragon Flag Progressions', 'Human Flag Progressions'],
    },
  };

  const exercises = path === 'GYM' ? gymExercises : noGymExercises;
  const workoutSplits = {
    2: ['Upper Body', 'Lower Body'],
    3: ['Push', 'Pull', 'Legs'],
    4: ['Chest & Triceps', 'Back & Biceps', 'Legs', 'Shoulders & Core'],
    5: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms & Core'],
    6: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core & Cardio'],
  };
  
  const split = workoutSplits[daysPerWeek as keyof typeof workoutSplits] || workoutSplits[3];
  
  // Create weeks
  const weeks = Array.from({ length: 5 }, (_, weekIndex) => {
    // Create days for this week
    const days = split.map((focus, dayIndex) => {
      // Select exercises for this day based on focus
      let dayExercises: string[] = [];
      
      if (focus.includes('Chest')) dayExercises = [...dayExercises, ...exercises[level].chest.slice(0, 4)];
      if (focus.includes('Back')) dayExercises = [...dayExercises, ...exercises[level].back.slice(0, 4)];
      if (focus.includes('Legs')) dayExercises = [...dayExercises, ...exercises[level].legs.slice(0, 4)];
      if (focus.includes('Shoulders')) dayExercises = [...dayExercises, ...exercises[level].shoulders.slice(0, 3)];
      if (focus.includes('Arms')) dayExercises = [...dayExercises, ...exercises[level].arms.slice(0, 3)];
      if (focus.includes('Core')) dayExercises = [...dayExercises, ...exercises[level].core.slice(0, 3)];
      
      // Handle compound workout types
      if (focus.includes('Upper')) {
        dayExercises = [
          ...exercises[level].chest.slice(0, 3),
          ...exercises[level].back.slice(0, 3),
          ...exercises[level].shoulders.slice(0, 2),
          ...exercises[level].arms.slice(0, 2)
        ];
      } else if (focus.includes('Lower')) {
        dayExercises = [
          ...exercises[level].legs.slice(0, 6),
          ...exercises[level].core.slice(0, 2)
        ];
      } else if (focus.includes('Push')) {
        dayExercises = [
          ...exercises[level].chest.slice(0, 4),
          ...exercises[level].shoulders.slice(0, 3),
          ...exercises[level].arms.slice(0, 2) // triceps focused
        ];
      } else if (focus.includes('Pull')) {
        dayExercises = [
          ...exercises[level].back.slice(0, 4),
          ...exercises[level].arms.slice(1, 4), // biceps focused
          ...exercises[level].core.slice(0, 2)
        ];
      }
      
      // Ensure we have 8-10 exercises per workout
      while (dayExercises.length < 8) {
        const randomCategory = Object.keys(exercises[level])[Math.floor(Math.random() * Object.keys(exercises[level]).length)] as keyof typeof exercises[typeof level];
        const randomExercise = exercises[level][randomCategory][Math.floor(Math.random() * exercises[level][randomCategory].length)];
        if (!dayExercises.includes(randomExercise)) {
          dayExercises.push(randomExercise);
        }
      }
      
      // Limit to 10 exercises maximum
      if (dayExercises.length > 10) {
        dayExercises = dayExercises.slice(0, 10);
      }
      
      // Remove duplicates
      dayExercises = [...new Set(dayExercises)];
      
      // Create exercise objects
      const exerciseObjects = dayExercises.map(name => {
        // Adjust sets and reps based on goal and progression
        let sets = 3;
        let reps = 10;
        
        if (goal === 'bulk') {
          sets = 4;
          reps = 6 + weekIndex; // Progressive overload: increase reps each week (6-10 reps)
        } else if (goal === 'cut') {
          sets = 3;
          reps = 12 + weekIndex; // Higher reps for cutting (12-16 reps)
        } else {
          sets = 3;
          reps = 8 + weekIndex; // Moderate progression (8-12 reps)
        }
        
        return {
          id: generateId(),
          name,
          sets,
          reps,
          completed: false,
        };
      });
      
      return {
        id: generateId(),
        name: focus,
        exercises: exerciseObjects,
        completed: false,
      };
    });
    
    return {
      id: generateId(),
      name: `Week ${weekIndex + 1}`,
      days,
      progressionNotes: getProgressionNotes(weekIndex, goal, path),
    };
  });
  
  return {
    id: generateId(),
    name: `${userName}'s ${goal.charAt(0).toUpperCase() + goal.slice(1)} Plan`,
    weeks,
    path,
    goal,
    level,
    daysPerWeek,
    currentWeek: 0,
    currentDay: 0,
  };
};

// Helper function to get progression notes
const getProgressionNotes = (weekIndex: number, goal: FitnessGoal, path: WorkoutPath): string => {
  if (goal === 'bulk') {
    if (path === 'GYM') {
      return [
        'Focus on form and getting comfortable with the weights.',
        'Increase weights by 5-10% on compound lifts if possible.',
        'Add an extra set to your main lifts this week.',
        'Try to increase weights again on all exercises.',
        'Push for personal records on your main lifts!',
      ][weekIndex];
    } else {
      return [
        'Focus on form and getting comfortable with the movements.',
        'Increase reps or add pauses to make exercises harder.',
        'Try more challenging variations of basic exercises.',
        'Add explosive movements and increase time under tension.',
        'Master advanced variations and increase workout intensity!',
      ][weekIndex];
    }
  } else if (goal === 'cut') {
    return [
      'Keep rest periods short (30-60 seconds) to maintain elevated heart rate.',
      'Add 5 minutes of HIIT after your workout.',
      'Increase reps by 2 on each exercise if possible.',
      'Add supersets to increase workout intensity.',
      'Focus on form while maintaining the higher rep ranges.',
    ][weekIndex];
  } else {
    if (path === 'GYM') {
      return [
        'Focus on proper form and technique for all exercises.',
        'Slightly increase weights if the previous week felt comfortable.',
        'Add an extra rep to each set if possible.',
        'Try to increase either weight or reps on all exercises.',
        'Reflect on your progress and adjust for your next cycle.',
      ][weekIndex];
    } else {
      return [
        'Focus on proper form and controlled movements.',
        'Increase reps or hold positions longer if exercises feel easy.',
        'Try more challenging variations of the exercises.',
        'Add pauses or slower tempos to increase difficulty.',
        'Master the movements and prepare for advanced variations.',
      ][weekIndex];
    }
  }
};