import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    fetchLeagueByLeagueIdAndUserId,
    fetchLeagueRoundLeaderboard,
} from "@/api/league-api";
import { fetchLeagueLeaderboard } from "@/api/team-api";

import { League } from "@/api/types/league";
import { RoundLeaderboard } from "@/api/types/roundLeaderboard";
import { Team } from "@/api/types/team";
import { useAuth } from "@/context/AuthContext";

export default function LeagueDetailScreen() {

    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
    const router = useRouter();
    const navigation = useNavigation();
    const { user } = useAuth();

    const [league, setLeague] = useState<League | null>(null);
    const [roundLeaderboard, setRoundLeaderboard] = useState<RoundLeaderboard | null>(null);
    const [leaderboard, setLeaderboard] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!leagueId || !user) return;

        async function loadData() {

            if (!user) return;

            try {
                setLoading(true);

                const [leagueRes, roundBoard, leaderboardRes] = await Promise.all([
                    fetchLeagueByLeagueIdAndUserId(leagueId, user.userId),
                    fetchLeagueRoundLeaderboard(leagueId),
                    fetchLeagueLeaderboard(leagueId),
                ]);

                setLeague(leagueRes);
                setRoundLeaderboard(roundBoard);
                setLeaderboard(leaderboardRes);
            } catch (e) {
                console.warn("Partial league load failed:", e);
                // console.error("League load failed:", e);
                // setError("Failed to load league data");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [leagueId, user]);

    useEffect(() => {
        navigation.setOptions({
            title: league?.leagueName ?? "League",
        });
    }, [navigation, league]);


    // ✅ Loading state (no blank screen anymore)
    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 8 }}>Loading league...</Text>
            </SafeAreaView>
        );
    }

    if (!leagueId || !league) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Invalid league</Text>
            </SafeAreaView>
        );
    }

    // ✅ Error state
    if (!league) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>League not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    {league?.leagueName ?? "League"}
                </Text>
                <Text style={styles.subtitle}>
                    {league?.clubName ?? " "}
                </Text>
            </View>

            {/* Weekly Game Card */}
            <TouchableOpacity
                style={[styles.card, !roundLeaderboard && styles.cardDisabled]}
                disabled={!roundLeaderboard}
                onPress={() => router.push(`/leagues/${leagueId}/round-leaderboard`)}
            >
                <Text style={styles.cardTitle}>Weekly Game</Text>
                <Text style={styles.cardValue}>
                    {roundLeaderboard ? "View current round" : "No active game"}
                </Text>
            </TouchableOpacity>


            {/* Leaderboard Card */}
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/leagues/${leagueId}/leaderboard`)}
            >
                <Text style={styles.cardTitle}>Leaderboard</Text>
                <Text style={styles.cardValue}>
                    {leaderboard.length > 0
                        ? `${leaderboard.length} teams`
                        : "No teams yet"}
                </Text>
            </TouchableOpacity>


            {/* Teams Card */}
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/leagues/${leagueId}/teams`)}
            >
                <Text style={styles.cardTitle}>Teams</Text>
                <Text style={styles.cardValue}>
                    {leaderboard.length > 0 ? "View teams" : "No teams created"}
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        marginBottom: 20,
    },
    title: { fontSize: 22, fontWeight: "700" },
    subtitle: { fontSize: 14, color: "#666" },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 13,
        color: "#555",
    },
    cardDisabled: {
        opacity: 0.6,
    }
});
