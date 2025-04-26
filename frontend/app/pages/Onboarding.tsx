import {
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  ViewToken,
} from "react-native";
import { useState, useRef } from "react";
import OnboardingItem from "../components/OnboardingItem";
import Paginator from "../components/Paginator";
import OnboardingNextButton from "@/app/components/OnboardingNextButton";
import { router } from "expo-router";

export default function Onboarding() {
  const slides = [
    {
      id: "1",
      image: require("../../assets/images/onboarding1.png"),
      title: "Smarter Studying Starts Here",
      description:
        "Organize your notes, chat with AI, and master any subject effortlessly.",
    },
    {
      id: "2",
      image: require("../../assets/images/onboarding2.png"),
      title: "Your Notes, Your Way",
      description:
        "Organize your notes, chat with AI, and master any subject effortlessly.",
    },
    {
      id: "3",
      image: require("../../assets/images/onboarding3.png"),
      title: "Turn Notes Into Knowledge",
      description:
        "Chat with AI to summarize, quiz yourself, and get tailored study tips.",
    },
    {
      id: "4",
      image: require("../../assets/images/onboarding4.png"),
      title: "Upload & Learn Instantly",
      description:
        "Chat with AI to summarize, quiz yourself, and get tailored study tips.",
    },
  ];

  type Slide = {
    id: string;
    image: any;
    title: string;
    description: string;
  };

  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setCurrentIndex(viewableItems[0].index!);
    }
  ).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef<FlatList<Slide>>(null!);

  const scrollTo = () => {
    // if you are not at the end of the onboarding slides
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/pages/SignIn");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <FlatList
        data={slides}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <Paginator data={slides} scrollX={scrollX} />
      <OnboardingNextButton
        data={slides}
        scrollX={scrollX}
        scrollTo={scrollTo}
        currentIndex={currentIndex}
      />
    </View>
  );
}
