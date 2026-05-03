import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { fetchLeagueTeams } from "@/api/teams-api";
import { UserTeam } from "@/api/types/userTeam";

export default function TeamsScreen() {
    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
    const router = useRouter();
    const [teams, setTeams] = useState<UserTeam[]>([]);

    useEffect(() => {
        if (!leagueId) return;

        fetchLeagueTeams(leagueId).then(setTeams);
    }, [leagueId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Teams
            </Text>

            {teams.length === 0 ? (
                <Text style={styles.emptyText}>
                    No teams have been created yet.
                </Text>
            ) : (
                teams.map((team) => (
                    <Pressable
                        key={team.teamId}
                        style={styles.card}
                        onPress={() => router.push(`/teams/${team.teamId}`)}
                    >
                        <Text style={styles.teamName}>
                            {team.teamName}
                        </Text>

                        <Text style={styles.metaText}>
                            Rank #{team.rank} / {team.points} pts
                        </Text>
                    </Pressable>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },

    emptyText: {
        color: "#666",
    },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    teamName: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },

    metaText: {
        color: "#666",
    },
});
