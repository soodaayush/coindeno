import { Text, View, Pressable, Image } from "react-native";

import Colors from "../constants/colors";

const AppButton = (props) => {
  return (
    <View>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [
                {
                  backgroundColor: props.backgroundColor,
                  flexDirection: props.direction === "row" ? "row" : "column",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 10,
                  width: "100%",
                  marginBottom: 20,
                },
                {
                  opacity: 0.75,
                },
              ]
            : {
                backgroundColor: props.backgroundColor,
                flexDirection: props.direction === "row" ? "row" : "column",
                alignItems: "center",
                padding: 10,
                borderRadius: 10,
                width: "100%",
                marginBottom: 20,
              }
        }
        onPress={props.onPress}
        android_ripple={{ color: Colors.androidRipple }}
      >
        {props.settingImage && (
          <Image
            source={require("../assets/settings-icon.png")}
            style={{ height: 30, width: 30 }}
          />
        )}
        {props.text && (
          <Text
            style={{
              color: props.textColor,
              textAlign: "center",
              fontFamily: "poppins-regular",
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
