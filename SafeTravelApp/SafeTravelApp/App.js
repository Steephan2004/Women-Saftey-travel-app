import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import MainContainer from "./navigation/MainContainer";
import NewAccount from "./screens/NewAccount";
import Profile from "./navigation/screens/Profile";
import HarassmentForm from "./navigation/screens/HarassmentForm";
import E_FIR from "./navigation/screens/E_FIR";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        {/* Main Container (Home/Tab Navigation) */}
        <Stack.Screen
          name="MainContainer"
          component={MainContainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HarassmentForm"
          component={HarassmentForm}
          options={{
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#4285F4" },
            headerTitleStyle: { left: 50, fontSize: 22 }, // Adjusting the title
          }}
        />
        <Stack.Screen
          name="E_FIR"
          component={E_FIR}
          options={{
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#4285F4" },
            headerTitleStyle: { left: 100, fontSize: 22 }, // Adjusting the title
          }}
        />

        {/* New Account Screen */}
        <Stack.Screen
          name="NewAccount"
          component={NewAccount}
          options={{
            title: "Create Account",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#4285F4" },
            headerTitleAlign: "center", // Center aligns the title properly
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
