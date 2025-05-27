import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ShopItem as ShopItemType } from '@/types';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/store/progressStore';
import { usePetStore } from '@/store/petStore';

interface ShopItemProps {
  item: ShopItemType;
  onPurchase: (item: ShopItemType) => void;
  onEquip: (item: ShopItemType) => void;
}

export default function ShopItem({ item, onPurchase, onEquip }: ShopItemProps) {
  const { progress } = useProgressStore();
  const { pet } = usePetStore();
  const canAfford = progress.sweatCoins >= item.price;
  
  // Check if buddy is currently selected
  const isBuddySelected = item.type === 'buddy' && item.buddyType === pet.type;

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.coinText}>coins</Text>
        </View>
        
        {item.type === 'buddy' && (
          <Text style={styles.buddyType}>
            {item.buddyType?.charAt(0).toUpperCase()}{item.buddyType?.slice(1)} Buddy
          </Text>
        )}
      </View>
      
      <View style={styles.actionContainer}>
        {item.owned ? (
          <TouchableOpacity
            style={[
              styles.button,
              (item.equipped || isBuddySelected) ? styles.equippedButton : styles.equipButton
            ]}
            onPress={() => onEquip(item)}
            disabled={item.equipped || isBuddySelected}
          >
            <Text style={[
              styles.buttonText,
              (item.equipped || isBuddySelected) ? styles.equippedButtonText : styles.equipButtonText
            ]}>
              {item.type === 'buddy' 
                ? (isBuddySelected ? 'Selected' : 'Select')
                : (item.equipped ? 'Equipped' : 'Equip')
              }
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              canAfford ? styles.buyButton : styles.disabledButton
            ]}
            onPress={() => onPurchase(item)}
            disabled={!canAfford}
          >
            <Text style={[
              styles.buttonText,
              canAfford ? styles.buyButtonText : styles.disabledButtonText
            ]}>
              Buy
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.sweatCoin,
    marginRight: 4,
  },
  coinText: {
    fontSize: 12,
    color: colors.textLight,
  },
  buddyType: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  actionContainer: {
    marginLeft: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: colors.primary,
  },
  buyButtonText: {
    color: 'white',
  },
  equipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  equipButtonText: {
    color: colors.primary,
  },
  equippedButton: {
    backgroundColor: colors.success,
  },
  equippedButtonText: {
    color: 'white',
  },
  disabledButton: {
    backgroundColor: colors.inactive,
  },
  disabledButtonText: {
    color: 'white',
  },
});