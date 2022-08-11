import { memo } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import Colors from "../constants/colors";

const AddTickerItem = (props) => {
  return (
    <View style={styles.tickerListItem}>
      <Pressable
        style={({ pressed }) =>
          pressed ? [styles.ticker, styles.pressed] : styles.ticker
        }
      >
        <View style={styles.infoView}>
          <BouncyCheckbox
            size={30}
            unfillColor={Colors.text}
            fillColor={Colors.background}
            style={{ marginLeft: 12 }}
            onPress={props.onAddTickerToList.bind(this, props.id)}
          />
          <Image style={styles.image} source={{ uri: props.logo }} />
          <Text style={styles.tickersText}>{props.name}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tickerListItem: {
    marginTop: 5,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.tickerBackground,
    borderRadius: 10,
  },
  ticker: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tickersText: {
    color: Colors.text,
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
  pressed: {
    opacity: 0.75,
  },
});

export default memo(AddTickerItem);
