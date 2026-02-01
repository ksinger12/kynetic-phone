import { useEffect, useLayoutEffect, useState } from "react";
import { View, FlatList, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";

import { fetchLeaguesByUserId } from "@/api/league-api";
import { League } from "@/api/types/league";

function LeagueCard({
  league,
  onPress,
}: {
  league: League;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
    ]}>

      {/* Accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.leagueName}>{league.leagueName}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>

        <Text style={styles.clubName}>{league.clubName}</Text>

        <View style={styles.metaRow}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportText}>{league.sportName}</Text>
          </View>

          {/* future: members */}
          {/* <Text style={styles.metaText}>83 members</Text> */}
        </View>
      </View>
    </Pressable>
  );
}


export default function LeaguesScreen() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    fetchLeaguesByUserId("1").then(setLeagues);
  }, []);

  // Header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            // stub for now
            console.log("Join league");
          }}
          style={{ marginRight: 12 }}
        >
          <Text style={styles.joinButton}>＋ Join League</Text>
        </Pressable>
      ),
      title: "Leagues",
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <FlatList
        data={leagues}
        keyExtractor={(item) => item.leagueId.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LeagueCard
            league={item}
            onPress={() =>
              router.push({
                pathname: "/leagues/[leagueId]",
                params: { leagueId: item.leagueId.toString() },
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

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 3,
  },

  accentBar: {
    width: 6,
    backgroundColor: "#1E3A8A", // sports navy
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
    marginLeft: 8,
  },

  clubName: {
    fontSize: 13.5,
    color: "#555",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
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

  joinButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },
});
