import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { usePetStore } from '@/store/petStore';
import { useShopStore } from '@/store/shopStore';
import { petImages } from '@/constants/petAssets';
import { colors } from '@/constants/colors';
import { PetMood } from '@/types';

interface PetAvatarProps {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showMood?: boolean;
}

export default function PetAvatar({ size = 'medium', showName = false, showMood = false }: PetAvatarProps) {
  const { pet, setPetMood } = usePetStore();
  const { items } = useShopStore();

  // Get equipped items
  const equippedOutfit = items.find(item => item.type === 'outfit' && item.equipped);
  const equippedBackground = items.find(item => item.type === 'background' && item.equipped);
  const equippedAccessories = items.filter(item => item.type === 'accessory' && item.equipped);

  // Randomly change pet mood occasionally
  useEffect(() => {
    const moods: PetMood[] = ['happy', 'sleepy', 'excited', 'neutral'];
    const randomMoodChange = () => {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setPetMood(randomMood);
    };

    const interval = setInterval(randomMoodChange, 60000); // Change mood every minute
    return () => clearInterval(interval);
  }, [setPetMood]);

  // Get pet image based on type and mood
  const petImage = petImages[pet.type]?.[pet.mood] || petImages.fox.neutral;

  // Get size dimensions
  const sizeStyles = {
    small: { width: 80, height: 80 },
    medium: { width: 150, height: 150 },
    large: { width: 250, height: 250 },
  }[size];

  // Get mood emoji and text
  const moodEmoji = {
    happy: '😊',
    sleepy: '😴',
    excited: '🤩',
    neutral: '😌',
  }[pet.mood];

  const moodText = {
    happy: "is feeling happy!",
    sleepy: "is a bit sleepy...",
    excited: "is super excited!",
    neutral: "is feeling good.",
  }[pet.mood];

  return (
    <View style={styles.container}>
      {/* Background (if equipped) */}
      {equippedBackground && (
        <Image 
          source={{ uri: equippedBackground.imageUrl }} 
          style={[styles.background, sizeStyles]} 
        />
      )}
      
      {/* Pet */}
      <View style={[styles.petContainer, sizeStyles]}>
        <Image 
          source={{ uri: petImage }} 
          style={[styles.petImage, sizeStyles]} 
          resizeMode="cover"
        />
        
        {/* Outfit overlay (if equipped) */}
        {equippedOutfit && (
          <View style={[styles.outfitContainer, sizeStyles]}>
            <Image 
              source={{ uri: equippedOutfit.imageUrl }} 
              style={[styles.outfitImage, sizeStyles]} 
              resizeMode="contain"
            />
          </View>
        )}
        
        {/* Accessories (if equipped) */}
        {equippedAccessories.map((accessory) => (
          <View key={accessory.id} style={[styles.accessoryContainer, sizeStyles]}>
            <Image 
              source={{ uri: accessory.imageUrl }} 
              style={[styles.accessoryImage, sizeStyles]} 
              resizeMode="contain"
            />
          </View>
        ))}
      </View>
      
      {/* Pet name */}
      {showName && (
        <Text style={styles.petName}>{pet.name}</Text>
      )}
      
      {/* Pet mood */}
      {showMood && (
        <View style={styles.moodContainer}>
          <Text style={styles.moodEmoji}>{moodEmoji}</Text>
          <Text style={styles.moodText}>{pet.name} {moodText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    borderRadius: 12,
  },
  petContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  petImage: {
    borderRadius: 12,
  },
  outfitContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  outfitImage: {
    opacity: 0.7,
  },
  accessoryContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  accessoryImage: {
    opacity: 0.8,
  },
  petName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  moodText: {
    fontSize: 14,
    color: colors.textLight,
  },
});