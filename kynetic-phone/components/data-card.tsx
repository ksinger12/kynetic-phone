import { View, Text, Pressable, StyleSheet } from "react-native";

type DataCardProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
};

export default function DataCard({
  title,
  subtitle,
  onPress,
}: DataCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Android shadow
    elevation: 6,

    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    color: "#666",
  },
});
