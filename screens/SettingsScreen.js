import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import DropDownPicker from "react-native-dropdown-picker";

import { openBrowserAsync } from "expo-web-browser";

import { auth } from "../firebase/config";
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import AppButton from "../components/AppButton";
import Loading from "../components/Loading";

import Colors from "../constants/colors";

import SettingsDatabaseService from "../api/SettingsDatabase";

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [currencyDropdownValue, setCurrencyDropdownValue] = useState("");

  const [themeOpen, setThemeOpen] = useState(false);
  const [themeDropdownValue, setThemeDropdownValue] = useState("");
  const [themeItem, setThemeItem] = useState("");
  const [theme, setTheme] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [loginModal, setLoginModal] = useState(false);

  const [themeItems, setThemeItems] = useState([
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
  ]);

  useEffect(() => {
    SettingsDatabaseService.getInstance()
      .getCurrencyFromDatabase(auth.currentUser?.uid)
      .then((data) => {
        for (let key in data) {
          let currency = data[key].currencyLabel;
          setCurrencyDropdownValue(currency);
        }
      });

    getDbTheme();
  }, []);

  async function getDbTheme() {
    const theme = await AsyncStorage.getItem("theme");
    setThemeDropdownValue(theme);
    setTheme(theme);
    setIsLoading(false);
  }

  function redirectToHomePage() {
    navigation.replace("Home");
  }

  async function saveSettings() {
    if (themeItem.label === undefined) {
      alert("Please make edits to your settings to save them!");
      return;
    }

    let theme = {
      theme: themeItem.value,
      themeLabel: themeItem.label,
    };

    if (themeItem.label !== undefined) {
      await AsyncStorage.setItem("theme", theme.theme);
      await AsyncStorage.setItem("themeLabel", theme.themeLabel);
    }

    redirectToHomePage();
  }

  function redirectToAddFiatScreen() {
    navigation.replace("Add Fiat");
  }

  function openAccountDeletionPrompt() {
    Alert.alert(
      "Account Deletion",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            deleteAccountFromDatabase();
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  }

  function openPrivacyPolicy() {
    openBrowserAsync("https://coindeno.netlify.app/privacypolicy");
  }

  function deleteAccountFromDatabase() {
    setLoginModal(true);
  }

  function closeLoginModal() {
    setLoginModal(false);
  }

  async function handleLogin() {
    const credential = EmailAuthProvider.credential(
      auth.currentUser?.email,
      password
    );

    let uid = auth.currentUser?.uid;

    await reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        deleteUser(auth.currentUser)
          .then(() => {
            setLoginModal(false);
            SettingsDatabaseService.getInstance()
              .deleteUserAccount(uid)
              .then(() => {
                navigation.replace("AccountLoginRegister");
              });
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  }

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor:
            theme === "dark" ? Colors.backgroundDark : Colors.backgroundLight,
          paddingTop: 30,
        }}
      >
        <StatusBar style={theme === "light" ? "dark" : "light"} />
        <View style={styles.header}>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor={theme === "dark" ? "#554994" : ""}
              text="Back"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              border={theme === "light" ? true : false}
              onPress={redirectToHomePage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor={theme === "dark" ? "#554994" : ""}
              text="Save"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              border={theme === "light" ? true : false}
              onPress={saveSettings}
            />
          </View>
        </View>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 30,
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor:
          theme === "dark" ? Colors.backgroundDark : Colors.backgroundLight,
      }}
    >
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      {loginModal && (
        <Modal animationType="slide">
          <KeyboardAvoidingView
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              paddingTop: 50,
              paddingHorizontal: 16,
              width: "100%",
              backgroundColor:
                theme === "dark"
                  ? Colors.backgroundDark
                  : Colors.backgroundLight,
            }}
            behavior="padding"
          >
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
                    theme === "dark" ? Colors.inputBackgroundDark : "",
                  fontFamily: "lato-regular",
                  padding: 10,
                  borderRadius: 6,
                  fontSize: 18,
                }}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor={
                  theme === "dark" ? Colors.textDark : "black"
                }
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
                    theme === "dark" ? Colors.inputBackgroundDark : "",
                  fontFamily: "lato-regular",
                  padding: 10,
                  borderRadius: 6,
                  marginTop: 10,
                  fontSize: 18,
                }}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={
                  theme === "dark" ? Colors.textDark : "black"
                }
                secureTextEntry
                keyboardAppearance="dark"
              />
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.buttonModalContainer}>
                <AppButton
                  backgroundColor={theme === "dark" ? "#554994" : ""}
                  textColor={theme === "dark" ? Colors.textDark : "black"}
                  text="Back"
                  margin="right"
                  border={theme === "light" ? true : false}
                  onPress={closeLoginModal}
                />
              </View>
              <View style={styles.buttonModalContainer}>
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
        </Modal>
      )}
      <View style={styles.header}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            text="Back"
            textColor={theme === "dark" ? Colors.textDark : "black"}
            border={theme === "light" ? true : false}
            onPress={redirectToHomePage}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            text="Save"
            textColor={theme === "dark" ? Colors.textDark : "black"}
            border={theme === "light" ? true : false}
            onPress={saveSettings}
          />
        </View>
      </View>
      <View
        style={{
          width: "90%",
          borderRadius: 10,
          padding: 20,
          marginBottom: 10,
          borderWidth: 1,
          borderColor:
            theme === "dark" ? Colors.borderDark : Colors.borderLight,
        }}
      >
        <Text
          style={{
            color: theme === "dark" ? Colors.textDark : Colors.textLight,
            fontSize: 20,
            fontFamily: "lato-regular",
            marginBottom: 20,
          }}
        >
          Preferred Currency:
        </Text>
        <AppButton
          backgroundColor={theme === "dark" ? "#554994" : ""}
          text={currencyDropdownValue}
          textColor={theme === "dark" ? Colors.textDark : "black"}
          theme={theme}
          border={theme === "light" ? true : false}
          onPress={redirectToAddFiatScreen}
        />
      </View>
      <View
        style={{
          width: "90%",
          borderRadius: 10,
          padding: 20,
          marginBottom: 10,
          borderWidth: 1,
          borderColor:
            theme === "dark" ? Colors.borderDark : Colors.borderLight,
        }}
      >
        <Text
          style={{
            color: theme === "dark" ? Colors.textDark : Colors.textLight,
            fontSize: 20,
            fontFamily: "lato-regular",
            marginBottom: 20,
          }}
        >
          Preferred Theme:
        </Text>
        <DropDownPicker
          items={themeItems}
          setItems={setThemeItems}
          open={themeOpen}
          setOpen={setThemeOpen}
          style={{
            borderColor:
              theme === "dark" ? Colors.borderDark : Colors.borderLight,
            paddingLeft: 10,
            paddingBottom: 5,
            paddingTop: 5,
            fontFamily: "lato-regular",
          }}
          setValue={setThemeDropdownValue}
          value={themeDropdownValue}
          onSelectItem={(value) => {
            setThemeItem(value);
          }}
          theme={theme === "dark" ? "DARK" : "LIGHT"}
          dropDownDirection="TOP"
          textStyle={{ fontFamily: "lato-regular", fontSize: 16 }}
          labelStyle={{ fontFamily: "lato-regular", fontSize: 16 }}
        />
      </View>
      <View style={{ marginTop: 20, width: "80%" }}>
        <AppButton
          backgroundColor={theme === "dark" ? "#554994" : ""}
          text="Delete Account"
          textColor={theme === "dark" ? Colors.textDark : "black"}
          theme={theme}
          border={theme === "light" ? true : false}
          onPress={openAccountDeletionPrompt}
        />
      </View>
      <View style={{ marginTop: 20, width: "80%" }}>
        <AppButton
          backgroundColor={theme === "dark" ? "#554994" : ""}
          text="Privacy Policy"
          textColor={theme === "dark" ? Colors.textDark : "black"}
          theme={theme}
          border={theme === "light" ? true : false}
          onPress={openPrivacyPolicy}
        />
      </View>
      <View style={{ marginTop: 20, width: "80%" }}>
        <Text
          style={{
            color: theme === "dark" ? Colors.textDark : Colors.textLight,
            fontSize: 15,
            fontFamily: "lato-regular",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Version 1.1.6
        </Text>
        <Text
          style={{
            color: theme === "dark" ? Colors.textDark : Colors.textLight,
            fontSize: 15,
            fontFamily: "lato-regular",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          &copy; CoinDeno 2022 - Present
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "90%",
  },
  buttonContainer: {
    width: 75,
  },
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
  buttonModalContainer: {
    width: "50%",
  },
});

export default SettingsScreen;
