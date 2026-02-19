import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import MenuBarModal from "@/components/menu/menu-bar-modal";
import { fetchMenuBarData } from "@/api/home-api";
import { MenuBarItem } from "@/api/types/menu";
import { useAuth } from "@/context/AuthContext";


export default function HomeScreen() {
  const [menuData, setMenuData] = useState<MenuBarItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchMenuBarData(user.userId).then(setMenuData);
  }, [user]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <MenuBarModal data={menuData} visible />
    </SafeAreaView>
  );
}
