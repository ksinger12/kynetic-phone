import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RoundLeaderBoard() {
    const { leagueId } = useLocalSearchParams<{ leagueId: string }>();

    return (
        <View style={{ padding: 16 }}>
            <Text>Weekly Leaderboard</Text>
            <Text>League ID: {leagueId}</Text>
        </View>
    );
}
