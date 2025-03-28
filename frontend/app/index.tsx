import { Text, View, Button } from "react-native";
import "../global.css";
import EditSources from "./components/EditSources";
import SearchBar from "./components/SearchBar";

export default function Index() {
  return (
    <View>
      <View className="p-7">
        <Text className="text-4xl font-bold">Tallyrus</Text>
      </View>
      <View className="items-center p-5 pb-8">
        <Text className="w-44 h-44 bg-gray-300 border"></Text>
      </View>
      <View className="items-center">
        <Text className="text-3xl text-center w-2/3">How can I help you today?</Text>
      </View>
        <View className="items-center pt-24 pb-6">
          <Text className="w-32 h-32 rounded-full bg-gray-300 border"></Text>
        </View>
          <EditSources/>
          <SearchBar/>
    </View>
  );
}
