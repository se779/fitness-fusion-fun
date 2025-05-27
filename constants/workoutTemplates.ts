// Base workout templates with more exercises and clearer gym vs bodyweight distinction
export const gymExercises = {
  beginner: {
    chest: ['Bench Press', 'Incline Dumbbell Press', 'Chest Fly Machine', 'Cable Crossovers', 'Chest Dips', 'Machine Chest Press', 'Pec Deck Fly', 'Decline Bench Press', 'Incline Barbell Press', 'Smith Machine Bench Press'],
    back: ['Lat Pulldown', 'Seated Cable Row', 'Assisted Pull-ups', 'T-Bar Row', 'Cable Rows', 'Machine Row', 'Reverse Fly Machine', 'Hyperextensions', 'Cable Pulldowns', 'Chest Supported Row'],
    legs: ['Leg Press', 'Leg Extensions', 'Leg Curls', 'Calf Raises', 'Hack Squats', 'Smith Machine Squats', 'Leg Press Calf Raises', 'Seated Calf Raises', 'Lying Leg Curls', 'Walking Lunges', 'Glute Ham Raises', 'Hip Thrusts'],
    shoulders: ['Shoulder Press Machine', 'Lateral Raise Machine', 'Cable Lateral Raises', 'Reverse Fly Machine', 'Shrugs', 'Face Pulls', 'Upright Rows', 'Cable Front Raises', 'Rear Delt Fly', 'Arnold Press'],
    arms: ['Cable Bicep Curls', 'Tricep Pushdowns', 'Hammer Curls', 'Cable Tricep Extensions', 'Preacher Curls', 'Cable Hammer Curls', 'Overhead Cable Extensions', 'Concentration Curls', 'Tricep Dips', 'Cable Curls'],
    core: ['Cable Crunches', 'Hanging Leg Raises', 'Russian Twists', 'Cable Woodchoppers', 'Ab Wheel', 'Captain\'s Chair Leg Raises', 'Cable Side Bends', 'Decline Sit-ups', 'Cable Oblique Crunches', 'Plank'],
  },
  intermediate: {
    chest: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Decline Bench Press', 'Dumbbell Flyes', 'Chest Dips', 'Landmine Press', 'Incline Cable Fly', 'Dumbbell Pullover', 'Machine Chest Press'],
    back: ['Pull-ups', 'Barbell Rows', 'T-Bar Rows', 'Single-Arm Dumbbell Rows', 'Lat Pulldown', 'Seated Cable Rows', 'Deadlifts', 'Face Pulls', 'Wide Grip Pull-ups', 'Chest Supported Rows'],
    legs: ['Barbell Squats', 'Romanian Deadlifts', 'Bulgarian Split Squats', 'Leg Press', 'Hack Squats', 'Walking Lunges', 'Leg Extensions', 'Leg Curls', 'Calf Raises', 'Front Squats', 'Stiff Leg Deadlifts', 'Hip Thrusts'],
    shoulders: ['Overhead Press', 'Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Reverse Fly', 'Arnold Press', 'Upright Rows', 'Face Pulls', 'Cable Lateral Raises', 'Rear Delt Fly', 'Shrugs', 'Pike Push-ups'],
    arms: ['Barbell Curls', 'Close Grip Bench Press', 'Preacher Curls', 'Tricep Dips', 'Hammer Curls', 'Skull Crushers', 'Cable Curls', 'Overhead Tricep Extension', 'Concentration Curls', 'Cable Hammer Curls', '21s', 'Diamond Push-ups'],
    core: ['Hanging Leg Raises', 'Cable Crunches', 'Ab Wheel Rollouts', 'Russian Twists', 'Bicycle Crunches', 'V-ups', 'Dead Bug', 'Side Plank', 'Mountain Climbers', 'Hollow Body Hold', 'Dragon Flags', 'Weighted Planks'],
  },
  advanced: {
    chest: ['Barbell Bench Press', 'Weighted Dips', 'Decline Bench Press', 'Incline Bench Press', 'Cable Flyes', 'Landmine Press', 'Pause Bench Press', 'Dumbbell Flyes', 'Machine Chest Press', 'Incline Cable Fly', 'Svend Press', 'Board Press'],
    back: ['Weighted Pull-ups', 'Deadlifts', 'Barbell Rows', 'T-Bar Rows', 'Chest-Supported Rows', 'Rack Pulls', 'Pendlay Rows', 'Cable Rows', 'Wide Grip Pull-ups', 'Single Arm Rows', 'Meadows Rows', 'Straight-Arm Pulldowns'],
    legs: ['Back Squats', 'Front Squats', 'Romanian Deadlifts', 'Bulgarian Split Squats', 'Hack Squats', 'Sumo Deadlifts', 'Walking Lunges', 'Good Mornings', 'Leg Press', 'Hip Thrusts', 'Pistol Squats', 'Box Jumps'],
    shoulders: ['Overhead Press', 'Push Press', 'Arnold Press', 'Lateral Raise Drop Sets', 'Handstand Push-ups', 'Upright Rows', 'Face Pulls', 'Bradford Press', 'Cable Lateral Raises', 'Rear Delt Fly', 'Pike Push-ups', 'Behind Neck Press'],
    arms: ['Weighted Chin-ups', 'Close Grip Bench Press', 'Barbell Curls', 'Skull Crushers', 'Preacher Curls', 'Overhead Tricep Extensions', 'Hammer Curls', 'Diamond Push-ups', 'Cable Curls', 'Tricep Dips', 'Zottman Curls', '21s'],
    core: ['Dragon Flags', 'Weighted Decline Sit-ups', 'Toes to Bar', 'Hanging Windshield Wipers', 'Ab Wheel Rollouts', 'Cable Woodchoppers', 'L-Sits', 'Hollow Body', 'Weighted Planks', 'Russian Twists', 'V-ups', 'Hanging Leg Raises'],
  },
};

