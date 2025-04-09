import { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dummyUser from "../../dummyUser.json";
import dummyDocumentSets from "../../dummyDocumentSets.json";
import dummyEmptyDocSet from "../../dummyEmptyDocSet.json";
import { DocumentSet } from "../interfaces/interfaces";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter, useNavigation } from "expo-router";

export default function DocumentSets() {
  const [documentSets, selectDocumentSets] = useState<DocumentSet[]>([]);
  const [hasDocuments, setHasDocuments] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  // header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Sets",
      headerTitleStyle: {
        fontFamily: "Outfit_600SemiBold",
        fontSize: 24,
        color: "#1F1F23",
      },
      headerStyle: {
        backgroundColor: "#F1F3F6",
      },
    });
    StatusBar.setBarStyle("dark-content", true);
  });

  useEffect(() => {
    const getDocumentSets = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        /* const response = await fetch("http://localhost:8081/api/docSet", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }); */

        /* if (!response.ok) {
                    console.error(response.text);
                    } */

        // const data = await response.json();

        const dummyUserData = dummyUser;

        /* 
          comment one or the other out to see the respective pages
          dummyDocumentSets = populated state (unfinished)
          dummyEmptyDocSet = empty state (finished)
        */
        // const dummyDocumentSetsData = dummyDocumentSets;
        const dummyDocumentSetsData = dummyEmptyDocSet;

        /* if (data.success) {
            selectDocumentSets(data.data);
        } else {
            console.error(data.message);
        } */

        if (dummyDocumentSetsData && dummyDocumentSetsData.length > 0) {
          selectDocumentSets(dummyDocumentSetsData);
          setHasDocuments(true);
        } else {
          setHasDocuments(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDocumentSets();
  }, []);

  // goes to the upload files page
  const addSet = () => {
    router.push("/pages/UploadFiles");
  };

  return (
    <View className="flex-1 bg-[#F1F3F6] items-center">
      {!hasDocuments ? (
        // empty state
        <View className="items-center">
          <Image
            className="w-[333px] h-[242px] mt-[50]"
            source={require("../../assets/images/noStudySetsImg.png")}
            resizeMode="contain"
          />
          <Text className="text-[16px] font-outfit600 leading-[1.5] color-[#1F1F23] mt-5">
            No study sets yet!
          </Text>
          <Text className="text-[14px] text-center font-outfit400 leading-[1.5] color-[#1F1F23] w-[285] mt-[8]">
            Create your first set to start organizing and learning faster.
          </Text>
          <Pressable
            className="w-[130px] h-[48px] bg-[#2879FF] rounded-[12] items-center justify-center m-8 flex-row"
            onPress={addSet}
          >
            <Entypo name="plus" size={21} color={"white"} />
            <Text className="text-[14px] font-outfit600 color-[#FFFFFF] leading[1.3] text-center ml-3">
              Add Set
            </Text>
          </Pressable>
        </View>
      ) : (
        // populated state
        <FlatList
          data={documentSets}
          renderItem={({ item }: { item: DocumentSet }) => (
            <Pressable
              className="p-4 border border-gray-300 rounded-lg m-2"
              onPress={() => console.log(`Selected document: ${item.title}`)}
            >
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Text className="text-sm text-gray-500">{item.description}</Text>
            </Pressable>
          )}
        ></FlatList>
      )}
    </View>
  );
}
