import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchLeagueLeaderboard } from "@/api/team-api";
import { Team } from "@/api/types/team";

export default function LeaderboardScreen() {
    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        if (leagueId) fetchLeagueLeaderboard(leagueId).then(setTeams);
    }, [leagueId]);

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
                Leaderboard
            </Text>

            {teams.length === 0 ? (
                <Text style={{ color: "#666" }}>
                    No leaderboard data yet.
                </Text>
            ) : (
                teams.map((t) => (
                    <Text key={t.id}>{t.teamName}</Text>
                ))
            )}
        </View>
    );

}
