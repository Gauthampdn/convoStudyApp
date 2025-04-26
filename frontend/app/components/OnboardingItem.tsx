import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";

type ItemProps = {
  item: {
    id: string;
    image: any;
    title: string;
    description: string;
  };
};

export default function OnboardingItem({ item }: ItemProps) {
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
    <View className="bg-white">
      <Image
        className="flex-[0.5] justify-center"
        source={item.image}
        style={{ width: width, resizeMode: "contain" }}
      />

      <View className="flex-[0.5] items-center mt-[-40px]">
        <Text className="w-[285px] font-outfit700 text-center text-[32px] color-[#000000] mb-[25px]">
          {item.title}
        </Text>
        <Text className="w-[285px] font-outfit400 text-center text-[16px] color-[#000000] mb-[25px]">
          {item.description}
        </Text>
      </View>
    </View>
  );
}
