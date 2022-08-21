import { StyleSheet, View, Text, Pressable, Image } from "react-native";

import Colors from "../constants/colors";

import CachedImage from "react-native-expo-cached-image";

function TickerItem(props) {
  return (
    <View style={styles.tickerListItem}>
      <Pressable
        android_ripple={{ color: "#dddddd" }}
        onPress={props.onDeleteTicker.bind(this, props.id)}
        style={({ pressed }) =>
          pressed ? styles.pressedItem : styles.unpressedItem
        }
      >
        <View style={styles.infoView}>
          <CachedImage style={styles.image} source={{ uri: props.logo }} />
          <Text style={styles.tickersText}>{props.name}</Text>
        </View>
        <View style={styles.infoView}>
          <Text style={styles.tickersText}>
            {new Intl.NumberFormat("en", {
              style: "currency",
              currency: props.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(props.price)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tickerListItem: {
    marginTop: 5,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.tickerBackground,
    borderRadius: 10,
  },
  pressedItem: {
    opacity: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unpressedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tickersText: {
    color: Colors.text,
    fontSize: 15,
    padding: 10,
    fontFamily: "poppins-regular",
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

export default TickerItem;
