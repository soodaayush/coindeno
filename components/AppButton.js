import { Text, View, Pressable } from "react-native";

const AppButton = (props) => {
  return (
    <View style={{ marginRight: props.direction === "row" ? 15 : 0 }}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [
                {
                  backgroundColor: props.backgroundColor,
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
                padding: 10,
                borderRadius: 10,
                width: "100%",
                marginBottom: 20,
              }
        }
        onPress={props.onPress}
        android_ripple={{ color: "#1F4690" }}
      >
        <Text
          style={{
            color: props.textColor,
            textAlign: "center",
            fontSize: 18,
          }}
        >
          {props.text}
        </Text>
      </Pressable>
    </View>
  );
};

export default AppButton;
