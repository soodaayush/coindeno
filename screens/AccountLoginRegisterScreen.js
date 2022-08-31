import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Image } from "react-native";

import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";

import AppButton from "../components/AppButton";

import Colors from "../constants/colors";

import SettingsDatabaseService from "../api/SettingsDatabase";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      SettingsDatabaseService.getInstance()
        .getThemeFromDatabase(auth.currentUser?.uid)
        .then((themeData) => {
          let theme;

          if (themeData === null) {
            theme = "dark";
            setTheme(theme);

            let themeObj = {
              theme: theme,
              themeLabel: "Dark",
            };

            SettingsDatabaseService.getInstance().saveThemeToDatabase(
              auth.currentUser?.uid,
              themeObj
            );
          } else {
            for (let key in themeData) {
              theme = themeData[key].theme;
              setTheme(theme);
            }
          }
        });
    } else {
      setTheme("dark");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        if (user.emailVerified) {
          navigation.replace("Home");
        }
      }
    });

    return unsubscribe;
  }, []);

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
