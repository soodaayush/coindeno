import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Button,
} from "react-native";
import { auth } from "../firebase/config";
import { StatusBar } from "expo-status-bar";

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
        <Button
          title="login"
          style={styles.button}
          color="#E8AA42"
          onPress={handleLogin}
        >
          <Text>Login</Text>
        </Button>
        <Button
          title="register"
          style={styles.button}
          color="#E8AA42"
          onPress={handleSignUp}
        >
          <Text>Register</Text>
        </Button>
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
    color: "#FFE5B4",
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
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    color: "#FFE5B4",
    marginRight: 20,
  },
});
