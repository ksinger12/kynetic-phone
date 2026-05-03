import { useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Pressable,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    fetchMyLeagueById,
    fetchLeagueRoundLeaderboard,
} from "@/api/league-api";
import { fetchLeagueLeaderboard } from "@/api/team-api";
import { fetchLeagueTeams } from "@/api/teams-api";

import { League } from "@/api/types/league";
import { RoundLeaderboard } from "@/api/types/roundLeaderboard";
import { Team } from "@/api/types/team";
import { UserTeam } from "@/api/types/userTeam";
import {
    beginNavigationLock,
    canStartNavigation,
} from "@/utils/navigation-lock";

export default function LeagueDetailScreen() {

    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
    const router = useRouter();
    const navigation = useNavigation();

    const [league, setLeague] = useState<League | null>(null);
    const [roundLeaderboard, setRoundLeaderboard] = useState<RoundLeaderboard | null>(null);
    const [leaderboard, setLeaderboard] = useState<Team[]>([]);
    const [teams, setTeams] = useState<UserTeam[]>([]);
    const navigationLockRef = useRef(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!leagueId) return;

        async function loadData() {
            try {
                setLoading(true);

                const [leagueRes, roundBoard, leaderboardRes, teamsRes] = await Promise.all([
                    fetchMyLeagueById(leagueId),
                    fetchLeagueRoundLeaderboard(leagueId),
                    fetchLeagueLeaderboard(leagueId),
                    fetchLeagueTeams(leagueId),
                ]);

                setLeague(leagueRes);
                setRoundLeaderboard(roundBoard);
                setLeaderboard(leaderboardRes);
                setTeams(teamsRes);
            } catch (e) {
                console.warn("Partial league load failed:", e);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [leagueId]);

    useEffect(() => {
        navigation.setOptions({
            title: league?.leagueName ?? "League",
        });
    }, [navigation, league]);

    useFocusEffect(
        useCallback(() => {
            navigationLockRef.current = false;
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading league...</Text>
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {league.leagueName}
                    </Text>
                    <Text style={styles.subtitle}>
                        {league.clubName}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.card, !roundLeaderboard && styles.cardDisabled]}
                    disabled={!roundLeaderboard}
                    onPress={() => {
                        if (navigationLockRef.current || !canStartNavigation()) return;
                        navigationLockRef.current = true;
                        beginNavigationLock();
                        router.navigate(`/leagues/${leagueId}/round-leaderboard`);
                    }}
                >
                    <Text style={styles.cardTitle}>Weekly Game</Text>
                    <Text style={styles.cardValue}>
                        {roundLeaderboard ? "View current round" : "No active game"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => {
                        if (navigationLockRef.current || !canStartNavigation()) return;
                        navigationLockRef.current = true;
                        beginNavigationLock();
                        router.navigate(`/leagues/${leagueId}/leaderboard`);
                    }}
                >
                    <Text style={styles.cardTitle}>Leaderboard</Text>
                    <Text style={styles.cardValue}>
                        {leaderboard.length > 0
                            ? `${leaderboard.length} teams`
                            : "No teams yet"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Teams</Text>
                    <Text style={styles.sectionSubtitle}>
                        {teams.length > 0 ? `${teams.length} teams` : "No teams created yet"}
                    </Text>
                </View>

                {teams.length === 0 ? (
                    <View style={styles.emptyStateCard}>
                        <Text style={styles.emptyStateText}>
                            Teams will show up here once they have been created.
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.teamRow}
                    >
                        {teams.map((team) => (
                            <Pressable
                                key={team.teamId}
                                style={styles.teamCard}
                                onPress={() => {
                                    if (navigationLockRef.current || !canStartNavigation()) return;
                                    navigationLockRef.current = true;
                                    beginNavigationLock();
                                    router.push(`/teams/${team.teamId}`);
                                }}
                            >
                                <Text style={styles.teamName}>
                                    {team.teamName}
                                </Text>

                                <Text style={styles.teamLeagueText}>
                                    {team.players.length} players
                                </Text>

                                <View style={styles.teamMetaRow}>
                                    <Text style={styles.teamBadge}>#{team.rank}</Text>
                                    <Text style={styles.teamPoints}>{team.points} pts</Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        padding: 16,
        paddingBottom: 24,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 8,
    },

    header: {
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
    },

    subtitle: {
        fontSize: 14,
        color: "#666",
    },

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
    },

    sectionHeader: {
        marginTop: 8,
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },

    sectionSubtitle: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },

    emptyStateCard: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        elevation: 2,
    },

    emptyStateText: {
        fontSize: 13,
        color: "#666",
    },

    teamRow: {
        paddingRight: 16,
    },

    teamCard: {
        width: 220,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        elevation: 3,
    },

    teamName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },

    teamLeagueText: {
        fontSize: 13,
        color: "#666",
        marginTop: 6,
    },

    teamMetaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },

    teamBadge: {
        backgroundColor: "#DBEAFE",
        color: "#1D4ED8",
        fontWeight: "700",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        overflow: "hidden",
    },

    teamPoints: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
    },
});
