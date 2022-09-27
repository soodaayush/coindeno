import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Image } from "react-native";

import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";

import AppButton from "../components/AppButton";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Colors from "../constants/colors";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [theme, setTheme] = useState("");

  useEffect(() => {
    setTheme("dark");

    fetchTheme();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        if (user.emailVerified) {
          navigation.replace("Home");
        }
      }
    });

    return unsubscribe;
  }, []);

  async function fetchTheme() {
    let theme = await AsyncStorage.getItem("theme");

    if (theme === null) {
      theme = await AsyncStorage.setItem("theme", "dark");
      await AsyncStorage.setItem("themeLabel", "Dark");
    }
  }

  function redirectToLoginPage() {
    navigation.replace("AccountLogin");
  }

  function redirectToRegisterPage() {
    navigation.replace("AccountRegister");
  }

  return (
    <KeyboardAvoidingView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor:
          theme === "dark" ? Colors.backgroundDark : Colors.backgroundLight,
      }}
      behavior="padding"
    >
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      {theme === "dark" && (
        <Image
          source={require("../assets/icon.png")}
          style={{ height: 250, width: 250 }}
        />
      )}
      {theme === "light" && (
        <Image
          source={require("../assets/iconLight.png")}
          style={{ height: 250, width: 250 }}
        />
      )}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            textColor={theme === "dark" ? Colors.textDark : "black"}
            text="Log In"
            border={theme === "light" ? true : false}
            onPress={redirectToLoginPage}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            textColor={theme === "dark" ? Colors.textDark : "black"}
            text="Register"
            border={theme === "light" ? true : false}
            onPress={redirectToRegisterPage}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: {
    width: "90%",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "90%",
  },
  buttonContainer: {
    width: "47%",
    marginRight: 10,
    marginLeft: 10,
  },
});
