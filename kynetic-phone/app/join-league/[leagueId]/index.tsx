import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { League } from "@/api/types/league";
import { fetchLeagueByLeagueId, joinLeague } from "@/api/league-api";
import { useAuth } from "@/context/AuthContext";
import { Modal, TextInput } from "react-native";


// TO BE CREATED
// GET /api/league/{leagueId}/participants
async function fetchParticipants(): Promise<{ id: number; name: string }[]> {
    return [];
}

export default function JoinLeagueConfirmScreen() {
    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const [league, setLeague] = useState<League | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamSlogan, setTeamSlogan] = useState("");
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        if (!leagueId) return;

        fetchLeagueByLeagueId(leagueId).then(setLeague);
        fetchParticipants().then(setParticipants);
    }, [leagueId]);

    if (!league) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{league.leagueName}</Text>
                <Text style={styles.sub}>{league.clubName}</Text>
                <Text style={styles.meta}>{league.sportName}</Text>
            </View>

            <Text style={styles.section}>Participants</Text>
            <FlatList
                data={participants}
                keyExtractor={(p) => p.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.participant}>{item.name}</Text>
                )}
            />

            <Pressable
                style={styles.joinButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.joinText}>Join League</Text>
            </Pressable>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Create Your Team</Text>

                        <TextInput
                            placeholder="Team Name"
                            value={teamName}
                            onChangeText={setTeamName}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Team Slogan (optional)"
                            value={teamSlogan}
                            onChangeText={setTeamSlogan}
                            style={styles.input}
                        />

                        <Pressable
                            style={styles.submitButton}
                            disabled={!teamName || submitting}
                            onPress={async () => {
                                if (!user || !teamName) return;

                                try {
                                    setSubmitting(true);

                                    await joinLeague(
                                        league.leagueId.toString(),
                                        user.userId.toString(),
                                        {
                                            teamName,
                                            teamSlogan,
                                        }
                                    );

                                    setModalVisible(false);
                                    router.replace("/(tabs)/leagues");
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            <Text style={styles.submitText}>
                                {submitting ? "Creating..." : "Submit"}
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        elevation: 3,
        marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: "700" },
    sub: { fontSize: 14, color: "#666", marginTop: 4 },
    meta: { fontSize: 12, color: "#007AFF", marginTop: 6 },

    section: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
    participant: { fontSize: 14, paddingVertical: 4 },

    joinButton: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: "auto",
    },
    joinText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 20,
    },

    modalCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },

    input: {
        backgroundColor: "#fff",
        color: "#000",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },

    submitButton: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },

    submitText: {
        color: "#fff",
        fontWeight: "700",
    },

    cancelText: {
        textAlign: "center",
        marginTop: 12,
        color: "#666",
    },

});
