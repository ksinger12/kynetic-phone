import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { fetchTeamsByUserId } from "@/api/teams-api";
import { UserTeam } from "@/api/types/userTeam";

function TeamCard({
  team,
  onPress,
}: {
  team: UserTeam;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
      ]}
    >
      <View style={styles.accentBar} />

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.teamName}>{team.teamName}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>

        <Text style={styles.leagueName}>{team.leagueName}</Text>
        <Text style={styles.clubName}>{team.clubName}</Text>

        <View style={styles.metaRow}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportText}>{team.sportName}</Text>
          </View>

          <View style={styles.pointsBox}>
            <Text style={styles.pointsText}>{team.points} pts</Text>
          </View>

          <View style={styles.rankBox}>
            <Text style={styles.rankText}>#{team.rank}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function TeamsScreen() {
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    fetchTeamsByUserId(user.userId).then(setTeams);
  }, [user]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.teamId.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            onPress={() =>
              router.push({
                pathname: "/teams/[teamId]",
                params: { teamId: item.teamId.toString() },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 3,
  },

  accentBar: {
    width: 6,
    backgroundColor: "#059669",
  },

  cardContent: {
    flex: 1,
    padding: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  teamName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  chevron: {
    fontSize: 22,
    color: "#999",
  },

  leagueName: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
    fontWeight: "600",
  },

  clubName: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  sportBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },

  sportText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065F46",
  },

  pointsBox: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },

  pointsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },

  rankBox: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  rankText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
});
