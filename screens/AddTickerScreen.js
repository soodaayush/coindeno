import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";

import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

import AppButton from "../components/AppButton";
import Loading from "../components/Loading";
import AddTickerItem from "../components/AddTickerItem";

import configData from "../config.json";
import { auth } from "../firebase/config";

import Colors from "../constants/colors";

const AddTickerScreen = () => {
  const [tickersData, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTickers, setSelectedTickers] = useState([]);

  const navigation = useNavigation();

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

    let responseJson = await response.json();
    return responseJson;
  }

  function addTicker() {
    if (selectedTickers.length < 1) {
      alert("Please select one or more tickers!");
      return;
    }

    const promiseArray = [];

    selectedTickers.forEach((ticker) => {
      let tickerObj = {
        name: ticker,
      };

      let p = saveTickerToDatabase(tickerObj);
      promiseArray.push(p);
    });

    Promise.all(promiseArray).then(() => {
      goBackToHomePage();
    });

    // Promise.allSettled = (promises) =>
    //   Promise.all(
    //     promises.map((p) =>
    //       p.then(() => {
    //         goBackToHomePage();
    //       })
    //     )
    //   );
  }

  function addTickerToList(ticker) {
    const exists = selectedTickers.filter((a) => a === ticker);

    if (exists.length > 0) {
      setSelectedTickers((currentTickers) => {
        return currentTickers.filter((t) => t !== ticker);
      });
    } else {
      setSelectedTickers((currentTickers) => {
        return [...currentTickers, ticker];
      });
    }
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.tickersList}>
        <FlatList
          data={tickersData}
          renderItem={(tickerData) => {
            return (
              <AddTickerItem
                name={tickerData.item.name}
                price={tickerData.item.price}
                logo={tickerData.item.image}
                id={tickerData.item.id}
                onAddTickerToList={addTickerToList}
              />
            );
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#377D71"
            text="Add"
            textColor={Colors.text}
            onPress={addTicker}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#EB1D36"
            text="Back"
            textColor={Colors.text}
            onPress={goBackToHomePage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    backgroundColor: Colors.background,
    paddingTop: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  tickersList: {
    flex: 5,
    paddingTop: 10,
    width: "95%",
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    marginRight: 20,
  },
});

export default AddTickerScreen;
