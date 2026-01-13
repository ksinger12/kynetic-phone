import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuBarModal from "@/components/menu/menu-bar-modal";
import { fetchMenuBarData } from "@/api/home-api";
import { MenuBarItem } from "@/api/types/menu";

export default function HomeDetailScreen() {
  const [data, setData] = useState<MenuBarItem[]>([]);

  useEffect(() => {
    fetchMenuBarData("1").then(setData);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MenuBarModal data={data} visible />
    </SafeAreaView>
  );
}
