import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePetStore } from '@/store/petStore';
import { useShopStore } from '@/store/shopStore';
import { useProgressStore } from '@/store/progressStore';
import { colors } from '@/constants/colors';
import PetAvatar from '@/components/PetAvatar';
import RoomDecorations from '@/components/RoomDecorations';
import InteractiveElements from '@/components/InteractiveElements';
import Button from '@/components/Button';
import { backgrounds, outfits, accessories, petImages } from '@/constants/petAssets';
import { PetType, PetMood } from '@/types';
import { ChevronDown } from 'lucide-react-native';

export default function BuddyScreen() {
  const { pet, setPetName, setPetMood, setPetType } = usePetStore();
  const { items, getItemById } = useShopStore();
  const { progress } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState<'closet' | 'backgrounds' | 'accessories'>('closet');
  const [interactionCount, setInteractionCount] = useState(0);
  const [lastInteraction, setLastInteraction] = useState<string | null>(null);
  const [showBuddySelector, setShowBuddySelector] = useState(false);
  
  // Get owned items by type
  const ownedOutfits = items.filter(item => item.type === 'outfit' && item.owned);
  const ownedBackgrounds = items.filter(item => item.type === 'background' && item.owned);
  const ownedAccessories = items.filter(item => item.type === 'accessory' && item.owned);
  const ownedBuddies = items.filter(item => item.type === 'buddy' && item.owned);
  
  // Get equipped items
  const equippedOutfit = items.find(item => item.type === 'outfit' && item.equipped);
  const equippedBackground = items.find(item => item.type === 'background' && item.equipped);
  const equippedAccessories = items.filter(item => item.type === 'accessory' && item.equipped);
  
  // Handle pet interactions
  const handleInteraction = (type: 'pet' | 'play' | 'music') => {
    setInteractionCount(prev => prev + 1);
    setLastInteraction(type);
    
    // Show reaction based on interaction type
    if (type === 'pet') {
      Alert.alert(`${pet.name} purrs happily!`, 'You earned 1 Sweat Coin');
    } else if (type === 'play') {
      Alert.alert(`${pet.name} jumps around excitedly!`, 'You earned 2 Sweat Coins');
    } else if (type === 'music') {
      if (pet.mood === 'sleepy') {
        Alert.alert(`${pet.name} perks up to the music!`, 'You earned 1 Sweat Coin');
      } else {
        Alert.alert(`${pet.name} relaxes to the soothing melody.`, 'You earned 1 Sweat Coin');
      }
    }
  };
  
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
  
  // Handle buddy selection
  const handleBuddySelect = (buddyType: PetType) => {
    setPetType(buddyType);
    setShowBuddySelector(false);
    Alert.alert('Buddy Changed!', `You've selected the ${buddyType}!`);
  };
  
  // Get available buddies (owned + default ones)
  const getAvailableBuddies = (): PetType[] => {
    const defaultBuddies: PetType[] = ['fox', 'panda', 'corgi', 'koala'];
    const ownedBuddyTypes = ownedBuddies.map(buddy => buddy.buddyType).filter(Boolean) as PetType[];
    
    // Combine default and owned, remove duplicates
    const allBuddies = [...new Set([...defaultBuddies, ...ownedBuddyTypes])];
    return allBuddies;
  };
  
  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'closet':
        return (
          <View style={styles.itemsGrid}>
            {ownedOutfits.length > 0 ? (
              ownedOutfits.map((outfit) => (
                <TouchableOpacity
                  key={outfit.id}
                  style={[
                    styles.itemCard,
                    outfit.equipped && styles.equippedItemCard
                  ]}
                  onPress={() => handleEquipItem(outfit.id)}
                >
                  <Image source={{ uri: outfit.imageUrl }} style={styles.itemImage} />
                  <Text style={styles.itemName}>{outfit.name}</Text>
                  {outfit.equipped && (
                    <View style={styles.equippedBadge}>
                      <Text style={styles.equippedText}>Equipped</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No outfits yet. Visit the shop to buy some!
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'backgrounds':
        return (
          <View style={styles.itemsGrid}>
            {ownedBackgrounds.length > 0 ? (
              ownedBackgrounds.map((background) => (
                <TouchableOpacity
                  key={background.id}
                  style={[
                    styles.itemCard,
                    background.equipped && styles.equippedItemCard
                  ]}
                  onPress={() => handleEquipItem(background.id)}
                >
                  <Image source={{ uri: background.imageUrl }} style={styles.itemImage} />
                  <Text style={styles.itemName}>{background.name}</Text>
                  {background.equipped && (
                    <View style={styles.equippedBadge}>
                      <Text style={styles.equippedText}>Equipped</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No backgrounds yet. Visit the shop to buy some!
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'accessories':
        return (
          <View style={styles.itemsGrid}>
            {ownedAccessories.length > 0 ? (
              ownedAccessories.map((accessory) => (
                <TouchableOpacity
                  key={accessory.id}
                  style={[
                    styles.itemCard,
                    accessory.equipped && styles.equippedItemCard
                  ]}
                  onPress={() => handleEquipItem(accessory.id)}
                >
                  <Image source={{ uri: accessory.imageUrl }} style={styles.itemImage} />
                  <Text style={styles.itemName}>{accessory.name}</Text>
                  {accessory.equipped && (
                    <View style={styles.equippedBadge}>
                      <Text style={styles.equippedText}>Equipped</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No accessories yet. Visit the shop to buy some!
                </Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };
  
  // Handle equipping items
  const handleEquipItem = (itemId: string) => {
    const item = getItemById(itemId);
    if (!item) return;
    
    // Toggle equipped state
    if (item.equipped) {
      // Unequip
      if (item.type === 'outfit') {
        usePetStore.getState().equipOutfit(undefined);
      } else if (item.type === 'background') {
        usePetStore.getState().equipBackground(undefined);
      } else if (item.type === 'accessory') {
        usePetStore.getState().toggleAccessory(itemId);
      }
      useShopStore.getState().unequipItem(itemId);
    } else {
      // Equip
      if (item.type === 'outfit') {
        usePetStore.getState().equipOutfit(itemId);
      } else if (item.type === 'background') {
        usePetStore.getState().equipBackground(itemId);
      } else if (item.type === 'accessory') {
        usePetStore.getState().toggleAccessory(itemId);
      }
      useShopStore.getState().equipItem(itemId);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{pet.name}'s Room</Text>
        
        <View style={styles.headerRight}>
          <View style={styles.coinsContainer}>
            <Text style={styles.coinsValue}>{progress.sweatCoins}</Text>
            <Text style={styles.coinsLabel}>Coins</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.buddySelector}
            onPress={() => setShowBuddySelector(true)}
          >
            <Text style={styles.buddySelectorText}>Buddy</Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Pet display with room decorations */}
      <View style={styles.petContainer}>
        <RoomDecorations size="large" />
        <PetAvatar size="large" showName={true} showMood={true} />
        
        {/* Interactive elements */}
        <InteractiveElements onInteraction={handleInteraction} />
        
        {/* Interaction feedback */}
        {lastInteraction && (
          <View style={styles.interactionFeedback}>
            <Text style={styles.interactionText}>
              {interactionCount} interactions today
            </Text>
          </View>
        )}
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'closet' && styles.activeTab
          ]}
          onPress={() => setActiveTab('closet')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'closet' && styles.activeTabText
          ]}>
            Outfits
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'backgrounds' && styles.activeTab
          ]}
          onPress={() => setActiveTab('backgrounds')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'backgrounds' && styles.activeTabText
          ]}>
            Backgrounds
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'accessories' && styles.activeTab
          ]}
          onPress={() => setActiveTab('accessories')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'accessories' && styles.activeTabText
          ]}>
            Accessories
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Items */}
      <ScrollView 
        style={styles.itemsContainer}
        contentContainerStyle={styles.itemsContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
      
      {/* Buddy Selector Modal */}
      <Modal
        visible={showBuddySelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBuddySelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Buddy</Text>
            
            <ScrollView style={styles.buddyScrollContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.buddyGrid}>
                {getAvailableBuddies().map((buddyType) => (
                  <TouchableOpacity
                    key={buddyType}
                    style={[
                      styles.buddyOption,
                      pet.type === buddyType && styles.selectedBuddy
                    ]}
                    onPress={() => handleBuddySelect(buddyType)}
                  >
                    <Image
                      source={{ uri: petImages[buddyType].neutral }}
                      style={styles.buddyImage}
                    />
                    <Text style={[
                      styles.buddyText,
                      pet.type === buddyType && styles.selectedBuddyText
                    ]}>
                      {buddyType.charAt(0).toUpperCase() + buddyType.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <Button
              title="Cancel"
              onPress={() => setShowBuddySelector(false)}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  buddySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  buddySelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  petContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  interactionFeedback: {
    marginTop: 12,
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  interactionText: {
    fontSize: 14,
    color: colors.textLight,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
  },
  itemsContainer: {
    flex: 1,
  },
  itemsContent: {
    padding: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  equippedItemCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  equippedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  equippedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyState: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  buddyScrollContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  buddyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buddyOption: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedBuddy: {
    backgroundColor: '#E8EFFF',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buddyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  buddyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  selectedBuddyText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
  },
});