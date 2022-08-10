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

import Colors from "../constants/colors";

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
      <Text style={styles.pageHeader}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor={Colors.text}
          keyboardAppearance="dark"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor={Colors.text}
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
  pageHeader: {
    fontSize: 45,
    color: Colors.textHeader,
    marginBottom: 20,
    fontFamily: "poppins-medium",
  },
  inputContainer: {
    width: "90%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
    padding: 8,
    color: Colors.text,
    backgroundColor: Colors.inputBackground,
    fontFamily: "poppins-regular",
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
