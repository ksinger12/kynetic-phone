import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "@/api/auth-api";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/api/http-client";

export default function LoginScreen() {
    const router = useRouter();
    const { login, authStatus, isBootstrapping } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email.trim()) {
            setErrorMessage("Email is required.");
            return;
        }

        if (!password) {
            setErrorMessage("Password is required.");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage(null);

            const response = await loginUser({
                email: email.trim(),
                password,
            });

            login(response);
            router.replace(
                response.mustChangePassword ? "/change-password" : "/(tabs)/home"
            );
        } catch (error) {
            console.error(error);

            if (error instanceof ApiError) {
                if (error.status === 401) {
                    setErrorMessage(
                        error.message === "Authentication is required."
                            ? "Email or password is incorrect."
                            : error.message
                    );
                } else if (error.status === 403) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Unable to log in right now. Please try again.");
                }
                return;
            }

            setErrorMessage("Unable to log in right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isBootstrapping || authStatus === "authenticated" || authStatus === "must_change_password") {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to</Text>
            <Text style={styles.brand}>Kynetic</Text>

            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(value) => {
                    setEmail(value);
                    if (errorMessage) {
                        setErrorMessage(null);
                    }
                }}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(value) => {
                    setPassword(value);
                    if (errorMessage) {
                        setErrorMessage(null);
                    }
                }}
                style={styles.input}
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center" },
    centered: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
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
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: { color: "#fff", fontWeight: "700" },
    errorText: {
        color: "#b91c1c",
        marginBottom: 16,
    },
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
