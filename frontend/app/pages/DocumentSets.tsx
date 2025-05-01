import { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dummyUser from "../../dummyUser.json";
import dummyDocumentSets from "../../dummyDocumentSets.json";
import dummyEmptyDocSet from "../../dummyEmptyDocSet.json";
import DocumentSet from "../interfaces/interfaces";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter, useNavigation } from "expo-router";
import { useWindowDimensions } from "react-native";
import DocumentSetItem from "../components/DocumentSetItem";
import AddDocSetModal from "../components/AddDocSetModal";
import { useDocumentSets } from "@/context/DocumentSetContext";
import ClearStorageButton from "../components/ClearAsyncButton";
import ViewStorageButton from "../components/ViewAsyncButton";
import * as DocumentPicker from "expo-document-picker";

export default function DocumentSets() {
  const { documentSets, setDocumentSets } = useDocumentSets();
  const [hasDocuments, setHasDocuments] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;

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
        const keys = await AsyncStorage.getAllKeys();
        const docSetKeys = keys.filter((key) => key.startsWith("docSet:"));

        const keyValuePairs = await AsyncStorage.multiGet(docSetKeys);
        const sets = keyValuePairs
          .map(([key, value]) => {
            if (value) return JSON.parse(value);
            return null;
          })
          .filter((set) => set !== null);

        setDocumentSets(sets);
        setHasDocuments(sets.length > 0);
        console.log("Loaded doc sets from AsyncStorage:", sets);
      } catch (error) {
        console.error("Failed to load document sets:", error);
      }
    };

    getDocumentSets();
  }, []);

  const openAddDocSetModal = () => {
    setModalVisible(true);
  };

  const closeAddDoctSetModal = () => {
    setModalVisible(false);
  };

  const handleAddSet = (
    id: string,
    name: string,
    description: string,
    tags: string
  ) => {
    console.log(id, name, description, tags);
    const newSet = {
      id: id,
      title: name,
      description: description,
      tags: tags.split(","),
      userId: "",
      files: [],
      stats: {
        sessions: [],
      },
      createdAt: "",
      updatedAt: "",
    };
    setDocumentSets((prev) => [...prev, newSet]);
    setHasDocuments(true);
  };

  const viewDocSet = async (docSet: DocumentSet) => {
    console.log("selected doc set: ", docSet.title);
    await AsyncStorage.setItem(`docSet:${docSet.id}`, JSON.stringify(docSet));
    router.push({
      pathname: "/pages/DocumentSetPage",
      params: { id: docSet.id },
    });
  };

  const handleClear = () => {
    setDocumentSets([]);
    setHasDocuments(false);
  };

  return (
    <View className="flex-1 bg-[#F1F3F6]">
      {!hasDocuments ? (
        // empty state w-[333px] h-[242px] mt-[50]
        <View className="items-center">
          <Image
            source={require("../../assets/images/noStudySetsImg.png")}
            resizeMode="contain"
            className="mt-[50]"
            style={{
              width: isMobile ? width * 0.8 : width * 0.4,
              height: height * 0.3,
            }}
          />
          <Text className="text-[16px] font-outfit600 leading-[1.5] color-[#1F1F23] mt-5">
            No study sets yet!
          </Text>
          <Text className="text-[14px] text-center font-outfit400 leading-[1.5] color-[#1F1F23] w-[285] mt-[8]">
            Create your first set to start organizing and learning faster.
          </Text>
          <TouchableOpacity
            className="w-[130px] h-[48px] bg-[#2879FF] rounded-[12] items-center justify-center m-8 flex-row"
            onPress={openAddDocSetModal}
          >
            <Entypo name="plus" size={21} color={"white"} />
            <Text className="text-[14px] font-outfit600 color-[#FFFFFF] leading[1.3] text-center ml-3">
              Add Set
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // populated state
        <>
          <View>
            <FlatList
              className="p-[12px]"
              data={[...documentSets].reverse()}
              keyExtractor={(item) => item.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              bounces={false}
              renderItem={({ item }) => (
                <DocumentSetItem item={item} onPress={() => viewDocSet(item)} />
              )}
            />
          </View>
          <TouchableOpacity
            className="absolute bottom-[5%] right-[1%] w-[56px] h-[56px] rounded-[100px] bg-[#2879FF] items-center justify-center m-2"
            onPress={openAddDocSetModal}
          >
            <Entypo name="plus" size={21} color={"white"} />
          </TouchableOpacity>
        </>
      )}
      <ViewStorageButton></ViewStorageButton>
      <ClearStorageButton onClear={handleClear}></ClearStorageButton>
      <AddDocSetModal
        visible={modalVisible}
        onClose={closeAddDoctSetModal}
        onAddSet={handleAddSet}
      />
    </View>
  );
}
