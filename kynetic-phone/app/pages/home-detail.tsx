import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function HomeDetailScreen() {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Home Data</Text>
        <Text selectable style={styles.json}>
          {JSON.stringify(params, null, 2)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  json: {
    fontFamily: "Courier",
    fontSize: 14,
  },
});
