import { useState } from "react";
import { StyleSheet, View, TextInput, Button, Modal } from "react-native";

function TickerInput(props) {
  const [enteredTicker, setEnteredTicker] = useState("");

  function tickerInputHandler(enteredText) {
    setEnteredTicker(enteredText);
  }

  function addTicker() {
    props.onAddTicker(enteredTicker);
    setEnteredTicker("");
  }

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Coin Ticker"
          placeholderTextColor="#FFE5B4"
          onChangeText={tickerInputHandler}
          value={enteredTicker}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Add Ticker" color="#E8AA42" onPress={addTicker} />
          </View>
          <View style={styles.button}>
            <Button title="Cancel" color="#E8AA42" onPress={props.onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: "#231955",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8AA42",
    width: "100%",
    padding: 8,
    color: "#FFE5B4",
    backgroundColor: "#1F4690",
    padding: 16,
    borderRadius: 6,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
  },
  button: {
    width: "30%",
    marginHorizontal: 8,
  },
});

export default TickerInput;
