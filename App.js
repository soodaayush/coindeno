import { useState } from "react";
import { StyleSheet, View, FlatList, Button } from "react-native";
import { StatusBar } from "expo-status-bar";

import "intl";
import "intl/locale-data/jsonp/en";

import TickerItem from "./components/TickerItem";
import TickerInput from "./components/TickerInput";

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [tickerData, setTickerData] = useState([]);

  function startModal() {
    setModalIsVisible(true);
  }

  function endModal() {
    setModalIsVisible(false);
  }

  function addTicker(enteredTicker) {
    let tickerInfo = getTickerData(enteredTicker);

    tickerInfo.then((results) => {
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
    setTickerData((currentTickerData) => {
      return currentTickerData.filter((ticker) => ticker.id !== id);
    });
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.appContainer}>
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
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#231955",
  },
  tickersContainer: {
    flex: 5,
    paddingTop: 10,
    color: "#FFE5B4",
  },
  tickerListHeader: {
    marginBottom: 10,
    color: "#FFE5B4",
    fontSize: 20,
  },
});
