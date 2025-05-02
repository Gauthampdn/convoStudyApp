import { Text, TouchableOpacity } from "react-native";

type UploadFilesButtonProps = {
  text: string;
  onPress: () => void | Promise<void>;
};

export default function UploadFilesButton({ text, onPress }: UploadFilesButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[102px] h-[36px] bg-[#FFFFFF] border-[2px] border-[#2879FF] rounded-[12px] items-center justify-center"
    >
      <Text className="text-[15px] font-outfit500 leading-[1.3] text-[#2879FF]">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
