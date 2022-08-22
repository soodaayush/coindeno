import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, SafeAreaView } from "react-native";

import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

import AppButton from "../components/AppButton";
import Loading from "../components/Loading";
import AddTickerItem from "../components/AddTickerItem";

import { auth } from "../firebase/config";

import Colors from "../constants/colors";

import TickerDataService from "../api/TickerData";
import TickerDatabaseService from "../api/TickerDatabase";

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
    TickerDataService.getInstance()
      .getTop250Tickers()
      .then((tickerData) => {
        setIsLoading(false);

        TickerDatabaseService.getInstance()
          .getTickersFromDatabase(auth.currentUser?.uid)
          .then((data) => {
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

      let p = TickerDatabaseService.getInstance().saveTickerToDatabase(
        auth.currentUser?.uid,
        tickerObj
      );
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor="#EB1D36"
              text="Back"
              textColor={Colors.text}
              onPress={goBackToHomePage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              backgroundColor="#377D71"
              text="Save"
              textColor={Colors.text}
              onPress={addTicker}
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
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#EB1D36"
            text="Back"
            textColor={Colors.text}
            onPress={goBackToHomePage}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            backgroundColor="#377D71"
            text="Save"
            textColor={Colors.text}
            onPress={addTicker}
          />
        </View>
      </View>
      <View style={styles.tickersList}>
        <FlatList
          data={tickersData}
          initialNumToRender={7}
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
  tickersList: {
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

export default AddTickerScreen;
