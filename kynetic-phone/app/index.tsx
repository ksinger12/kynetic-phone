import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";


export default function LandingScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home");
    }
  }, [user]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.brand}>KyNetic</Text>

        <View style={styles.logoPlaceholder}>
          <Text style={{ color: "#999" }}>Logo Here</Text>
        </View>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/signup/step-one")}
      >
        <Text style={styles.secondaryText}>Create Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcome: {
    fontSize: 18,
    opacity: 0.7,
    color: "#80d7faff"
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20,
    color: "#80d7faff"
  },
  logoPlaceholder: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
});
