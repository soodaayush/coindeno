import { useState } from "react";
import { StyleSheet, View, FlatList, Button, Text, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";

import "intl";
import "intl/locale-data/jsonp/en";

import TickerItem from "../components/TickerItem";
import TickerInput from "../components/TickerInput";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/core";

const HomeScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [tickerData, setTickerData] = useState([]);

  const navigation = useNavigation();

  function startModal() {
    setModalIsVisible(true);
  }

  function endModal() {
    setModalIsVisible(false);
  }

  function addTicker(enteredTicker) {
    let tickerInfo = getTickerData(enteredTicker);

    tickerInfo.then((results) => {
      if (results.error) {
        alert(results.error);
        return;
      }

      let ticker = {
        id: results.id,
        key: Math.random().toString(),
        name: results.name,
        image: results.image.large,
        price: results.market_data.current_price.cad,
      };

      setTickerData([...tickerData, ticker]);
    });

    endModal();
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

  function deleteTicker(id) {
    Alert.alert("Alert", "Are you sure you want to delete this ticker?", [
      {
        text: "Yes",
        onPress: () => {
          setTickerData((currentTickerData) => {
            return currentTickerData.filter((ticker) => ticker.id !== id);
          });
        },
      },
      {
        text: "No",
      },
    ]);
  }

  function handleSignOut() {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>{auth.currentUser?.email}</Text>
          <Button title="Log Out" color="#E8AA42" onPress={handleSignOut} />
        </View>
        <Button title="Add New Ticker" color="#E8AA42" onPress={startModal} />
        {modalIsVisible && (
          <TickerInput
            visible={modalIsVisible}
            onAddTicker={addTicker}
            onCancel={endModal}
          />
        )}
        <View style={styles.tickersContainer}>
          <FlatList
            data={tickerData}
            renderItem={(itemData) => {
              return (
                <TickerItem
                  name={itemData.item.name}
                  price={itemData.item.price}
                  logo={itemData.item.image}
                  id={itemData.item.id}
                  onDeleteTicker={deleteTicker}
                />
              );
            }}
          />
        </View>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#231955",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  text: {
    color: "#FFE5B4",
  },
  tickersContainer: {
    flex: 5,
    paddingTop: 10,
    color: "#FFE5B4",
    width: "100%",
  },
  tickerListHeader: {
    marginBottom: 10,
    color: "#FFE5B4",
    fontSize: 20,
  },
});
