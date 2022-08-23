import { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
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

  const [open, setOpen] = useState(false);
  const [currencyDropdownValue, setCurrencyDropdownValue] = useState("");
  const [currencyItem, setCurrencyItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [items, setItems] = useState([
    { label: "CAD - Canadian Dollar", value: "cad" },
    { label: "EUR - Euro", value: "eur" },
    { label: "GBP - British Pound Sterling", value: "gbp" },
    { label: "INR - Indian Rupee", value: "inr" },
    { label: "USD - US Dollar", value: "usd" },
    { label: "JPY - Japanese Yen", value: "jpy" },
    { label: "CNY - Chinese Yuan", value: "cny" },
    { label: "RUB - Russian Ruble", value: "rub" },
    { label: "KRW - South Korean Won", value: "krw" },
  ]);

  useEffect(() => {
    SettingsDatabaseService.getInstance()
      .getCurrencyFromDatabase(auth.currentUser?.uid)
      .then((data) => {
        setIsLoading(false);

        for (let key in data) {
          let currency = data[key].currency;
          setCurrencyDropdownValue(currency);
        }
      });
  }, []);

  function redirectToHomePage() {
    navigation.replace("Home");
  }

  function saveSettings() {
    if (currencyItem.label === undefined || currencyItem.label === null) {
      alert("Please make edits to your settings to save them!");
      return;
    }

    let currency = {
      currency: currencyItem.value,
      currencyLabel: currencyItem.label,
    };

    SettingsDatabaseService.getInstance()
      .getCurrencyFromDatabase(auth.currentUser?.uid)
      .then((data) => {
        if (data === null || data === undefined) {
          SettingsDatabaseService.getInstance().saveCurrencyToDatabase(
            auth.currentUser?.uid,
            currency
          );
        } else {
          for (let key in data) {
            SettingsDatabaseService.getInstance().editCurrencySettings(
              currency,
              auth.currentUser?.uid,
              key
            );
          }
        }
      });

    redirectToHomePage();
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor="#EB1D36"
              text="Back"
              textColor={Colors.text}
              onPress={redirectToHomePage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor="#377D71"
              text="Save"
              textColor={Colors.text}
              onPress={saveSettings}
            />
          </View>
        </View>
        <Loading />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#EB1D36"
            text="Back"
            textColor={Colors.text}
            onPress={redirectToHomePage}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#377D71"
            text="Save"
            textColor={Colors.text}
            onPress={saveSettings}
          />
        </View>
      </View>
      <Text style={styles.pageHeader}>Settings</Text>
      <View style={styles.setting}>
        <Text style={styles.settingText}>Preferred Currency:</Text>
        <DropDownPicker
          items={items}
          setItems={setItems}
          open={open}
          setOpen={setOpen}
          style={styles.dropdown}
          setValue={setCurrencyDropdownValue}
          value={currencyDropdownValue}
          onSelectItem={(value) => {
            setCurrencyItem(value);
          }}
          theme="DARK"
          textStyle={{ fontFamily: "poppins-regular" }}
          labelStyle={{ fontFamily: "poppins-regular" }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
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
  pageHeader: {
    fontSize: 45,
    color: Colors.textHeader,
    fontFamily: "poppins-medium",
  },
  text: {
    color: Colors.text,
    fontFamily: "poppins-regular",
  },
  setting: {
    width: "90%",
    backgroundColor: Colors.settingBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  settingText: {
    color: Colors.text,
    fontSize: 20,
    fontFamily: "poppins-regular",
    marginBottom: 20,
  },
  dropdown: {
    borderColor: Colors.border,
    paddingLeft: 10,
    paddingBottom: 5,
    paddingTop: 5,
    fontFamily: "poppins-regular",
  },
});

export default SettingsScreen;
