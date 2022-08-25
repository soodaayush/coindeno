import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { useEffect } from "react";

import Colors from "../constants/colors";

import CachedImage from "react-native-expo-cached-image";

function TickerItem(props) {
  return (
    <View
      style={{
        marginTop: 5,
        marginBottom: 1,
        borderWidth: 1,
        borderColor:
          props.theme === "dark" ? Colors.borderDark : Colors.borderLight,
        backgroundColor:
          props.theme === "dark" ? Colors.tickerBackgroundDark : "",
        borderRadius: 10,
      }}
    >
      <Pressable
        android_ripple={{ color: "#dddddd" }}
        onPress={props.onDeleteTicker.bind(this, props.id)}
        style={({ pressed }) =>
          pressed ? styles.pressedItem : styles.unpressedItem
        }
      >
        <View style={styles.infoView}>
          <CachedImage style={styles.image} source={{ uri: props.logo }} />
          <Text
            style={{
              color: props.theme === "dark" ? Colors.textDark : "black",
              fontSize: 15,
              padding: 10,
              fontFamily: "poppins-regular",
            }}
          >
            {props.name}
          </Text>
        </View>
        <View style={styles.infoView}>
          <Text
            style={{
              color: props.theme === "dark" ? Colors.textDark : "black",
              fontSize: 15,
              padding: 10,
              fontFamily: "poppins-regular",
            }}
          >
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
  pressedItem: {
    opacity: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unpressedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
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
