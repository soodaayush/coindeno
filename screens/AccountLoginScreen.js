import { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";

import AppButton from "../components/AppButton";

import SettingsDatabaseService from "../api/SettingsDatabase";

import Colors from "../constants/colors";

const AccountLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    setTheme("dark");

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);

      if (user !== null) {
        if (user.emailVerified) {
          console.log(user);

          console.log(user.emailVerified);
          navigation.replace("Home");
        }
      }
    });

    return unsubscribe;
  }, []);

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        if (!auth.currentUser?.emailVerified) {
          alert("Please verify your email!");
          return;
        } else {
          navigation.replace("Home");
        }

        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message));
  }

  function redirectToAccountLoginRegisterScreen() {
    navigation.replace("AccountLoginRegister");
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
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={{
            borderWidth: 1,
            borderColor:
              theme === "dark" ? Colors.borderDark : Colors.borderLight,
            width: "100%",
            color: theme === "dark" ? Colors.textDark : "black",
            backgroundColor:
              theme === "dark" ? Colors.inputBackgroundDark : "#fff",
            fontFamily: "lato-regular",
            padding: 10,
            borderRadius: 6,
            fontSize: 18,
          }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor={theme === "dark" ? Colors.textDark : "black"}
          keyboardAppearance="dark"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
        <TextInput
          placeholder="Password"
          style={{
            borderWidth: 1,
            borderColor:
              theme === "dark" ? Colors.borderDark : Colors.borderLight,
            width: "100%",
            color: theme === "dark" ? Colors.textDark : "black",
            backgroundColor:
              theme === "dark" ? Colors.inputBackgroundDark : "#fff",
            fontFamily: "lato-regular",
            padding: 10,
            borderRadius: 6,
            marginTop: 10,
            fontSize: 18,
          }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor={theme === "dark" ? Colors.textDark : "black"}
          secureTextEntry
          keyboardAppearance="dark"
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            textColor={theme === "dark" ? Colors.textDark : "black"}
            text="Back"
            margin="right"
            border={theme === "light" ? true : false}
            onPress={redirectToAccountLoginRegisterScreen}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            textColor={theme === "dark" ? Colors.textDark : "black"}
            text="Log In"
            margin="left"
            border={theme === "light" ? true : false}
            onPress={handleLogin}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

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
    width: "50%",
  },
});

export default AccountLoginScreen;
