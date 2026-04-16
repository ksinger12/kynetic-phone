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
    const { leagueId, bracketIndex } = useLocalSearchParams();
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
            router.push(`/teams/draft/${leagueId}/${index + 1}`);
        } else {
            router.push(`/teams/draft/${leagueId}/summary`);
        }
    };

    const goBack = () => {
        if (index === 0) return;
        router.push(`/teams/draft/${leagueId}/${index - 1}`);
    };

    return (
        <View style={styles.container}>
            {/* Progress Indicator */}
            <Text style={styles.progress}>
                Bracket {index + 1} of {brackets.length}
            </Text>

            {/* Bracket Navigation */}
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
                                router.push(`/teams/draft/${leagueId}/${i}`)
                            }
                        >
                            <Text
                                style={[
                                    styles.navText,
                                    active && styles.navTextActive,
                                ]}
                            >
                                {b.bracket.name[0]}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Bracket Title */}
            <Text style={styles.title}>{bracket.bracket.name}</Text>

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
        marginBottom: 20,
    },

    navItem: {
        backgroundColor: "#E5E7EB",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 6,
    },

    navItemActive: {
        backgroundColor: "#2563EB",
    },

    navText: {
        fontWeight: "600",
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