import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import SignInButton from "../components/SignInButton";

export default function SignIn() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  // header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Tallyrus",
      headerTitleStyle: {
        fontFamily: "Outfit_700Bold",
        fontSize: 32,
        color: "#1F1F23",
      },
      headerStyle: {
        backgroundColor: "#FFFFFF",
      },
    });
    StatusBar.setBarStyle("dark-content", true);
  });

  return (
    <View className="bg-white flex-1 items-center">
      <Image
        className="flex-1 justify-center top-[50px] w-[306px]"
        source={require("../../assets/images/onboarding5.png")}
        style={{ resizeMode: "contain" }}
      />

      <View className="flex-[0.4] items-center mt-[75px]">
        <Text className="w-[285px] font-outfit700 text-center text-[32px] color-[#000000] mb-[25px]">
          Ready to study smarter?
        </Text>
        <Text className="w-[285px] font-outfit400 text-center text-[16px] color-[#000000] mb-[25px]">
          Your all-in-one AI study assistant.
        </Text>
      </View>

      <SignInButton />
    </View>
  );
}
