import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { validateUsername } from "@/utils/validation";

export default function SignupStepOne() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleNext = () => {
        const usernameError = validateUsername(username);
        if (usernameError) return alert(usernameError);

        if (password !== confirmPassword)
            return alert("Passwords do not match.");

        router.push({
            pathname: "/signup/step-two",
            params: {
                firstName,
                lastName,
                username,
                email,
                password,
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
            <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Email (optional)" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
            <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />

            <Pressable style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "700" },
});
