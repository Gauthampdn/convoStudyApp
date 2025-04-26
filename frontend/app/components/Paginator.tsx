import { View, Animated, useWindowDimensions } from "react-native";

type PaginatorProps = {
  data: { id: string; image: any; title: string; description: string }[];
  scrollX: Animated.Value;
};

export default function Paginator({ data, scrollX }: PaginatorProps) {
  const { width } = useWindowDimensions();

  return (
    <View className="flex-row absolute bottom-[200px] items-center">
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width, // prev dot
          index * width, // current dot
          (index + 1) * width, // next dot
        ];

        // dot width depending on onboarding slide
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 10, 8],
          extrapolate: "clamp",
        });

        // dot color depending on onboarding slide
        const dotColor = scrollX.interpolate({
          inputRange,
          outputRange: ["#D9D9D9", "#363636", "#D9D9D9"],
          extrapolate: "clamp",
        });

        // dots
        return (
          <Animated.View
            className="rounded-[5px] m-[4px]"
            style={{
              width: dotWidth,
              height: dotWidth,
              backgroundColor: dotColor,
            }}
            key={index.toString()}
          />
        );
      })}
    </View>
  );
}
