import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { addPlayersToTeam, fetchLeagueBrackets } from "@/api/league-api";
import { DraftTeamPlayers } from "@/api/types/draftTeamPlayers";
import { LeagueBracket } from "@/api/types/leagueBracket";
import { useDraft } from "./_layout";

export default function DraftSummaryScreen() {

    const { teamId, leagueId } = useLocalSearchParams<{
        teamId: string;
        leagueId: string;
    }>();
    const router = useRouter();

    const { selections } = useDraft();

    const [brackets, setBrackets] = useState<LeagueBracket[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchLeagueBrackets(leagueId as string).then(setBrackets);
    }, []);

    const submit = async () => {

        if (!leagueId || !teamId || submitting) return;

        const playerIds = Object.values(selections).flatMap(
            (players) => players as number[]
        );

        const payload: DraftTeamPlayers = {
            playerIds,
        };

        try {
            setSubmitting(true);

            await addPlayersToTeam(leagueId, teamId, payload);

            router.replace(`/leagues/${leagueId}`);
        } catch (error) {
            console.error("Failed to submit draft", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Draft Summary</Text>

            {brackets.map((b, index) => {

                const picks = selections[b.bracket.id] ?? [];

                return (
                    <View key={b.bracket.id} style={styles.card}>

                        <Text style={styles.bracket}>
                            {b.bracket.bracketName}
                        </Text>

                        {picks.map((playerId: number) => {

                            const p = b.players.find(
                                x => x.playerId === playerId
                            );

                            return (
                                <Text key={playerId}>
                                    • {p?.firstName} {p?.lastName}
                                </Text>
                            );
                        })}

                        <Pressable
                            onPress={() =>
                                router.push(`/teams/${teamId}/draft/${leagueId}/${index}`)
                            }
                        >
                            <Text style={styles.edit}>Edit</Text>
                        </Pressable>

                    </View>
                );
            })}

            <Pressable
                style={[styles.submit, submitting && styles.submitDisabled]}
                onPress={submit}
                disabled={submitting}
            >
                <Text style={styles.submitText}>
                    {submitting ? "Submitting..." : "Submit Team"}
                </Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, padding: 20 },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20
    },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16
    },

    bracket: {
        fontWeight: "700",
        marginBottom: 6
    },

    edit: {
        marginTop: 8,
        color: "#2563EB"
    },

    submit: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20
    },

    submitDisabled: {
        opacity: 0.7,
    },

    submitText: {
        color: "#fff",
    }
});
