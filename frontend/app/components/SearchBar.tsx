import { View, TextInput } from "react-native";

export default function SearchBar() {
    return(
        <View className="pt-2 items-center">
            <TextInput 
                placeholder="Type here..."
                placeholderTextColor={'gray'}
                className="pl-5 bg-gray-300 w-4/5 h-12 rounded-3xl border-black border"
            />
        </View>
    )
}