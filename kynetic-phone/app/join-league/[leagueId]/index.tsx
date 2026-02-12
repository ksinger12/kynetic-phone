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

const USER_ID = "1";

// TO BE CREATED
// GET /api/league/{leagueId}/participants
async function fetchParticipants(): Promise<{ id: number; name: string }[]> {
    return [];
}

export default function JoinLeagueConfirmScreen() {
    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
    const router = useRouter();

    const [league, setLeague] = useState<League | null>(null);
    const [participants, setParticipants] = useState<any[]>([]);

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
                onPress={async () => {
                    await joinLeague(league.leagueId.toString(), USER_ID);
                    router.replace("/(tabs)/leagues");
                }}
            >
                <Text style={styles.joinText}>Join League</Text>
            </Pressable>
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
});
