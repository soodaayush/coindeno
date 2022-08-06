import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import { Dropdown } from "react-native-element-dropdown";

import { auth } from "../firebase/config";

import AppButton from "../components/AppButton";
import Loading from "../components/Loading";

import configData from "../config.json";

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [currencyDropdownValue, setCurrencyDropdownValue] = useState("");
  const [currencyLabel, setCurrencyLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const currencyData = [
    { label: "CAD - Canadian Dollar", value: "cad" },
    { label: "EUR - Euro", value: "eur" },
    { label: "GBP - British Pound Sterling", value: "gbp" },
    { label: "INR - Indian Rupee", value: "inr" },
    { label: "USD - US Dollar", value: "usd" },
    { label: "JPY - Japanese Yen", value: "jpy" },
    { label: "CNY - Chinese Yuan", value: "cny" },
    { label: "RUB - Russian Ruble", value: "rub" },
    { label: "KRW - South Korean Won", value: "krw" },
  ];

  useEffect(() => {
    getCurrencySettingsFromDatabase().then((data) => {
      setIsLoading(false);

      for (let key in data) {
        let currency = data[key].currencyLabel;
        setCurrencyLabel(currency);
      }
    });
  }, []);

  function redirectToHomePage() {
    navigation.replace("Home");
  }

  function saveSettings() {
    if (currencyDropdownValue.label === undefined) {
      alert("Please make edits to your settings to save them!");
      return;
    }

    let currency = {
      currency: currencyDropdownValue.value,
      currencyLabel: currencyDropdownValue.label,
    };

    getCurrencySettingsFromDatabase().then((data) => {
      if (data === null || data === undefined) {
        saveCurrencySettingsToDatabase(currency);
      } else {
        for (let key in data) {
          editCurrencySettings(currency, key);
        }
      }
    });

    alert("Settings Saved!");
  }

  async function getCurrencySettingsFromDatabase() {
    try {
      let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/settings/currency.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function saveCurrencySettingsToDatabase(currency) {
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

  async function editCurrencySettings(currency, id) {
    let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/settings/currency/${id}.json`;

    return await fetch(url, {
      method: "PUT",
      body: JSON.stringify(currency),
    });
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Loading />
      </View>
    );
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
          data={currencyData}
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          labelField="label"
          valueField="value"
          placeholder={currencyLabel}
          value={currencyDropdownValue}
          onChange={(value) => setCurrencyDropdownValue(value)}
          placeholderStyle={styles.text}
        />
      </View>
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
    marginBottom: 20,
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
});

export default SettingsScreen;
