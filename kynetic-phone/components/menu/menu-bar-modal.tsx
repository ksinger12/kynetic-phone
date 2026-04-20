import { View, FlatList, StyleSheet } from "react-native";
import MenuCard from "./menu-card";

export default function MenuBarModal({ data, visible }: any) {
  if (!visible || !data?.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <MenuCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 8,
  },
});
