import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LogBox } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import AccountLoginRegisterScreen from "./screens/AccountLoginRegisterScreen";
import AccountLoginScreen from "./screens/AccountLoginScreen";
import AccountRegisterScreen from "./screens/AccountRegisterScreen";
import AddTickerScreen from "./screens/AddTickerScreen";
import AddFiatScreen from "./screens/AddFiatScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
]);

SplashScreen.preventAutoHideAsync();

export default function App() {
  let [fontsLoaded] = useFonts({
    "lato-regular": require("./assets/Lato/Lato-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="AccountLoginRegister"
          component={AccountLoginRegisterScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AccountLogin"
          component={AccountLoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AccountRegister"
          component={AccountRegisterScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Add Ticker"
          component={AddTickerScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Add Fiat"
          component={AddFiatScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Settings"
          component={SettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
