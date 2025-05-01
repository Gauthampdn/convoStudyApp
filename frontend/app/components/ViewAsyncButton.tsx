import { Button, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewStorageButton() {
  const viewStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);

      console.log("AsyncStorage contents:");
      items.forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      Alert.alert("Logged", "logged async");
    } catch (error) {
      Alert.alert("Error", "failed to read async");
      console.log("Read AsyncStorage error:", error);
    }
  };

  return (
    <View>
      <Button title="View AsyncStorage" onPress={viewStorage} />
    </View>
  );
}
