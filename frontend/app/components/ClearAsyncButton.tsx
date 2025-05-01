import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClearStorageButton({
  onClear,
}: {
  onClear: () => void;
}) {
  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("async cleared");
      onClear();
    } catch (error) {
      console.error("failed to clear async", error);
    }
  };

  return <Button title="Clear Storage" onPress={handleClearStorage} />;
}
