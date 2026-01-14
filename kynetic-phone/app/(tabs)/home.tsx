import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import MenuBarModal from "@/components/menu/menu-bar-modal";
import { fetchMenuBarData } from "@/api/home-api";
import { MenuBarItem } from "@/api/types/menu";

export default function HomeScreen() {
  const [menuData, setMenuData] = useState<MenuBarItem[]>([]);

  useEffect(() => {
    fetchMenuBarData("1").then(setMenuData);
  }, []);

  return (
    <SafeAreaView edges={["top"]} style= {{ flex: 1 }}>
      <MenuBarModal data={menuData} visible />
    </SafeAreaView>
  );
}
