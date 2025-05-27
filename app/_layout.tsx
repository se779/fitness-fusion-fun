import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  const { user } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if the user has completed onboarding
    const inOnboarding = segments[0] === 'onboarding';
    
    if (!user.onboardingCompleted && !inOnboarding) {
      // User hasn't completed onboarding and is not in onboarding, redirect to onboarding
      router.replace('/onboarding');
    } else if (user.onboardingCompleted && inOnboarding) {
      // User has completed onboarding but is in onboarding screen, redirect to main app
      router.replace('/(tabs)');
    }
  }, [user.onboardingCompleted, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}