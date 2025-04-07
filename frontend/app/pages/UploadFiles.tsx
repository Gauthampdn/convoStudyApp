import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function DocumentUpload() {
  const [files, setFiles] = useState<
    { files: DocumentPicker.DocumentPickerAsset[] }[]
  >([]);
  const navigation = useNavigation();

  // header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Upload",
      headerTitleStyle: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 20,
        color: "#1F1F23",
      },
      headerStyle: {
        backgroundColor: "#F1F3F6",
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={24} color="#000000" />
        </Pressable>
      ),
      headerLeftContainerStyle: {
        padding: 100,
      },
    });
  });

  const selectDocuments = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf", // .pdf
        ],
        multiple: true,
      });

      if (!document.canceled && document.assets) {
        if (document.assets.length > 5) {
          alert("Only 5 files could be uploaded!");
          return;
        }
        // sorted alphabetically
        const sortedAssets = [...document.assets].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const newStudyDeck = {
          files: sortedAssets,
        };

        // adds the new study deck on top of the previous ones
        setFiles((prevFiles) => [newStudyDeck, ...prevFiles]);
      }
    } catch (error) {
      console.error(error);
    }
    console.log(files);
    return files;
  };

  return (
    <View className="flex-1 bg-[#F1F3F6]">
      <Text className="text-[16px] leading-[1.50] font-outfit600 color-[#1F1F23] mt-10 ml-[16]">
        Media Upload
      </Text>
      <Text className="text-[15px] leading-md font-outfit300 color-[#6D6D6D] mt-[9] m-[16]">
        Add your documents here, and you can upload up to 5 files max
      </Text>

      <View className="items-center">
        {/* upload box */}
        <Pressable
          className="border-[1px] border-dashed border-[#1849D6] h-[194px] w-[361px] bg-white rounded-[8px] items-center justify-center"
          onPress={selectDocuments}
        >
          <MaterialCommunityIcons
            className=""
            name="folder-upload"
            size={50}
            color="#2879FF"
          />
          <Text className="text-[15px] font-outfit300 color-[#0B0B0B] leading-md m-2">
            Drag your file(s) to start uploading
          </Text>
          <Text className="text-[15px] font-outfit300 color-[#5A5E6B] leading-md mb-2">
            OR
          </Text>

          {/* browse button */}
          <Pressable
            className="w-[102px] h-[36px] bg-[#FFFFFF] border-[2px] border-[#2879FF] rounded-[12px] items-center justify-center"
            onPress={selectDocuments}
          >
            <Text className="text-[15px] font-outfit500 leading-[1.3] color-[#2879FF]">
              Browse
            </Text>
          </Pressable>
        </Pressable>
      </View>

      {files.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-[16px] font-outfit500 color-[#a3a9b3] leading-[1.3]">
            No documents uploaded yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={({ item }) => (
            <View className="">
              {item.files.map((file, index) => (
                <View key={index} className="bg-white p-2 mb-1 rounded-md">
                  <Text className="text-[14px] text-black pl-[30px]">
                    {file.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}
