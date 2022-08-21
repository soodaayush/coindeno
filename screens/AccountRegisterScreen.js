import { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";

import configData from "../config.json";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import AppButton from "../components/AppButton";

import Colors from "../constants/colors";

const AccountRegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user !== null) {
        if (user.emailVerified) {
          navigation.replace("Home");
        }
      }
    });

    return unsubscribe;
  }, []);

  async function handleSignUp() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        let user = auth.currentUser;

        const actionCodeSettings = {
          url: `${configData.BASE_URL}/sign-in/?email=${user.email}`,
        };

        sendEmailVerification(auth.currentUser, actionCodeSettings).then(() => {
          Alert.alert(
            "Alert",
            "A verification link has been sent to your email. If you don't see the verification email in a few minutes, please check your spam or junk folder.",
            [
              {
                text: "Ok",
                onPress: () => {
                  navigation.replace("AccountLoginRegister");
                },
              },
            ]
          );
        });
      })
      .catch((error) => alert(error.message));
  }

  function redirectToAccountLoginRegisterScreen() {
    navigation.replace("AccountLoginRegister");
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />
      <Image
        source={require("../assets/icon.png")}
        style={{ height: 150, width: 150 }}
      />
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
          autoFocus
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
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#00D7FF"
            textColor="black"
            text="Back"
            onPress={redirectToAccountLoginRegisterScreen}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#0096FF"
            textColor="#231955"
            text="Register"
            onPress={handleSignUp}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    width: "90%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
    color: Colors.text,
    backgroundColor: Colors.inputBackground,
    fontFamily: "poppins-regular",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    fontSize: 18,
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

export default AccountRegisterScreen;
