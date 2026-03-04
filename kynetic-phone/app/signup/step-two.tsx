import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { registerUser } from "@/api/auth-api";

// 🔥 MOCK CLUBS
const MOCK_CLUBS = [
    { id: 1, clubName: "Cedar Brae Golf Club" },
    { id: 2, clubName: "Royal Montreal Golf Club" },
    { id: 3, clubName: "Hamilton Golf & Country Club" },
];

export default function SignupStepTwo() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [selectedClubs, setSelectedClubs] = useState<
        { clubId: number; memberNumber: string }[]
    >([]);

    const toggleClub = (clubId: number) => {
        setSelectedClubs((prev) => {
            const exists = prev.find((c) => c.clubId === clubId);
            if (exists) {
                return prev.filter((c) => c.clubId !== clubId);
            }
            return [...prev, { clubId, memberNumber: "" }];
        });
    };

    const updateMemberNumber = (clubId: number, value: string) => {
        setSelectedClubs((prev) =>
            prev.map((c) =>
                c.clubId === clubId ? { ...c, memberNumber: value } : c
            )
        );
    };

    const handleSubmit = async () => {
        try {
            await registerUser({
                firstName: params.firstName as string,
                lastName: params.lastName as string,
                username: params.username as string,
                email: params.email as string,
                password: params.password as string,
                clubs:
                    selectedClubs.length > 0
                        ? selectedClubs
                        : [{ clubId: null, memberNumber: "" }],
                // TODO: validate member number against club records in backend
            });

            router.replace("/login");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Clubs (Optional)</Text>

            <FlatList
                data={MOCK_CLUBS}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const selected = selectedClubs.find(
                        (c) => c.clubId === item.id
                    );

                    return (
                        <View style={styles.clubCard}>
                            <Pressable onPress={() => toggleClub(item.id)}>
                                <Text style={styles.clubName}>
                                    {selected ? "✓ " : ""} {item.clubName}
                                </Text>
                            </Pressable>

                            {selected && (
                                <TextInput
                                    placeholder="Member Number"
                                    value={selected.memberNumber}
                                    onChangeText={(val) =>
                                        updateMemberNumber(item.id, val)
                                    }
                                    style={styles.input}
                                />
                            )}
                        </View>
                    );
                }}
            />

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
    clubCard: {
        backgroundColor: "#fff",
        color: "#000",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        // marginBottom: 16,
        // padding: 12,
        // borderWidth: 1,
        // borderColor: "#fff",
        // borderRadius: 12,
    },
    clubName: { fontSize: 16, fontWeight: "600" },
    input: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: { color: "#fff", fontWeight: "700" },
});
