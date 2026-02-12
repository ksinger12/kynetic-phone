import { Stack } from "expo-router";

export default function JoinLeagueLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                // headerTitle: "Join League",
                headerBackTitle: "Leagues",
            }}
        />
    );
}

