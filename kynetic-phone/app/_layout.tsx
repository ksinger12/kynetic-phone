import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

function AuthGate() {
  const { authStatus, isBootstrapping } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const firstSegment = segments[0];
  const isIndexRoute = firstSegment === undefined;
  const isAuthRoute = isIndexRoute || firstSegment === "login";
  const isChangePasswordRoute = firstSegment === "change-password";
  const isProtectedRoute = !isAuthRoute && !isChangePasswordRoute;

  useEffect(() => {
    if (!navigationState?.key || isBootstrapping) {
      return;
    }

    if (authStatus === "unauthenticated" && (isProtectedRoute || isChangePasswordRoute)) {
      router.replace("/login");
      return;
    }

    if (authStatus === "must_change_password" && !isChangePasswordRoute) {
      router.replace("/change-password");
      return;
    }

    if (authStatus === "authenticated" && (isAuthRoute || isChangePasswordRoute)) {
      router.replace("/(tabs)/home");
    }
  }, [
    authStatus,
    isAuthRoute,
    isBootstrapping,
    isChangePasswordRoute,
    isProtectedRoute,
    navigationState?.key,
    router,
  ]);

  if (!navigationState?.key || isBootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}

function RootNavigator() {
  return (
    <>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ headerShown: true }} />
        <Stack.Screen
          name="change-password"
          options={{ headerShown: true, title: "Change Password" }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="join-league"
          options={{
            headerShown: true,
            title: "Join League",
          }}
        />
        <Stack.Screen
          name="leagues/[leagueId]/index"
          options={{ headerShown: true, title: "League" }}
        />
        <Stack.Screen
          name="leagues/[leagueId]/leaderboard"
          options={{ headerShown: true, title: "Leaderboard" }}
        />
        <Stack.Screen
          name="leagues/[leagueId]/round-leaderboard"
          options={{ headerShown: true, title: "Round Leaderboard" }}
        />
        <Stack.Screen
          name="leagues/[leagueId]/teams"
          options={{ headerShown: true, title: "Teams" }}
        />
        <Stack.Screen
          name="teams/[teamId]"
          options={{ headerShown: true, title: "Team Details" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
    zIndex: 1,
  },
});
