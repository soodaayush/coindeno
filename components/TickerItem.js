import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { memo } from "react";

import Colors from "../constants/colors";

function TickerItem(props) {
  return (
    <View
      style={{
        marginTop: 5,
        marginBottom: 1,
        borderWidth: 1,
        borderColor:
          props.theme === "dark" ? Colors.borderDark : Colors.borderLight,
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
          <Image style={styles.image} source={{ uri: props.logo }} />
          <Text
            style={{
              color: props.theme === "dark" ? Colors.textDark : "black",
              fontSize: 16,
              padding: 10,
              fontFamily: "lato-regular",
            }}
          >
            {props.name}
          </Text>
        </View>
        <View style={styles.infoView}>
          <Text
            style={{
              color: props.theme === "dark" ? Colors.textDark : "black",
              fontSize: 16,
              padding: 10,
              fontFamily: "lato-regular",
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

export default memo(TickerItem);
