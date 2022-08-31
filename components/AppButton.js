import { Text, View, Pressable } from "react-native";

import Colors from "../constants/colors";

const AppButton = (props) => {
  return (
    <View
      style={{
        marginRight: props.margin === "right" ? 10 : 0,
        marginLeft: props.margin === "left" ? 10 : 0,
      }}
    >
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [
                {
                  backgroundColor: props.backgroundColor
                    ? props.backgroundColor
                    : "#fff",
                  flexDirection: props.direction === "row" ? "row" : "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  width: "100%",
                  marginBottom: 20,
                  borderWidth: props.border ? 1 : 0,
                  borderColor: props.border ? Colors.borderLight : "",
                },
                {
                  opacity: 0.75,
                },
              ]
            : {
                backgroundColor: props.backgroundColor
                  ? props.backgroundColor
                  : "#fff",
                flexDirection: props.direction === "row" ? "row" : "column",
                alignItems: "center",
                padding: 10,
                borderRadius: 10,
                width: "100%",
                marginBottom: 20,
                borderWidth: props.border ? 1 : 0,
                borderColor: props.border ? Colors.borderLight : "",
              }
        }
        onPress={props.onPress}
        android_ripple={{ color: "#dddddd" }}
      >
        {props.text && (
          <Text
            style={{
              color: props.textColor,
              textAlign: "center",
              fontFamily: "lato-regular",
              fontSize: 18,
            }}
          >
            {props.text}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default AppButton;
