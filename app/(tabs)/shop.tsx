import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShopStore } from '@/store/shopStore';
import { useProgressStore } from '@/store/progressStore';
import { usePetStore } from '@/store/petStore';
import { colors } from '@/constants/colors';
import ShopItem from '@/components/ShopItem';
import { ShopItem as ShopItemType } from '@/types';

export default function ShopScreen() {
  const { items, purchaseItem, equipItem } = useShopStore();
  const { progress, spendSweatCoins } = useProgressStore();
  const { setPetType } = usePetStore();
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'outfits' | 'backgrounds' | 'accessories' | 'buddies'>('all');
  
  // Filter items by category
  const filteredItems = items.filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'outfits') return item.type === 'outfit';
    if (activeCategory === 'backgrounds') return item.type === 'background';
    if (activeCategory === 'accessories') return item.type === 'accessory';
    if (activeCategory === 'buddies') return item.type === 'buddy';
    return true;
  });
  
  // Handle purchase
  const handlePurchase = (item: ShopItemType) => {
    if (progress.sweatCoins < item.price) {
      Alert.alert(
        'Not Enough Coins',
        'You need more Sweat Coins to purchase this item. Complete workouts to earn more!',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Confirm purchase
    Alert.alert(
      'Confirm Purchase',
      `Are you sure you want to buy ${item.name} for ${item.price} Sweat Coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            const success = purchaseItem(item.id);
            if (success) {
              spendSweatCoins(item.price);
              
              // If it's a buddy, automatically set it as the current pet
              if (item.type === 'buddy' && item.buddyType) {
                setPetType(item.buddyType);
              }
              
              Alert.alert(
                'Purchase Successful',
                `You've purchased ${item.name}!${item.type === 'buddy' ? ' Your buddy has been changed!' : ''}`,
                [{ text: 'Great!' }]
              );
            }
          },
        },
      ]
    );
  };
  
  // Handle equip
  const handleEquip = (item: ShopItemType) => {
    if (item.type === 'buddy' && item.buddyType) {
      // For buddies, change the pet type
      setPetType(item.buddyType);
      Alert.alert('Buddy Changed!', `You've selected the ${item.name}!`);
    } else {
      equipItem(item.id);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinsValue}>{progress.sweatCoins}</Text>
          <Text style={styles.coinsLabel}>Sweat Coins</Text>
        </View>
      </View>
      
      {/* Category tabs */}
      <View style={styles.categoriesContainer}>
        <Text
          style={[
            styles.categoryTab,
            activeCategory === 'all' && styles.activeCategoryTab
          ]}
          onPress={() => setActiveCategory('all')}
        >
          All
        </Text>
        
        <Text
          style={[
            styles.categoryTab,
            activeCategory === 'outfits' && styles.activeCategoryTab
          ]}
          onPress={() => setActiveCategory('outfits')}
        >
          Outfits
        </Text>
        
        <Text
          style={[
            styles.categoryTab,
            activeCategory === 'backgrounds' && styles.activeCategoryTab
          ]}
          onPress={() => setActiveCategory('backgrounds')}
        >
          Backgrounds
        </Text>
        
        <Text
          style={[
            styles.categoryTab,
            activeCategory === 'accessories' && styles.activeCategoryTab
          ]}
          onPress={() => setActiveCategory('accessories')}
        >
          Accessories
        </Text>
        
        <Text
          style={[
            styles.categoryTab,
            activeCategory === 'buddies' && styles.activeCategoryTab
          ]}
          onPress={() => setActiveCategory('buddies')}
        >
          Buddies
        </Text>
      </View>
      
      {/* Shop items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShopItem
            item={item}
            onPurchase={handlePurchase}
            onEquip={handleEquip}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  coinsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.sweatCoin,
    marginRight: 4,
  },
  coinsLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    fontSize: 14,
    color: colors.textLight,
  },
  activeCategoryTab: {
    backgroundColor: colors.primary,
    color: 'white',
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
  },
});