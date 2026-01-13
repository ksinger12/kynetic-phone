import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuCard from "./menu-card";

const { width } = Dimensions.get("window");

export default function MenuBarModal({ data, visible }: any) {
  const insets = useSafeAreaInsets();

  if (!visible || !data?.length) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View
        pointerEvents="auto"
        style={[styles.container, { marginTop: insets.top + 8 }]}
      >
        <FlatList
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <MenuCard data={item} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 8,
  },
});
