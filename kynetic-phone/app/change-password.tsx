import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { changePassword } from "@/api/auth-api";
import { ApiError } from "@/api/http-client";
import { useAuth } from "@/context/AuthContext";

function validateNewPassword(password: string): string | null {
  if (password.length < 12) {
    return "New password must be at least 12 characters.";
  }

  if (!/\d/.test(password)) {
    return "New password must include at least 1 digit.";
  }

  return null;
}

function getApiErrorMessage(error: ApiError): string {
  if (error.body?.message) {
    return error.body.message;
  }

  const validationEntry = error.body?.errors
    ? Object.values(error.body.errors).flat()[0]
    : null;

  return validationEntry ?? error.message;
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { authStatus, refreshSession, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }

    const passwordValidationError = validateNewPassword(newPassword);
    if (passwordValidationError) {
      setErrorMessage(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation must match.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      await changePassword({
        currentPassword,
        newPassword,
      });

      await refreshSession();
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        if (error.status === 400 || error.status === 403) {
          setErrorMessage(getApiErrorMessage(error));
        } else if (error.status === 401) {
          setErrorMessage("Your session expired. Please log in again.");
        } else {
          setErrorMessage("Unable to change password right now. Please try again.");
        }
        return;
      }

      setErrorMessage("Unable to change password right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  if (authStatus !== "must_change_password") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>
        Your password must be changed before you can use the app.
      </Text>
      <Text style={styles.policy}>
        Use at least 12 characters and include at least 1 digit.
      </Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={(value) => {
          setCurrentPassword(value);
          if (errorMessage) {
            setErrorMessage(null);
          }
        }}
        style={styles.input}
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={(value) => {
          setNewPassword(value);
          if (errorMessage) {
            setErrorMessage(null);
          }
        }}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(value) => {
          setConfirmPassword(value);
          if (errorMessage) {
            setErrorMessage(null);
          }
        }}
        style={styles.input}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Pressable
        style={[styles.primaryButton, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting || loggingOut}
      >
        <Text style={styles.primaryButtonText}>
          {submitting ? "Updating..." : "Update Password"}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, loggingOut && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={submitting || loggingOut}
      >
        <Text style={styles.secondaryButtonText}>
          {loggingOut ? "Logging out..." : "Logout"}
        </Text>
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
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#374151",
    fontSize: 15,
    marginBottom: 8,
  },
  policy: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  errorText: {
    color: "#b91c1c",
    marginBottom: 16,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    marginTop: 16,
    padding: 12,
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
