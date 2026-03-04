import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from "@/context/AuthContext";
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Public */}
          <Stack.Screen name="index" />
          <Stack.Screen
            name="login"
            options={{ headerShown: true }}
          />

          <Stack.Screen
            name="signup/step-one"
            options={{ headerShown: true, title: 'Create Account' }}
          />

          <Stack.Screen
            name="signup/step-two"
            options={{ headerShown: true, title: 'Select Clubs' }}
          />

          {/* Main App */}
          <Stack.Screen name="(tabs)" />

          {/* Detail pages */}
          <Stack.Screen
            name="join-league"
            options={{
              headerShown: true,
              title: 'Join League',
            }}
          />

          <Stack.Screen
            name="leagues/[leagueId]/index"
            options={{ headerShown: true, title: 'League' }}
          />

          <Stack.Screen
            name="leagues/[leagueId]/leaderboard"
            options={{ headerShown: true, title: 'Leaderboard' }}
          />

          <Stack.Screen
            name="leagues/[leagueId]/round-leaderboard"
            options={{ headerShown: true, title: 'Round Leaderboard' }}
          />

          <Stack.Screen
            name="leagues/[leagueId]/teams"
            options={{ headerShown: true, title: 'Teams' }}
          />

          <Stack.Screen
            name="teams/[teamId]"
            options={{ headerShown: true, title: 'Team Details' }}
          />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
