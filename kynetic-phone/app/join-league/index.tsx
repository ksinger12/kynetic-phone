import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    Pressable,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { League } from "@/api/types/league";
import { fetchLeaguesByClubId } from "@/api/league-api";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";


export default function JoinLeagueScreen() {
    const router = useRouter();
    const [leagues, setLeagues] = useState<League[]>([]);
    const [search, setSearch] = useState("");
    const { activeClubId } = useAuth();

    useEffect(() => {
        if (!activeClubId) return;
        fetchLeaguesByClubId(activeClubId).then(setLeagues);
    }, [activeClubId]);

    const filtered = leagues.filter((l) =>
        l.leagueName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView edges={["bottom"]} style={styles.container}>

            <View style={styles.search}>
                <MaterialIcons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search leagues..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.leagueId.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: "/join-league/[leagueId]",
                                params: { leagueId: item.leagueId.toString() },
                            })

                        }
                    >
                        <Text style={styles.title}>{item.leagueName}</Text>
                        <Text style={styles.sub}>{item.clubName}</Text>
                        <Text style={styles.meta}>{item.sportName}</Text>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    search: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 3,
    },
    title: { fontSize: 16, fontWeight: "600" },
    sub: { fontSize: 13, color: "#666", marginTop: 2 },
    meta: { fontSize: 12, color: "#007AFF", marginTop: 6 },
});
