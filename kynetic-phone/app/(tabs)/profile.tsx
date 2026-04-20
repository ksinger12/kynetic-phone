import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
// import { useEffect } from "react";
// import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Account</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? "Unknown"}</Text>
      </View>

      <Pressable
        style={[styles.logoutButton, loggingOut && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={styles.logoutText}>
          {loggingOut ? "Logging out..." : "Logout"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 8,
    textTransform: "uppercase",
  },
  value: {
    color: "#111827",
    fontSize: 16,
    marginTop: 4,
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#b91c1c",
    borderRadius: 16,
    marginTop: 24,
    padding: 16,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});


{/* <SafeAreaView edges={["top"]} style={styles.container}>

//       {/* Profile Card */}

//       <View style={styles.profileCard}>

//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>
//             {profile.firstName[0]}
//             {profile.lastName[0]}
//           </Text>
//         </View>

//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>
//             {profile.firstName} {profile.lastName}
//           </Text>

//           <Text style={styles.email}>
//             {profile.email}
//           </Text>
//         </View> */}

//         <Pressable
//           onPress={() => router.push("/profile/edit")}
//         >
//           <Text style={styles.edit}>✎</Text>
//         </Pressable>

//       </View>


//       {/* FUTURE STATS SECTION */}

//       {/*
//       <View style={styles.statsContainer}>

//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>12</Text>
//           <Text style={styles.statLabel}>Leagues</Text>
//         </View>

//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>18</Text>
//           <Text style={styles.statLabel}>Teams</Text>
//         </View>

//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>3</Text>
//           <Text style={styles.statLabel}>Wins</Text>
//         </View>

//         <View style={styles.stat}>
//           <Text style={styles.statNumber}>8</Text>
//           <Text style={styles.statLabel}>Podiums</Text>
//         </View>

//       </View>
//       */}


//       {/* Dashboard Tiles */}

//       <View style={styles.grid}>

//         <ProfileTile
//           title="My Clubs"
//           onPress={() => router.push("/clubs")}
//         />

//         <ProfileTile
//           title="My Teams"
//           onPress={() => router.push("/teams")}
//         />

//         <ProfileTile
//           title="Draft History"
//           onPress={() => router.push("/draft-history")}
//         />

//         <ProfileTile
//           title="Settings"
//           onPress={() => router.push("/settings")}
//         />

//       </View>


//       {/* Logout Button */}

//       <Pressable
//         style={({ pressed }) => [
//           styles.logout,
//           pressed && { opacity: 0.7 }
//         ]}
//         onPress={logout}
//       >
//         <Text style={styles.logoutText}>Logout</Text>
//       </Pressable>

//     </SafeAreaView>
//   );
// }

// function ProfileTile({
//   title,
//   onPress
// }: {
//   title: string
//   onPress: () => void
// }) {

//   return (

//     <Pressable
//       style={({ pressed }) => [
//         styles.tile,
//         pressed && { opacity: 0.85 }
//       ]}
//       onPress={onPress}
//     >

//       <Text style={styles.tileTitle}>
//         {title}
//       </Text>

//       <Text style={styles.chevron}>
//         ›
//       </Text>

//     </Pressable>