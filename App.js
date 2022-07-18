import { useState } from "react";
import "intl";
import "intl/locale-data/jsonp/en";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";

export default function App() {
  const [enteredTicker, setEnteredTicker] = useState("");
  const [tickerData, setTickerData] = useState([]);

  let coinData = [];

  function tickerInputHandler(enteredText) {
    setEnteredTicker(enteredText);
  }

  function addTicker() {
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

      coinData.push(ticker);
    });

    // setTickerData(coinData);
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

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Coin Ticker"
          onChangeText={tickerInputHandler}
        />
        <Button title="Add Ticker" onPress={addTicker} />
      </View>
      <View style={styles.tickersContainer}>
        <FlatList
          data={tickerData}
          renderItem={(itemData) => {
            <View style={styles.tickerListItem}>
              <Text style={styles.tickersText}>{itemData.item.name}</Text>
              <Text style={styles.tickersText}>
                {new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "cad",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(itemData.item.price)}
              </Text>
            </View>;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#231955",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E8AA42",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8AA42",
    width: "70%",
    marginRight: 8,
    padding: 8,
    color: "#FFE5B4",
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
  tickerListItem: {
    marginTop: 5,
    marginBottom: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E8AA42",
    padding: 10,
    backgroundColor: "#1F4690",
    borderRadius: 10,
  },
  tickersText: {
    color: "#FFE5B4",
    fontSize: 15,
  },
});
