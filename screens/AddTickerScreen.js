import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Image,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

import BouncyCheckbox from "react-native-bouncy-checkbox";

import AppButton from "../components/AppButton";
import Loading from "../components/Loading";

import configData from "../config.json";
import { auth } from "../firebase/config";

const AddTickerScreen = () => {
  const [tickersData, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  let tickerList = [];
  let tickerArray = [];
  let tickerDataList = [];

  useEffect(() => {
    printData();
  }, []);

  function printData() {
    getTickers().then((tickerData) => {
      setIsLoading(false);

      let tickers = getTickersFromDatabase();

      tickers.then((data) => {
        for (let key in data) {
          let ticker = data[key].name;

          tickerArray.push(ticker);
        }

        tickerData.forEach((element) => {
          tickerDataList.push(element);
        });

        tickerDataList = tickerDataList.filter(
          (td) => !tickerArray.includes(td.id)
        );
        tickerDataList.sort((a, b) => a.name.localeCompare(b.name));

        setTickers(tickerDataList);
      });
    });
  }

  async function getTickers() {
    try {
      let response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_desc&per_page=250&page=1&sparkline=false`
      );

      let responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  async function saveTickerToDatabase(ticker) {
    let url = `${configData.BASE_URL}/${auth.currentUser?.uid}/tickers.json`;

    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(ticker),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  function addTicker() {
    if (tickerList.length < 1) {
      alert("Please select one or more tickers!");
      return;
    }

    tickerList.forEach((ticker) => {
      let tickerObj = {
        name: ticker,
      };

      saveTickerToDatabase(tickerObj);
    });

    goBackToHomePage();
  }

  function addTickerToList(ticker) {
    for (let i = 0; i < tickerList.length; i++) {
      if (tickerList[i] === ticker) {
        let index = tickerList.indexOf(ticker);
        tickerList.splice(index, 1);
        return;
      }
    }

    tickerList.push(ticker);
  }

  function goBackToHomePage() {
    navigation.replace("Home");
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
      <View style={styles.tickersList}>
        <FlatList
          data={tickersData}
          renderItem={(tickerData) => {
            return (
              <View style={styles.tickerListItem}>
                <Pressable style={styles.ticker}>
                  <View style={styles.infoView}>
                    <BouncyCheckbox
                      size={15}
                      unfillColor="#FFFFFF"
                      fillColor="#231955"
                      style={{ marginLeft: 12 }}
                      onPress={() => addTickerToList(tickerData.item.id)}
                    />
                    <Image
                      style={styles.image}
                      source={{ uri: tickerData.item.image }}
                    />
                    <Text style={styles.tickersText}>
                      {tickerData.item.name}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#377D71"
            text="Add"
            textColor="#FFE5B4"
            onPress={addTicker}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#EB1D36"
            text="Back"
            textColor="#FFE5B4"
            onPress={goBackToHomePage}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    backgroundColor: "#231955",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8AA42",
    width: "75%",
    padding: 8,
    color: "#FFE5B4",
    backgroundColor: "#1F4690",
    padding: 16,
    borderRadius: 6,
    marginTop: 10,
  },
  tickersList: {
    flex: 5,
    paddingTop: 10,
    width: "100%",
  },
  buttonsContainer: {
    marginBottom: 16,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
  },
  buttonContainer: {
    marginRight: 20,
  },
  tickerListItem: {
    marginTop: 5,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: "#E8AA42",
    backgroundColor: "#1F4690",
    borderRadius: 10,
  },
  ticker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tickersText: {
    color: "#FFE5B4",
    fontSize: 15,
    padding: 10,
  },
  infoView: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    margin: 10,
  },
});

export default AddTickerScreen;
