import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { fetchLeagueBrackets } from "@/api/league-api";
import { LeagueBracket } from "@/api/types/leagueBracket";

export default function DraftStartScreen() {

    const { teamId } = useLocalSearchParams<{ teamId: string }>();
    const router = useRouter();

    const [brackets, setBrackets] = useState<LeagueBracket[]>([]);

    useEffect(() => {
        if (!teamId) return;

        fetchLeagueBrackets(teamId).then(setBrackets);
    }, [teamId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Draft Your Team</Text>

            <Text style={styles.subtitle}>
                You must select players from each bracket.
            </Text>

            <Pressable
                style={styles.button}
                onPress={() =>
                    router.push({
                        pathname: "/teams/[teamId]/draft/[bracketIndex]",
                        params: { teamId, bracketIndex: "0" },
                    })
                }
            >
                <Text style={styles.buttonText}>Start Draft</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },

    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
    },

    button: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 14,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
});