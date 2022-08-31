import { StyleSheet, Text, View, Pressable } from "react-native";
import { memo } from "react";

import Colors from "../constants/colors";

const AddFiatItem = (props) => {
  return (
    <View
      style={{
        marginTop: 5,
        marginBottom: 1,
        borderWidth: 1,
        padding: 10,
        borderColor:
          props.theme === "dark" ? Colors.borderDark : Colors.borderLight,
        borderRadius: 10,
      }}
    >
      <Pressable
        style={({ pressed }) =>
          pressed ? [styles.fiat, styles.pressed] : styles.fiat
        }
        onPress={props.onAddFiatToList.bind(this, props.name, props.value)}
      >
        <View style={styles.infoView}>
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
  fiat: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default memo(AddFiatItem);
