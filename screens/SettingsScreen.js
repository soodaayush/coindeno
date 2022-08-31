import { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import DropDownPicker from "react-native-dropdown-picker";

import { auth } from "../firebase/config";

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

  const [isLoading, setIsLoading] = useState(true);

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

    SettingsDatabaseService.getInstance()
      .getThemeFromDatabase(auth.currentUser?.uid)
      .then((data) => {
        setIsLoading(false);

        for (let key in data) {
          let theme = data[key].theme;
          setThemeDropdownValue(theme);
          setTheme(theme);
        }
      });
  }, []);

  function redirectToHomePage() {
    navigation.replace("Home");
  }

  function saveSettings() {
    if (themeItem.label === undefined) {
      alert("Please make edits to your settings to save them!");
      return;
    }

    let theme = {
      theme: themeItem.value,
      themeLabel: themeItem.label,
    };

    if (themeItem.label !== undefined) {
      SettingsDatabaseService.getInstance()
        .getThemeFromDatabase(auth.currentUser?.uid)
        .then((data) => {
          if (data === null || data === undefined) {
            SettingsDatabaseService.getInstance().saveThemeToDatabase(
              auth.currentUser?.uid,
              theme
            );
          } else {
            for (let key in data) {
              SettingsDatabaseService.getInstance().editThemeSettings(
                theme,
                auth.currentUser?.uid,
                key
              );
            }
          }
        });
    }

    redirectToHomePage();
  }

  function redirectToAddFiatScreen() {
    navigation.replace("Add Fiat");
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
});

export default SettingsScreen;
