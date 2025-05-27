import React from 'react';
import { Tabs } from 'expo-router';
import { Dumbbell, Home, ShoppingBag, User, BarChart, Settings } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Workout",
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="buddy"
        options={{
          title: "My Buddy",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}