import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack } from "expo-router";

export default function LeagueDetailScreen() {
    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();

    // later:
    // fetchLeagueDetails(userId, leagueId)

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "League" }} />
            <View style={styles.container}>
                <Text style={styles.title}>League Detail</Text>
                <Text style={styles.label}>League ID:</Text>
                <Text style={styles.value}>{leagueId}</Text>

                <Text style={styles.label}>User ID:</Text>
                <Text style={styles.value}>1</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginTop: 12,
    },
    value: {
        fontSize: 16,
        fontWeight: "500",
    },
});
