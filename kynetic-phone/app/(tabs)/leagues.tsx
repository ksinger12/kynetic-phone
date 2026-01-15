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
    <Pressable onPress={onPress} style={styles.card}>
      <View>
        <Text style={styles.leagueName}>{league.leagueName}</Text>
        <Text style={styles.subText}>{league.clubName}</Text>
        <Text style={styles.sportText}>{league.sportName}</Text>
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  leagueName: {
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  sportText: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 6,
  },
  joinButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});
