import { Button, Alert, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClearStorageButton() {
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Cleared", "async cleared");
    } catch (error) {
      Alert.alert("Error", "failed to clear async");
      console.log("Clear AsyncStorage error:", error);
    }
  };

  const confirmClear = () => {
    Alert.alert(
      "Confirm Clear",
      "Are you sure you want to clear all stored data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearStorage },
      ]
    );
  };

  return (
    <View>
      <Button title="Clear AsyncStorage" color="red" onPress={confirmClear} />
    </View>
  );
}
