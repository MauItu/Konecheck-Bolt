import { Tabs } from "expo-router"
import { Scan, List, Search} from "lucide-react-native"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#388E3C",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E0E0E0",
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Login",
          tabBarIcon: ({ size, color }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camara_scann"
        options={{
          title: "Scanner",
          tabBarIcon: ({ size, color }) => <Scan size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manual_entry"
        options={{
          title: "Ingreso Manual",
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
