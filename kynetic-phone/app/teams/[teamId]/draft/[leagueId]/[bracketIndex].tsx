import { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    FlatList,
    StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { fetchLeagueBrackets } from "@/api/league-api";
import { LeagueBracket } from "@/api/types/leagueBracket";
import { BracketPlayer } from "@/api/types/bracketPlayer";
import { useDraft } from "./_layout";

export default function DraftBracketScreen() {
    const { teamId, leagueId, bracketIndex } = useLocalSearchParams<{
        teamId: string;
        leagueId: string;
        bracketIndex: string;
    }>();
    const router = useRouter();

    const { selections, setSelections } = useDraft();

    const [brackets, setBrackets] = useState<LeagueBracket[]>([]);

    const index = Number(bracketIndex);

    useEffect(() => {
        fetchLeagueBrackets(leagueId as string).then(setBrackets);
    }, []);

    if (!brackets.length) return null;

    const bracket = brackets[index];
    const selected = selections[bracket.bracket.id] ?? [];

    const togglePlayer = (player: BracketPlayer) => {
        let next = selected;

        if (selected.includes(player.playerId)) {
            next = selected.filter((p: number) => p !== player.playerId);
        } else {
            if (selected.length >= bracket.bracket.playersToPick) return;
            next = [...selected, player.playerId];
        }

        setSelections({
            ...selections,
            [bracket.bracket.id]: next,
        });
    };

    const nextDisabled = selected.length !== bracket.bracket.playersToPick;

    const goNext = () => {
        if (index + 1 < brackets.length) {
            router.push(`/teams/${teamId}/draft/${leagueId}/${index + 1}`);
        } else {
            router.push(`/teams/${teamId}/draft/${leagueId}/summary`);
        }
    };

    const goBack = () => {
        if (index === 0) return;
        router.push(`/teams/${teamId}/draft/${leagueId}/${index - 1}`);
    };

    return (
        <View style={styles.container}>
            {/* Progress Indicator */}
            <Text style={styles.progress}>
                Bracket {index + 1} of {brackets.length}
            </Text>

            {/* Bracket Navigation */}
            <View style={styles.selectorCard}>
                <Text style={styles.selectorTitle}>Jump to Bracket</Text>
                <View style={styles.navRow}>
                    {brackets.map((b, i) => {
                        const active = i === index;

                        return (
                            <Pressable
                                key={b.bracket.id}
                                style={[
                                    styles.navItem,
                                    active && styles.navItemActive,
                                ]}
                                onPress={() =>
                                    router.push(`/teams/${teamId}/draft/${leagueId}/${i}`)
                                }
                            >
                                <Text
                                    style={[
                                        styles.navText,
                                        active && styles.navTextActive,
                                    ]}
                                >
                                    {i + 1}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Bracket Title */}
            <Text style={styles.title}>{bracket.bracket.bracketName}</Text>

            {/* Pick Counter */}
            <Text style={styles.pickCount}>
                {selected.length} / {bracket.bracket.playersToPick} selected
            </Text>

            {/* Player List */}
            <FlatList
                data={bracket.players}
                keyExtractor={(p) => p.playerId.toString()}
                renderItem={({ item }) => {
                    const active = selected.includes(item.playerId);

                    return (
                        <Pressable
                            style={[
                                styles.player,
                                active && styles.playerSelected,
                            ]}
                            onPress={() => togglePlayer(item)}
                        >
                            <Text style={styles.playerText}>
                                {item.firstName} {item.lastName}
                            </Text>
                        </Pressable>
                    );
                }}
            />

            {/* Navigation Buttons */}
            <View style={styles.footer}>
                <Pressable
                    style={[styles.button, styles.backButton]}
                    onPress={goBack}
                    disabled={index === 0}
                >
                    <Text style={styles.buttonText}>Back</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        styles.nextButton,
                        nextDisabled && styles.buttonDisabled,
                    ]}
                    onPress={goNext}
                    disabled={nextDisabled}
                >
                    <Text style={styles.buttonText}>
                        {index + 1 === brackets.length ? "Summary" : "Next"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    progress: {
        fontSize: 13,
        color: "#777",
        marginBottom: 10,
    },

    navRow: {
        flexDirection: "row",
        marginTop: 10,
        flexWrap: "wrap",
        gap: 8,
    },

    selectorCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },

    selectorTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#6B7280",
        letterSpacing: 0.3,
        textTransform: "uppercase",
    },

    navItem: {
        width: 38,
        height: 38,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    navItemActive: {
        backgroundColor: "#2563EB",
    },

    navText: {
        fontWeight: "700",
        color: "#374151",
    },

    navTextActive: {
        color: "#fff",
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
    },

    pickCount: {
        marginBottom: 12,
        color: "#666",
    },

    player: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },

    playerSelected: {
        backgroundColor: "#DBEAFE",
    },

    playerText: {
        fontSize: 15,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    button: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    backButton: {
        backgroundColor: "#9CA3AF",
        marginRight: 8,
    },

    nextButton: {
        backgroundColor: "#2563EB",
    },

    buttonDisabled: {
        backgroundColor: "#CBD5F5",
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
});
