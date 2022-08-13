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

import configData from "../config.json";

import Colors from "../constants/colors";

const HomeScreen = () => {
  const [tickerData, setTickerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState("");
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    printData();
  }, []);

  function printData() {
    let tickerArray = [];

    let tickers = getTickersFromDatabase();

    let currency = getCurrencyFromDatabase();

    tickers.then((data) => {
      setIsLoading(false);

      if (data === null) {
        setTickerData([]);
      }

      for (let key in data) {
        let ticker = {
          key: key,
          name: data[key].name,
        };

        tickerArray.push(ticker);
      }

      let tickersArr = [];

      currency.then((currencyData) => {
        let currency;

        if (currencyData === null) {
          currency = "cad";
          setCurrency(currency);

          let currency = {
            currency: currency,
            currencyLabel: "CAD - Canadian Dollar",
          };

          saveCurrencyToDatabase(currency);
        } else {
          for (let key in currencyData) {
            currency = currencyData[key].currency;
            setCurrency(currency);
          }
        }

        for (let i = 0; i < tickerArray.length; i++) {
          let tickerInfo = getTickerData(tickerArray[i].name);

          tickerInfo.then((results) => {
            if (results.error) {
              alert(results.error);
              return;
            }

            let ticker = {
              id: results.id,
              key: tickerArray[i].key,
              name: results.name,
              image: results.image.large,
              price: results.market_data.current_price[currency],
            };

            tickersArr.push(ticker);

            tickersArr.sort((a, b) => a.name.localeCompare(b.name));

            setTickerData(tickersArr);
          });
        }
      });
    });
  }

  async function getTickersFromDatabase() {
    try {
      let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/tickers.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function getCurrencyFromDatabase() {
    try {
      let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/settings/currency.json`;

      let response = await fetch(url);

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function saveCurrencyToDatabase(currency) {
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

  async function getTickerData(enteredText) {
    try {
      let response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${enteredText
          .toString()
          .toLowerCase()}`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTickerFromDatabase(key) {
    let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/tickers/${key}.json`;

    return await fetch(url, {
      method: "DELETE",
    });
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
            deleteTickerFromDatabase(key).then(() => {
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
        navigation.replace("Login");
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
      <View style={styles.container}>
        <StatusBar style="light" />
        <Loading />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor="#1F4690"
              text="Settings"
              textColor={Colors.text}
              onPress={redirectToSettingsPage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor="#EB1D36"
              text="Log Out"
              textColor={Colors.text}
              onPress={handleSignOut}
            />
          </View>
        </View>
        <View style={styles.addTickerContainer}>
          <AppButton
            backgroundColor="#377D71"
            text="Add Ticker"
            textColor="#FFE5B4"
            onPress={redirectToAddTickerPage}
          />
        </View>
        <View style={styles.tickersContainer}>
          <FlatList
            data={tickerData}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            renderItem={(tickerData) => {
              return (
                <TickerItem
                  name={tickerData.item.name}
                  price={tickerData.item.price}
                  logo={tickerData.item.image}
                  id={tickerData.item.key}
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
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    paddingTop: 40,
  },
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
  text: {
    color: Colors.text,
    fontFamily: "poppins-regular",
  },
  addTickerContainer: {
    width: "90%",
  },
  tickersContainer: {
    flex: 5,
    width: "90%",
    
  },
});
