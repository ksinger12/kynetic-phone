import { useCallback, useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { fetchMyLeagues } from "@/api/league-api";
import { fetchTeamById } from "../../api/teams-api";
import { League } from "@/api/types/league";
import {
  beginNavigationLock,
  canStartNavigation,
} from "@/utils/navigation-lock";

function LeagueCard({
  league,
  onPress,
}: {
  league: League;
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
          <Text style={styles.leagueName}>{league.leagueName}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>

        <Text style={styles.clubName}>{league.clubName}</Text>

        <Text style={styles.status}>
          Status: {league.leagueStatus} / {league.leagueSubStatus}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportText}>{league.sportName}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function LeaguesScreen() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const navigationLockRef = useRef(false);
  const router = useRouter();
  const { user } = useAuth();

  const loadLeagues = useCallback(() => {
    if (!user) {
      setLeagues([]);
      return;
    }

    fetchMyLeagues().then(setLeagues);
  }, [user]);

  useEffect(() => {
    loadLeagues();
  }, [loadLeagues]);

  useFocusEffect(
    useCallback(() => {
      navigationLockRef.current = false;
      loadLeagues();
    }, [loadLeagues])
  );

  const handleLeaguePress = async (league: League) => {
    if (!user || navigationLockRef.current || !canStartNavigation()) return;

    navigationLockRef.current = true;
    beginNavigationLock();

    try {
      const draftingAllowed =
        (league.leagueStatus === "OPEN" || league.leagueStatus === "ACTIVE") &&
        league.leagueSubStatus === "DRAFTING";

      if (draftingAllowed) {
        const userTeam = await fetchTeamById(league.teamId);

        if (userTeam.players.length == 0) {
          router.navigate(`/teams/${league.teamId}/draft/${league.leagueId}/0`);
          return;
        }
      }

      router.navigate({
        pathname: "/leagues/[leagueId]",
        params: { leagueId: league.leagueId.toString() },
      });
    } catch (error) {
      console.error("Failed to open league", error);
      navigationLockRef.current = false;
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={styles.joinContainer}>
        <Pressable
          onPress={() => {
            if (navigationLockRef.current || !canStartNavigation()) return;
            navigationLockRef.current = true;
            beginNavigationLock();
            router.navigate("/join-league");
          }}
          style={({ pressed }) => [
            styles.joinButton,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={styles.joinText}>＋ Join League</Text>
        </Pressable>
      </View>

      <FlatList
        data={leagues}
        keyExtractor={(item) => item.leagueId.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LeagueCard
            league={item}
            onPress={() => handleLeaguePress(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  joinContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },

  joinButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  joinText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

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
    backgroundColor: "#1E3A8A",
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

  leagueName: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#111",
  },

  chevron: {
    fontSize: 22,
    color: "#999",
  },

  clubName: {
    fontSize: 13.5,
    color: "#555",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  sportBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  sportText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },

  status: {
    fontSize: 10,
    fontWeight: "600",
    color: "#d55e4c",
  }
});
