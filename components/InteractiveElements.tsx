import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { usePetStore } from '@/store/petStore';
import { useProgressStore } from '@/store/progressStore';
import { colors } from '@/constants/colors';
import { Heart, Star, Music } from 'lucide-react-native';

interface InteractiveElementsProps {
  onInteraction: (type: 'pet' | 'play' | 'music') => void;
}

export default function InteractiveElements({ onInteraction }: InteractiveElementsProps) {
  const { pet, setPetMood } = usePetStore();
  const { addSweatCoins } = useProgressStore();
  
  const [petAnimation] = useState(new Animated.Value(1));
  const [playAnimation] = useState(new Animated.Value(1));
  const [musicAnimation] = useState(new Animated.Value(1));
  
  // Handle pet interaction
  const handlePet = () => {
    // Animate button
    Animated.sequence([
      Animated.timing(petAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(petAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Set pet mood to happy
    setPetMood('happy');
    
    // Add a small reward
    addSweatCoins(1);
    
    // Trigger callback
    onInteraction('pet');
  };
  
  // Handle play interaction
  const handlePlay = () => {
    // Animate button
    Animated.sequence([
      Animated.timing(playAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(playAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Set pet mood to excited
    setPetMood('excited');
    
    // Add a small reward
    addSweatCoins(2);
    
    // Trigger callback
    onInteraction('play');
  };
  
  // Handle music interaction
  const handleMusic = () => {
    // Animate button
    Animated.sequence([
      Animated.timing(musicAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(musicAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Set pet mood based on current mood
    if (pet.mood === 'sleepy') {
      setPetMood('neutral');
    } else {
      setPetMood('sleepy');
    }
    
    // Add a small reward
    addSweatCoins(1);
    
    // Trigger callback
    onInteraction('music');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interact with {pet.name}</Text>
      
      <View style={styles.buttonsContainer}>
        <Animated.View style={{ transform: [{ scale: petAnimation }] }}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={handlePet}
            activeOpacity={0.7}
          >
            <Heart size={24} color={colors.secondary} />
            <Text style={styles.buttonText}>Pet</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: playAnimation }] }}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={handlePlay}
            activeOpacity={0.7}
          >
            <Star size={24} color={colors.primary} />
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={{ transform: [{ scale: musicAnimation }] }}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={handleMusic}
            activeOpacity={0.7}
          >
            <Music size={24} color={colors.accent} />
            <Text style={styles.buttonText}>Music</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  interactionButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 80,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text,
  },
});