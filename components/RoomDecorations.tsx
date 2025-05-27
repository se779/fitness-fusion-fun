import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useShopStore } from '@/store/shopStore';

interface RoomDecorationsProps {
  size?: 'small' | 'medium' | 'large';
}

export default function RoomDecorations({ size = 'medium' }: RoomDecorationsProps) {
  const { items } = useShopStore();
  
  // Get equipped background
  const equippedBackground = items.find(item => item.type === 'background' && item.equipped);
  
  // Get size dimensions
  const sizeStyles = {
    small: { width: 80, height: 80 },
    medium: { width: 150, height: 150 },
    large: { width: 250, height: 250 },
  }[size];
  
  if (!equippedBackground) {
    return null;
  }
  
  return (
    <View style={[styles.container, sizeStyles]}>
      <Image 
        source={{ uri: equippedBackground.imageUrl }} 
        style={[styles.background, sizeStyles]} 
        resizeMode="cover"
      />
      <Text style={styles.roomName}>{equippedBackground.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 12,
    overflow: 'hidden',
  },
  background: {
    borderRadius: 12,
  },
  roomName: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});