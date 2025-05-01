import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

type AddDocSetModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddSet: (
    id: string,
    name: string,
    description: string,
    tags: string
  ) => void;
};

export default function AddDocSetModal({
  visible,
  onClose,
  onAddSet,
}: AddDocSetModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const addSet = async (name: string, description: string, tags: string) => {
    if (!name.trim() || !description.trim() || !tags.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    let id = Date.now().toString();

    onAddSet(id, name, description, tags);

    // reset placeholder texts
    setName("");
    setDescription("");
    setTags("");

    await new Promise((resolve) => setTimeout(resolve, 200));

    onClose();
    router.navigate({ pathname: "/pages/UploadFiles", params: { id } });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-[80%]">
              <Text className="text-[20px] font-outfit600 mb-4">
                Add Document Set
              </Text>

              <Text className="text-[16px] font-outfit400 mb-1">Name</Text>
              <TextInput
                placeholder="Enter name"
                placeholderTextColor={"#A3A9B3"}
                className="font-outfit400 border p-2 mb-4 rounded-md"
                value={name}
                onChangeText={setName}
              />

              <Text className="text-[16px] font-outfit400 mb-1">
                Description
              </Text>
              <TextInput
                placeholder="Enter description"
                placeholderTextColor={"#A3A9B3"}
                className="font-outfit400 border p-2 mb-4 rounded-md"
                value={description}
                onChangeText={setDescription}
              />

              <Text className="text-[16px] font-outfit400 mb-1">Tags</Text>
              <TextInput
                placeholder="Enter tags (ex. Math, Calculus 1, etc.)"
                placeholderTextColor={"#A3A9B3"}
                className="font-outfit400 border p-2 mb-4 rounded-md"
                value={tags}
                onChangeText={setTags}
              />

              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    setName("");
                    setDescription("");
                    setTags("");
                  }}
                  className="w-[40%] bg-white border border-[#2879FF] rounded-[12px] p-2"
                >
                  <Text className="text-[#2879FF] text-center font-outfit600">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    addSet(name, description, tags);
                  }}
                  disabled={!name.trim() || !description.trim() || !tags.trim()}
                  className={`w-[40%] rounded-[12px] p-2 ${
                    !name.trim() || !description.trim() || !tags.trim()
                      ? "bg-[#A3A9B3]"
                      : "bg-[#2879FF]"
                  }`}
                >
                  <Text className="text-white text-center font-outfit600">
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
