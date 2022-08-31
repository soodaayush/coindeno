import { StyleSheet, Text, View, Pressable } from "react-native";
import { memo } from "react";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import Colors from "../constants/colors";

import CachedImage from "react-native-expo-cached-image";

const AddTickerItem = (props) => {
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
        style={({ pressed }) =>
          pressed ? [styles.ticker, styles.pressed] : styles.ticker
        }
      >
        <View style={styles.infoView}>
          <BouncyCheckbox
            size={30}
            unfillColor={
              props.theme === "dark" ? Colors.textDark : Colors.borderLight
            }
            fillColor={
              props.theme === "dark" ? Colors.backgroundDark : Colors.borderDark
            }
            style={{ marginLeft: 12 }}
            onPress={props.onAddTickerToList.bind(this, props.id)}
          />
          <CachedImage
            isBackground
            style={styles.image}
            source={{ uri: props.logo }}
          />
          <Text
            style={{
              color:
                props.theme === "dark" ? Colors.textDark : Colors.textLight,
              fontSize: 15,
              padding: 10,
              fontFamily: "lato-regular",
            }}
          >
            {props.name}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  ticker: {
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
  pressed: {
    opacity: 0.75,
  },
});

export default memo(AddTickerItem);
