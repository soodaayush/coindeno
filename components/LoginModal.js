import { StyleSheet, View, Modal, Button } from "react-native";
import {} from "firebase/auth";

function LoginModal(props) {
  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Button title="Log in with Google" color="#E8AA42"></Button>
        <Button title="Log in with Facebook" color="#E8AA42"></Button>
        <Button title="Log in with Twitter" color="#E8AA42"></Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: "#231955",
  },
});

export default LoginModal;
