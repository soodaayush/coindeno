import { StyleSheet, View, Text, Pressable, Image } from "react-native";

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
          <Image style={styles.image} source={{ uri: props.logo }} />
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
    borderColor: "#E8AA42",
    backgroundColor: "#1F4690",
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

export default TickerItem;
