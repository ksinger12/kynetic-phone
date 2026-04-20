import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DraftSummaryScreen() {
    const { teamId } = useLocalSearchParams<{ teamId: string }>();
    const router = useRouter();

    // This would normally come from state/context
    const mockSelections = [
        {
            bracketName: "A Tier",
            players: ["Scottie Scheffler", "Rory McIlroy"],
        },
        {
            bracketName: "B Tier",
            players: ["Justin Thomas"],
        },
        {
            bracketName: "C Tier",
            players: ["Corey Conners", "Sahith Theegala"],
        },
    ];

    const submitTeam = async () => {
        console.log("Submitting team...");

        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Team submitted!");

        router.replace(`/teams/${teamId}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Draft Summary</Text>

            {mockSelections.map((bracket, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.bracketTitle}>{bracket.bracketName}</Text>

                    {bracket.players.map((player, i) => (
                        <Text key={i} style={styles.player}>
                            • {player}
                        </Text>
                    ))}
                </View>
            ))}

            <Pressable style={styles.submitButton} onPress={submitTeam}>
                <Text style={styles.submitText}>Submit Team</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
    },

    bracketTitle: {
        fontWeight: "700",
        marginBottom: 6,
    },

    player: {
        fontSize: 14,
        marginBottom: 2,
    },

    submitButton: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
    },

    submitText: {
        color: "#fff",
        fontWeight: "700",
    },
});