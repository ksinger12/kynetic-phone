import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { fetchLeagueBrackets } from "@/api/league-api";
import { LeagueBracket } from "@/api/types/leagueBracket";
import { BracketPlayer } from "@/api/types/bracketPlayer";

export default function DraftBracketScreen() {

    const { teamId, bracketIndex } = useLocalSearchParams<{
        teamId: string;
        bracketIndex: string;
    }>();

    const router = useRouter();

    const [brackets, setBrackets] = useState<LeagueBracket[]>([]);
    const [selected, setSelected] = useState<number[]>([]);

    const index = Number(bracketIndex);

    useEffect(() => {
        fetchLeagueBrackets(teamId).then(setBrackets);
    }, []);

    if (!brackets.length) return null;

    const bracket = brackets[index];

    const toggle = (player: BracketPlayer) => {

        if (selected.includes(player.playerId)) {
            setSelected(selected.filter(p => p !== player.playerId));
            return;
        }

        if (selected.length >= bracket.bracket.playersToPick) return;

        setSelected([...selected, player.playerId]);
    };

    const next = () => {

        if (index + 1 < brackets.length) {
            router.push({
                pathname: "/teams/[teamId]/draft/[bracketIndex]",
                params: { teamId, bracketIndex: (index + 1).toString() }
            });
        } else {
            router.push(`/teams/${teamId}/draft/summary`);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{bracket.bracket.name}</Text>

            <Text style={styles.subtitle}>
                Select {bracket.bracket.playersToPick} players
            </Text>

            <FlatList
                data={bracket.players}
                keyExtractor={(p) => p.playerId.toString()}
                renderItem={({ item }) => {

                    const active = selected.includes(item.playerId);

                    return (
                        <Pressable
                            style={[styles.player, active && styles.playerSelected]}
                            onPress={() => toggle(item)}
                        >
                            <Text>
                                {item.firstName} {item.lastName}
                            </Text>
                        </Pressable>
                    );
                }}
            />

            <Pressable style={styles.nextButton} onPress={next}>
                <Text style={{ color: "#fff" }}>Next</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1, padding: 20 },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },

    subtitle: {
        marginBottom: 20,
        color: "#666",
    },

    player: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#fff",
        marginBottom: 10,
    },

    playerSelected: {
        backgroundColor: "#DBEAFE",
    },

    nextButton: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
});