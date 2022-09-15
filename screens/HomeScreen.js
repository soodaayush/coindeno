import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert,
  RefreshControl,
  SafeAreaView,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import "intl";
import "intl/locale-data/jsonp/en";

import TickerItem from "../components/TickerItem";
import AppButton from "../components/AppButton";
import Loading from "../components/Loading";

import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/core";

import TickerDataService from "../api/TickerData";
import TickerDatabaseService from "../api/TickerDatabase";
import SettingsDatabaseService from "../api/SettingsDatabase";

import Colors from "../constants/colors";

const HomeScreen = () => {
  const [tickerData, setTickerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState("");
  const [theme, setTheme] = useState("");
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    printData();
  }, []);

  function printData() {
    let tickerList = [];

    getDbTickers().then((dbTickerData) => {
      setIsLoading(false);

      getDbCurrency().then((dbCurrencyData) => {
        getDbTheme();

        TickerDataService.getInstance()
          .getTop250Tickers(dbCurrencyData)
          .then((results) => {
            if (results.error) {
              alert(results.error);
              return;
            }

            results.sort((a, b) => a.name.localeCompare(b.name));

            dbTickerData.forEach((element) => {
              tickerList.push(element.name);
            });

            results = results.filter((td) => tickerList.includes(td.id));

            let finalTicker = [];

            results.forEach((element) => {
              let key;

              dbTickerData.forEach((e) => {
                if (e.name === element.id) {
                  key = e.key;
                }
              });

              let ticker = {
                id: element.id,
                key: key,
                name: element.name,
                image: element.image,
                price: element.current_price,
              };

              finalTicker.push(ticker);
            });

            setTickerData(finalTicker);
          });
      });
    });
  }

  // function getKeyFromName(dbTickers, name) {
  //   dbTickers.forEach((element) => {
  //     if (element.name === name) {
  //       console.log(element.name);
  //       return "hhhh";
  //     }
  //   });
  // }

  async function getDbTheme() {
    await SettingsDatabaseService.getInstance()
      .getThemeFromDatabase(auth.currentUser?.uid)
      .then((themeData) => {
        let theme;

        if (themeData === null) {
          theme = "dark";
          setTheme(theme);

          let themeObj = {
            theme: theme,
            themeLabel: "Dark",
          };

          SettingsDatabaseService.getInstance().saveThemeToDatabase(
            auth.currentUser?.uid,
            themeObj
          );
        } else {
          for (let key in themeData) {
            theme = themeData[key].theme;
            setTheme(theme);
          }
        }
      });
  }

  async function getDbTickers() {
    const tickers = await TickerDatabaseService.getInstance()
      .getTickersFromDatabase(auth.currentUser?.uid)
      .then((data) => {
        let dbTickers = [];

        for (let key in data) {
          let ticker = {
            name: data[key].name,
            key: key,
          };

          dbTickers.push(ticker);
        }

        return dbTickers;
      });

    return tickers;
  }

  async function getDbCurrency() {
    let currencyFromDb = await SettingsDatabaseService.getInstance()
      .getCurrencyFromDatabase(auth.currentUser.uid)
      .then((currencyData) => {
        let dbCurrency;

        if (currencyData === null) {
          dbCurrency = "usd";
          setCurrency(dbCurrency);

          let currencyObj = {
            currency: dbCurrency,
            currencyLabel: "USD - US Dollar",
          };

          SettingsDatabaseService.getInstance().saveCurrencyToDatabase(
            auth.currentUser?.uid,
            currencyObj
          );
        } else {
          for (let key in currencyData) {
            dbCurrency = currencyData[key].currency;
            setCurrency(dbCurrency);
          }
        }

        return dbCurrency;
      });

    return currencyFromDb;
  }

  function deleteTicker(key) {
    Alert.alert(
      "Ticker Deletion",
      "Are you sure you want to delete this ticker?",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            TickerDatabaseService.getInstance()
              .deleteTickerFromDatabase(auth.currentUser?.uid, key)
              .then(() => {
                printData();
              });
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  }

  function handleSignOut() {
    auth
      .signOut()
      .then(() => {
        navigation.replace("AccountLoginRegister");
      })
      .catch((error) => alert(error.message));
  }

  function redirectToAddTickerPage() {
    navigation.replace("Add Ticker");
  }

  function redirectToSettingsPage() {
    navigation.replace("Settings");
  }

  const onRefresh = useCallback(() => {
    setRefresh(true);
    printData();
    setRefresh(false);
  }, [refresh]);

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
              text="Settings"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              theme={theme}
              border={theme === "light" ? true : false}
              onPress={redirectToSettingsPage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor={theme === "dark" ? "#554994" : ""}
              text="Log Out"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              theme={theme}
              border={theme === "light" ? true : false}
              onPress={handleSignOut}
            />
          </View>
        </View>
        <View style={styles.addTickerContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            text="Add Ticker"
            textColor={theme === "dark" ? Colors.textDark : "black"}
            theme={theme}
            border={theme === "light" ? true : false}
            onPress={redirectToAddTickerPage}
          />
        </View>
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
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
        <View style={styles.header}>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor={theme === "dark" ? "#554994" : ""}
              text="Settings"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              theme={theme}
              border={theme === "light" ? true : false}
              onPress={redirectToSettingsPage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor={theme === "dark" ? "#554994" : ""}
              text="Log Out"
              textColor={theme === "dark" ? Colors.textDark : "black"}
              theme={theme}
              border={theme === "light" ? true : false}
              onPress={handleSignOut}
            />
          </View>
        </View>
        <View style={styles.addTickerContainer}>
          <AppButton
            backgroundColor={theme === "dark" ? "#554994" : ""}
            text="Add Ticker"
            textColor={theme === "dark" ? Colors.textDark : "black"}
            theme={theme}
            border={theme === "light" ? true : false}
            onPress={redirectToAddTickerPage}
          />
        </View>
        <View style={styles.tickersContainer}>
          <FlatList
            data={tickerData}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            initialNumToRender={7}
            renderItem={(tickerData) => {
              return (
                <TickerItem
                  name={tickerData.item.name}
                  logo={tickerData.item.image}
                  price={tickerData.item.price}
                  id={tickerData.item.key}
                  theme={theme}
                  currency={currency}
                  onDeleteTicker={deleteTicker}
                />
              );
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
  },
  buttonContainer: {
    width: 100,
  },
  addTickerContainer: {
    width: "90%",
  },
  tickersContainer: {
    flex: 5,
    width: "90%",
  },
});
