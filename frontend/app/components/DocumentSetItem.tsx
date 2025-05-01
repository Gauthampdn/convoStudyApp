import { View, Text, TouchableOpacity } from "react-native";
import DocumentSet from "../interfaces/interfaces";

type DocumentSetItemProps = {
  item: DocumentSet;
  onPress: (item: DocumentSet) => void;
};

export default function DocumentSetItem({
  item,
  onPress,
}: DocumentSetItemProps) {
  return (
    <TouchableOpacity
      className="justify-center w-[177px] h-[208px] p-[16px] bg-white rounded-[12px] m-1 mb-4"
      onPress={() => onPress(item)}
    >
      <Text className="font-outfit600 text-[16px] text-[#1F1F23]">
        {item.title}
      </Text>
      <Text className="font-outfit400 text-[12px] text-[#5A5E6B]">
        {item.description}
      </Text>
      <Text className="font-outfit400 text-[12px] text-[#2879FF]">
        {item.tags}
      </Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  );
}
