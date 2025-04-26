import {
  Text,
  TouchableOpacity,
  Animated,
  GestureResponderEvent,
} from "react-native";

type OnboardingNextButtonProps = {
  data: { id: string; image: any; title: string; description: string }[];
  scrollX: Animated.Value;
  scrollTo: (event: GestureResponderEvent) => void;
  currentIndex: number;
};

export default function OnboardingNextButton({
  scrollTo,
  currentIndex,
}: OnboardingNextButtonProps) {
  let text = "";
  switch (currentIndex) {
    case 0:
      text = "Get Started";
      break;
    case 1:
    case 2:
      text = "Next";
      break;
    case 3:
      text = "Let's Go";
      break;
  }

  return (
    <TouchableOpacity
      className="w-[358px] h-[48px] absolute bottom-[120px] bg-[#2879FF] rounded-[12px] justify-center"
      onPress={scrollTo}
    >
      <Text className="font-outfit600 text-[16px] text-white text-center">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
