import { useNavigation } from "@react-navigation/core";
import { useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Image } from "react-native";

import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";

import AppButton from "../components/AppButton";

import Colors from "../constants/colors";

const LoginScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user.emailVerified) {
        navigation.replace("Home");
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
        backgroundColor: Colors.background,
      }}
      behavior="padding"
    >
      <StatusBar style="light" />
      <Image
        source={require("../assets/icon.png")}
        style={{ height: 250, width: 250 }}
      />

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#0096FF"
            textColor="#231955"
            text="Log In"
            onPress={redirectToLoginPage}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#00D7FF"
            textColor="black"
            text="Register"
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
