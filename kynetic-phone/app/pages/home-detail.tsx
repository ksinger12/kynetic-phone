import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuBarModal from "@/components/menu/menu-bar-modal";
import { fetchMenuBarData } from "@/api/home-api";
import { MenuBarItem } from "@/api/types/menu";
import { useAuth } from "@/context/AuthContext";

export default function HomeDetailScreen() {
  const [data, setData] = useState<MenuBarItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchMenuBarData(user.userId).then(setData);
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MenuBarModal data={data} visible />
    </SafeAreaView>
  );
}
