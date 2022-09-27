import { StyleSheet, View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../firebase/config";

import AppButton from "../components/AppButton";
import AddFiatItem from "../components/AddFiatItem";

import SettingsDatabaseService from "../api/SettingsDatabase";

import Colors from "../constants/colors";

const AddFiatScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [fiats, setFiats] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    let fiats = [
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
    ];

    fiats.sort((a, b) => a.label.localeCompare(b.label));

    setFiats(fiats);

    getDbTheme();
  }, []);

  async function getDbTheme() {
    const theme = await AsyncStorage.getItem("theme");
    setTheme(theme);
    setIsLoading(false);
  }

  function goBackToHomePage() {
    navigation.replace("Home");
  }

  function onAddFiatToList(label, value) {
    let currency = {
      currency: value,
      currencyLabel: label,
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

    goBackToHomePage();
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
        }}
      >
        <StatusBar style={theme === "light" ? "dark" : "light"} />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor={theme === "dark" ? "#554994" : ""}
              text="Back"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              border={theme === "light" ? true : false}
              onPress={goBackToHomePage}
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
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor:
          theme === "dark" ? Colors.backgroundDark : Colors.backgroundLight,
      }}
    >
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            text="Back"
            textColor={theme === "dark" ? Colors.textDark : "black"}
            border={theme === "light" ? true : false}
            onPress={goBackToHomePage}
          />
        </View>
      </View>
      <View style={styles.fiatsList}>
        <FlatList
          data={fiats}
          initialNumToRender={7}
          renderItem={(fiatData) => {
            return (
              <AddFiatItem
                name={fiatData.item.label}
                value={fiatData.item.value}
                theme={theme}
                onAddFiatToList={onAddFiatToList}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddFiatScreen;

const styles = StyleSheet.create({
  fiatsList: {
    flex: 5,
    width: "90%",
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  buttonContainer: {
    width: 75,
  },
});
