import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Text, View } from "react-native"; // Corrected import

// Screens
import MainPage from "./screens/MainPage";
import Sos from "./screens/Scheme"; // Assuming this is your SOS screen
import Profile from "./screens/Profile";
import Report from "./screens/Report"; // Import the Report screen

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { height: 65, paddingTop: 10 },
        tabBarIcon: ({ color, focused }) => {
          let iconName = "";

          if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Sos") {
            iconName = "help";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Report") {
            iconName = "report";
          }

          return (
            <View
              style={{
                width: focused ? 100 : 50,
                height: focused ? 62 : 50,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
                backgroundColor: focused ? "#4285F4" : "#fff",
                borderRadius: 10, // Optional: add rounded corners
              }}
            >
              <Icon name={iconName} size={28} color={color} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              textAlign: "center",
              fontWeight: focused ? "bold" : "normal",
              color: focused ? "#fff" : "grey",
              backgroundColor: focused ? "#4285F4" : "#fff",
              width: 100,
              paddingTop: 5, // Optional: adds some padding for a better look
            }}
          >
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: "#fff", // active tint color for icon
        tabBarInactiveTintColor: "grey", // inactive tint color for icon
      })}
    >
      <Tab.Screen
        name="Map"
        component={MainPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Sos" component={Sos} options={{ headerShown: false }} />
      <Tab.Screen
        name="Report"
        component={Report} // Add the Report screen
        options={{
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#4285F4" },
          headerTitleStyle: { left: 150, fontSize: 22 }, // Adjusting the title
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default MainContainer;
