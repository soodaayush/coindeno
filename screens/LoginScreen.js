import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";

import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";

import AppButton from "../components/AppButton";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  function handleSignUp() {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message));
  }

  function handleLogin() {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message));
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />
      <Text style={styles.pageHeader}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="#FFE5B4"
          keyboardAppearance="dark"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor="#FFE5B4"
          secureTextEntry
          keyboardAppearance="dark"
        />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          backgroundColor="#0096FF"
          textColor="#72FFFF"
          text="Log In"
          onPress={handleLogin}
        />
        <AppButton
          backgroundColor="#00D7FF"
          textColor="black"
          text="Register"
          onPress={handleSignUp}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#231955",
  },
  pageHeader: {
    fontSize: 45,
    color: "#E8AA42",
    marginBottom: 20,
  },
  inputContainer: {
    width: "90%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8AA42",
    width: "100%",
    padding: 8,
    color: "#FFE5B4",
    backgroundColor: "#1F4690",
    padding: 16,
    borderRadius: 6,
    marginTop: 10,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "column",
    marginTop: 20,
    width: "90%",
  },
});