export const noGymExercises = {
  beginner: {
    chest: ['Push-ups', 'Incline Push-ups (feet on floor)', 'Wall Push-ups', 'Knee Push-ups', 'Wide Push-ups', 'Diamond Push-ups', 'Decline Push-ups (hands elevated)', 'Hindu Push-ups', 'Staggered Push-ups', 'Slow Push-ups'],
    back: ['Superman', 'Prone Y-T-W', 'Reverse Snow Angels', 'Bird Dog', 'Good Mornings (bodyweight)', 'Reverse Plank', 'Single Arm Rows (with towel)', 'Dolphin Kicks', 'Back Extensions', 'Doorway Rows'],
    legs: ['Bodyweight Squats', 'Lunges', 'Glute Bridges', 'Calf Raises', 'Step-ups', 'Wall Sits', 'Single Leg Glute Bridges', 'Lateral Lunges', 'Reverse Lunges', 'Sumo Squats', 'Curtsy Lunges', 'Single Leg Calf Raises'],
    shoulders: ['Pike Push-ups', 'Arm Circles', 'Wall Angels', 'Shoulder Shrugs', 'Handstand Hold (against wall)', 'Y-T-W Raises', 'Pike Walk-ups', 'Reverse Fly (lying)', 'Lateral Raises (no weight)', 'Front Raises (no weight)'],
    arms: ['Tricep Dips (on chair)', 'Diamond Push-ups', 'Pike Push-ups', 'Tricep Push-ups', 'Close Grip Push-ups', 'Arm Circles', 'Wall Push-ups', 'Plank to Push-up', 'Tricep Dips (floor)', 'Isometric Holds'],
    core: ['Crunches', 'Plank', 'Mountain Climbers', 'Bicycle Crunches', 'Leg Raises', 'Bird Dog', 'Dead Bug', 'Russian Twists', 'Side Plank', 'Hollow Body Hold', 'Flutter Kicks', 'Scissor Kicks'],
  },
  intermediate: {
    chest: ['Diamond Push-ups', 'Decline Push-ups (feet elevated)', 'Pseudo Planche Push-ups', 'Explosive Push-ups', 'Archer Push-ups', 'Wide Push-ups', 'Staggered Push-ups', 'Hindu Push-ups', 'Clapping Push-ups', 'Spiderman Push-ups', 'T Push-ups', 'Single Arm Push-up Progression'],
    back: ['Inverted Rows (under table)', 'Superman Holds', 'Archer Rows', 'Single Arm Rows (towel)', 'Reverse Snow Angels', 'Dolphin Kicks', 'Towel Rows', 'Reverse Plank', 'Good Mornings', 'Bird Dog', 'Back Extensions', 'Prone Y-T-W'],
    legs: ['Jump Squats', 'Pistol Squats (assisted)', 'Walking Lunges', 'Single Leg Glute Bridges', 'Lateral Lunges', 'Step-ups', 'Wall Sits', 'Cossack Squats', 'Bulgarian Split Squats', 'Single Leg Deadlifts', 'Broad Jumps', 'Plyometric Lunges'],
    shoulders: ['Pike Push-ups (feet elevated)', 'Handstand Hold (against wall)', 'Wall Walks', 'Pike Walk-ups', 'Handstand Push-up Progression', 'Y-T-W Raises', 'Reverse Fly (lying)', 'Lateral Raises (water bottles)', 'Front Raises (water bottles)', 'Shoulder Shrugs'],
    arms: ['Tricep Dips (feet elevated)', 'Close Push-ups', 'Diamond Push-ups', 'Pike Push-ups', 'Tricep Extensions (lying)', 'Archer Push-ups', 'One Arm Push-up Progression', 'Tricep Dips (single leg)', 'Isometric Push-up Holds', 'Commando Push-ups'],
    core: ['Hollow Body Hold', 'V-ups', 'Side Plank', 'Russian Twists', 'Bicycle Crunches', 'Mountain Climbers', 'Leg Raises', 'Plank Up-Downs', 'Dead Bug', 'Flutter Kicks', 'Scissor Kicks', 'Single Leg V-ups'],
  },
  advanced: {
    chest: ['One Arm Push-up Progressions', 'Archer Push-ups', 'Clapping Push-ups', 'Pseudo Planche Push-ups', 'Handstand Push-ups', 'Explosive Push-ups', 'Spiderman Push-ups', 'T Push-ups', 'Hindu Push-ups', 'Decline Push-ups (high elevation)', 'Typewriter Push-ups', 'Superman Push-ups'],
    back: ['Pull-ups (if available)', 'Towel Rows (single arm)', 'Back Lever Progressions', 'Inverted Rows (single arm)', 'Superman Variations', 'Archer Rows', 'Single Arm Rows', 'Reverse Plank', 'Good Mornings', 'Bird Dog (single limb)', 'Back Extensions', 'Prone Y-T-W (single arm)'],
    legs: ['Pistol Squats', 'Shrimp Squats', 'Jump Squats', 'Plyometric Lunges', 'Bulgarian Split Squats (rear foot elevated)', 'Single Leg Deadlifts', 'Box Jumps', 'Broad Jumps', 'Dragon Squats', 'Cossack Squats', 'Single Leg Glute Bridges', 'Lateral Bounds'],
    shoulders: ['Handstand Push-up Progressions', 'Pike Push-ups (high elevation)', 'Wall Walks', 'Handstand Hold (freestanding)', 'Hollow Body Press', 'Pike Walk-ups', 'Y-T-W Raises (single arm)', 'Lateral Raises (resistance)', 'Front Raises (resistance)', 'Shoulder Shrugs (resistance)'],
    arms: ['One Arm Push-up Progressions', 'Pseudo Planche Push-ups', 'Diamond Push-ups (single arm progression)', 'Tricep Extensions (advanced)', 'Archer Push-ups', 'Handstand Push-ups', 'Close Grip Push-ups (feet elevated)', 'Tricep Dips (single arm)', 'Isometric Holds (advanced)', 'Commando Push-ups'],
    core: ['L-sit Progressions', 'Dragon Flag Progressions', 'Human Flag Progressions', 'Hanging Leg Raises (if available)', 'Ab Wheel Rollouts (if available)', 'Hollow Body Rocks', 'V-ups', 'Windshield Wipers', 'Single Leg V-ups', 'Hollow Body Hold', 'Russian Twists (advanced)', 'Side Plank (single limb)'],
  },
};

export const workoutSplits = {
  2: ['Upper Body', 'Lower Body'],
  3: ['Push', 'Pull', 'Legs'],
  4: ['Chest & Triceps', 'Back & Biceps', 'Legs', 'Shoulders & Core'],
  5: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms & Core'],
  6: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core & Cardio'],
};