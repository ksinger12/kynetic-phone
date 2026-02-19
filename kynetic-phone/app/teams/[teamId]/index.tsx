import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    LayoutAnimation,
    Platform,
    UIManager,
    Animated,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { fetchTeamById } from "@/api/teams-api";
import { TeamData } from "@/api/types/teamData";

if (Platform.OS === "android") { // what is this?
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type PlayerPerformance = {
    id: number;
    name: string;
    rounds: number;
    avgScore: number;
    birdies: number;
};

export default function TeamDetailsScreen() {
    const { teamId } = useLocalSearchParams<{ teamId: string }>();
    const router = useRouter();
    const scheme = useColorScheme();
    const isDark = scheme === "dark"; // questionable

    const [team, setTeam] = useState<TeamData | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    const rotations = useRef<{ [key: number]: Animated.Value }>({}).current;

    const players: PlayerPerformance[] = [
        { id: 1, name: "Kyle S.", rounds: 12, avgScore: 78, birdies: 14 },
        { id: 2, name: "Mark T.", rounds: 9, avgScore: 82, birdies: 8 },
        { id: 3, name: "Chris L.", rounds: 15, avgScore: 76, birdies: 21 },
    ];

    useEffect(() => {
        if (!teamId) return;
        fetchTeamById(teamId).then(setTeam);
    }, [teamId]);

    if (!team) return null;

    const toggle = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (!rotations[id]) {
            rotations[id] = new Animated.Value(0);
        }

        const toValue = expanded === id ? 0 : 1; // bad naming

        Animated.timing(rotations[id], {
            toValue,
            duration: 200,
            useNativeDriver: true,
        }).start();

        setExpanded((prev) => (prev === id ? null : id));
    };

    const getRankColor = () => {
        if (team.rank === 1) return "#FBBF24";
        if (team.rank <= 3) return "#10B981";
        if (team.rank <= 6) return "#3B82F6";
        return "#EF4444";
    };

    const cardBg = isDark ? "#1F2937" : "#FFFFFF";
    const textPrimary = isDark ? "#F9FAFB" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#6B7280";

    return (
        <>
            <Stack.Screen options={{ title: team.teamName }} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentInsetAdjustmentBehavior="never"
                    contentContainerStyle={styles.container}
                >
                    {/* HEADER CARD */}
                    <View style={[styles.headerCard, { backgroundColor: cardBg }]}>
                        <Text style={[styles.teamName, { color: textPrimary }]}>
                            {team.teamName}
                        </Text>
                        <Text style={[styles.leagueName, { color: textSecondary }]}>
                            {team.leagueName}
                        </Text>
                    </View>

                    {/* ACTION + STATS */}
                    <View style={styles.topRow}>
                        <Pressable
                            style={styles.squareButton}
                            onPress={() =>
                                router.push({
                                    pathname: "/leagues/[leagueId]",
                                    params: { leagueId: team.teamId.toString() },
                                })
                            }
                        >
                            <Text style={styles.squareTitle}>View League</Text>
                        </Pressable>

                        <View
                            style={[
                                styles.squareStats,
                                { backgroundColor: getRankColor() },
                            ]}
                        >
                            <Text style={styles.rankText}>#{team.rank}</Text>
                            <Text style={styles.pointsText}>{team.points} pts</Text>
                        </View>
                    </View>

                    {/* PLAYERS */}
                    <View style={[styles.playersCard, { backgroundColor: cardBg }]}>
                        <Text style={[styles.sectionTitle, { color: textPrimary }]}>
                            Players
                        </Text>

                        {players.map((player) => {
                            if (!rotations[player.id]) {
                                rotations[player.id] = new Animated.Value(0);
                            }

                            const rotate = rotations[player.id].interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "90deg"],
                            });

                            return (
                                <View key={player.id}>
                                    <Pressable
                                        onPress={() => toggle(player.id)}
                                        style={styles.tableRow}
                                    >
                                        <Animated.Text
                                            style={[
                                                styles.chevron,
                                                { transform: [{ rotate }] },
                                            ]}
                                        >
                                            ▶
                                        </Animated.Text>

                                        <Text
                                            style={[
                                                styles.nameCell,
                                                { color: textPrimary },
                                            ]}
                                        >
                                            {player.name}
                                        </Text>

                                        <Text style={styles.statCell}>{player.rounds}</Text>
                                        <Text style={styles.statCell}>{player.avgScore}</Text>
                                        <Text style={styles.statCell}>{player.birdies}</Text>
                                    </Pressable>

                                    {expanded === player.id && (
                                        <View style={styles.expandedArea}>
                                            <Text style={styles.expandedText}>
                                                More detailed stats coming soon...
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },

    headerCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
    },

    teamName: {
        fontSize: 24,
        fontWeight: "800",
    },

    leagueName: {
        fontSize: 14,
        marginTop: 6,
    },

    topRow: {
        flexDirection: "row",
        marginBottom: 24,
    },

    squareButton: {
        flex: 1,
        backgroundColor: "#2563EB",
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: "center",
        marginRight: 12,
        elevation: 4,
    },

    squareTitle: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },

    squareStats: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: "center",
        elevation: 4,
    },

    rankText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 18,
    },

    pointsText: {
        color: "#fff",
        marginTop: 4,
        fontSize: 13,
    },

    playersCard: {
        borderRadius: 20,
        padding: 18,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
    },

    chevron: {
        marginRight: 10,
        fontSize: 14,
    },

    nameCell: {
        flex: 2,
        fontWeight: "600",
    },

    statCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 13,
        color: "#6B7280",
    },

    expandedArea: {
        padding: 12,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        marginBottom: 8,
    },

    expandedText: {
        fontSize: 12,
        color: "#6B7280",
    },
});
