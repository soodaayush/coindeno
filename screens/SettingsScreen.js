import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import { Dropdown } from "react-native-element-dropdown";

import { auth } from "../firebase/config";

import AppButton from "../components/AppButton";

import configData from "../config.json";

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [dropdownValue, setDropdownValue] = useState("");

  const data = [
    { label: "CAD", value: "cad" },
    { label: "EUR", value: "eur" },
    { label: "GBP", value: "gbp" },
    { label: "INR", value: "inr" },
    { label: "USD", value: "usd" },
  ];

  function redirectToHomePage() {
    navigation.replace("Home");
  }

  function saveSettings() {
    if (dropdownValue.label === undefined) {
      alert("Please make edits to your settings to save them!");
      return;
    }

    let currency = {
      currency: dropdownValue.label,
    };

    getSettingsFromDatabase().then((data) => {
      if (data === null || data === undefined) {
        saveSettingsToDatabase(currency);
      } else {
        for (let key in data) {
          editSettings(currency, key);
        }
      }
    });

    alert("Settings Saved!");
  }

  async function getSettingsFromDatabase() {
    try {
      let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/settings/currency.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function saveSettingsToDatabase(currency) {
    let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/settings/currency.json`;

    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(currency),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  async function editSettings(currency, id) {
    let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/settings/currency/${id}.json`;

    return await fetch(url, {
      method: "PUT",
      body: JSON.stringify(currency),
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <AppButton
          backgroundColor="#EB1D36"
          text="Back"
          textColor="#FFE5B4"
          onPress={redirectToHomePage}
        />
        <AppButton
          backgroundColor="#377D71"
          text="Save"
          textColor="#FFE5B4"
          onPress={saveSettings}
        />
      </View>
      <Text style={styles.pageHeader}>Settings</Text>
      <View style={styles.setting}>
        <Text style={styles.settingText}>Preferred Currency:</Text>
        <Dropdown
          data={data}
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          value={dropdownValue}
          onChange={(value) => setDropdownValue(value)}
          search
          searchPlaceholder="Search..."
          placeholderStyle={styles.text}
        />
      </View>
      <View style={styles.saveButtonContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#231955",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pageHeader: {
    fontSize: 45,
    color: "#E8AA42",
    marginBottom: 20,
  },
  text: {
    color: "#FFE5B4",
  },
  setting: {
    width: "100%",
    backgroundColor: "#1F4690",
    borderRadius: 10,
    padding: 20,
  },
  settingText: {
    color: "#FFE5B4",
    fontSize: 20,
  },
  dropdown: {
    marginTop: 20,
    borderColor: "#E8AA42",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    paddingTop: 5,
  },
  selectedTextStyle: {
    color: "#FFE5B4",
  },
  saveButtonContainer: {
    marginTop: 20,
  },
});

export default SettingsScreen;
