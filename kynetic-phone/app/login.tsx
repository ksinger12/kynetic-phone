import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "@/api/auth-api";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    // const user = useAuth();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (user) {
    //         router.replace("/(tabs)/home");
    //     }
    // }, [user]);

    const handleLogin = async () => {
        try {
            setLoading(true);

            const response = await loginUser({
                identifier,
                password,
            });

            login(response);
            router.replace("/(tabs)/home");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to</Text>
            <Text style={styles.brand}>Kynetic</Text>

            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Username or Email"
                value={identifier}
                onChangeText={setIdentifier}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
    input: {
        backgroundColor: "#fff",
        color: "#000",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "700" },
    welcome: {
        fontSize: 16,
        opacity: 0.7,
        marginBottom: 4,
        color: "#80d7faff"
    },
    brand: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 24,
        color: "#80d7faff"
    },
});
