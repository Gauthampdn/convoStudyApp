import { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import DocumentSet from "../interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import UploadFilesButton from "../components/UploadFilesButton";
import * as DocumentPicker from "expo-document-picker";

export default function DocumentSetPage() {
  const [docSet, setDocSet] = useState<DocumentSet | undefined>();
  const { id } = useLocalSearchParams();
  console.log("Key: ", id);

  useFocusEffect(
    useCallback(() => {
      const loadDocSet = async () => {
        const data = await AsyncStorage.getItem(`docSet:${id}`);
        if (data) {
          const docSet = JSON.parse(data);
          console.log("loaded docSet: ", docSet);
          setDocSet(docSet);
        }
      };

      loadDocSet();
    }, [id])
  );

  if (!docSet) return <ActivityIndicator size={"large"} />;

  const goToUploadFiles = () => {
    router.navigate({ pathname: "/pages/UploadFiles", params: { id } });
  };

  return (
    <View className="items-center">
      <Text className="font-outfit600 text-[20px]">{docSet.title}</Text>
      <View>
        {docSet.files.map((file, index) => (
          <Text className="font-outfit400" key={index}>
            {file.name}
          </Text>
        ))}
      </View>
      <UploadFilesButton text={"Edit Files"} onPress={goToUploadFiles} />
    </View>
  );
}
