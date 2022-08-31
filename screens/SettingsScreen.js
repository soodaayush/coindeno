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

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyDropdownValue, setCurrencyDropdownValue] = useState("");
  const [currencyItem, setCurrencyItem] = useState("");

  const [themeOpen, setThemeOpen] = useState(false);
  const [themeDropdownValue, setThemeDropdownValue] = useState("");
  const [themeItem, setThemeItem] = useState("");
  const [theme, setTheme] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [currencyItems, setCurrencyItems] = useState([
    { label: "CAD - Canadian Dollar", value: "cad" },
    { label: "EUR - Euro", value: "eur" },
    { label: "GBP - British Pound Sterling", value: "gbp" },
    { label: "INR - Indian Rupee", value: "inr" },
    { label: "USD - US Dollar", value: "usd" },
    { label: "JPY - Japanese Yen", value: "jpy" },
    { label: "CNY - Chinese Yuan", value: "cny" },
    { label: "RUB - Russian Ruble", value: "rub" },
    { label: "KRW - South Korean Won", value: "krw" },
    { label: "IDR - Indonesian Rupiah", value: "idr" },
    { label: "AED - United Arab Emirates Dirham", value: "aed" },
    { label: "BDT - Bangladeshi Taka", value: "bdt" },
    { label: "BRL - Brazil Real", value: "brl" },
    { label: "CLP - Chilean Peso", value: "clp" },
    { label: "ILS - Israeli New Shekel", value: "ils" },
    { label: "LKR - Sri Lankan Rupee", value: "lkr" },
    { label: "MYR - Malaysian Ringgit", value: "myr" },
    { label: "NZD - New Zealand Dollar", value: "nzd" },
    { label: "PLN - Polish Zloty", value: "pln" },
    { label: "SGD - Singapore Dollar", value: "sgd" },
    { label: "UAH - Ukrainian Hryvnia", value: "uah" },
    { label: "ARS - Argentine Peso", value: "ars" },
    { label: "BHD - Bahraini Dinar", value: "bhd" },
    { label: "CZK - Czech Koruna", value: "zar" },
    { label: "HKD - Hong Kong Dollar", value: "hkd" },
    { label: "MMK - Burmese Kyat", value: "mmk" },
    { label: "NGN - Nigerian Naira", value: "ngn" },
    { label: "PHP - Philippine Peso ", value: "php" },
    { label: "SAR - Saudi Riyal", value: "sar" },
    { label: "THB - Thai Baht", value: "thb" },
    { label: "VEF - Venezuelan Bolivar Fuerte", value: "vef" },
    { label: "AUD - Australian Dollar", value: "aud" },
    { label: "BMD - Bermudian Dollar", value: "bmd" },
    { label: "CHF - Swiss Franc", value: "chf" },
    { label: "DKK - Danish Krone", value: "dkk" },
    { label: "HUF - Hungarian Forint", value: "huf" },
    { label: "KWD - Kuwaiti Dinar", value: "kwd" },
    { label: "MXN - Mexican Peso", value: "mxn" },
    { label: "NOK - Norwegian Krone", value: "nok" },
    { label: "PKR - Pakistani Rupee", value: "pkr" },
    { label: "SEK - Swedish Krona", value: "sek" },
    { label: "VND - Vietnamese Dồng", value: "vnd" },
  ]);

  const [themeItems, setThemeItems] = useState([
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
  ]);

  useEffect(() => {
    SettingsDatabaseService.getInstance()
      .getCurrencyFromDatabase(auth.currentUser?.uid)
      .then((data) => {
        for (let key in data) {
          let currency = data[key].currency;
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
    if (currencyItem.label === undefined && themeItem.label === undefined) {
      alert("Please make edits to your settings to save them!");
      return;
    }

    let currency = {
      currency: currencyItem.value,
      currencyLabel: currencyItem.label,
    };

    let theme = {
      theme: themeItem.value,
      themeLabel: themeItem.label,
    };

    if (currencyItem.label !== undefined) {
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
    }

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

  if (isLoading) {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 50,
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
        <DropDownPicker
          items={currencyItems}
          setItems={setCurrencyItems}
          open={currencyOpen}
          setOpen={setCurrencyOpen}
          style={{
            borderColor:
              theme === "dark" ? Colors.borderDark : Colors.borderLight,
            paddingLeft: 10,
            paddingBottom: 5,
            paddingTop: 5,
            fontFamily: "lato-regular",
          }}
          setValue={setCurrencyDropdownValue}
          value={currencyDropdownValue}
          onSelectItem={(value) => {
            setCurrencyItem(value);
          }}
          searchable
          theme={theme === "dark" ? "DARK" : "LIGHT"}
          dropDownDirection="DEFAULT"
          textStyle={{ fontFamily: "lato-regular", fontSize: 16 }}
          labelStyle={{ fontFamily: "lato-regular", fontSize: 16 }}
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
