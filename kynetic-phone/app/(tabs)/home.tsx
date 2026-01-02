import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import DataCard from "../../components/data-card";
import { fetchHomeSummary } from "../../api/home-api";

export default function HomeScreen() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchHomeSummary().then(setData);
  }, []);

  if (!data) return null;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <DataCard
          title={`Welcome, ${data.user.name}`}
          subtitle={`${data.leagues} leagues · ${data.teams} teams`}
          onPress={() =>
            router.push({
              pathname: "./pages/home-detail",
              params: data,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}
