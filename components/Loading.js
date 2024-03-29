import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const Loading = () => {
  return (
    <LottieView
      source={require("../assets/loading.json")}
      style={styles.animation}
      autoPlay
    />
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
  },
});

export default Loading;
