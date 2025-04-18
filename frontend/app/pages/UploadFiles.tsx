import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function DocumentUpload() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [saveEnabled, setSaveEnabled] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

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
        /** TODO: if there are files that are not in "saved" state
         *  alert the user to check if they want to go back.
         *  if they do, it will discard the files that aren't "saved"
         *  else, cancel
         *  - make a function goBackToMySets() with navigation.goBack() inside
         */
        <Pressable onPress={() => router.back()}>
          <Entypo name="chevron-thin-left" size={24} color="#000000" />
        </Pressable>
      ),
      headerLeftContainerStyle: {
        padding: 100,
      },
    });
    StatusBar.setBarStyle("dark-content", true);
  });

  useEffect(() => {
    if (files.some((file) => status[file.name] === "selected")) {
      // allow save if there is a file ready to be saved
      setSaveEnabled(true);
    } else {
      setSaveEnabled(false);
    }
    console.log(files, status);
  }, [files, status]);

  const selectDocuments = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf", // .pdf
        ],
        multiple: true,
      });

      // delay for 200ms after selecting documents to prevent file access issues
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (!document.canceled && document.assets) {
        const newFiles = document.assets.filter((newFile) => {
          if (
            files.some(
              (existingFile) =>
                existingFile.name === newFile.name &&
                existingFile.size === newFile.size
            )
          ) {
            alert(
              `Duplicate file found: ${newFile.name}.\n It won't be added.`
            );
            return false;
          }
          return true;
        });

        const totalFiles = files.length;

        // error checking to make sure only 5 files could be uploaded
        if (totalFiles < 5 && newFiles.length + totalFiles > 5) {
          let diff = 5 - totalFiles;
          if (diff === 1) {
            alert(`Only ${diff} more file could be added.\n Try again.`);
            return;
          }
          alert(`Only ${diff} more files could be added.\n Try again.`);
          return;
        } else if (totalFiles === 5) {
          alert(
            "Already at a max of 5 files!\n Remove a file to add a new one."
          );
          return;
        }

        // sort the files alphabetically
        const sortedFiles = [...newFiles].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        // adds the new file(s) on top of the previous ones
        setFiles((prev) => [...sortedFiles, ...prev]);

        // sets status to "selected"
        sortedFiles.forEach((file) => {
          setStatus((prev) => ({ ...prev, [file.name]: "selected" }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startTimer = (fileName: string) => {
    const interval = setInterval(() => {
      setStatus((prev) => {
        if (prev[fileName] !== "uploading") return prev; // skip files that aren't uploading

        // change status to "saved" after uploading is done
        const updated = { ...prev, [fileName]: "saved" };
        return updated;
      });

      clearInterval(interval);
    }, 5000); // simulate 5 seconds upload (will replace with actual backend uploading time)
  };

  const removeFile = (fileName: string) => {
    Alert.alert(
      "Remove File",
      `Are you sure you want to remove '${fileName}'?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            // remove from files
            setFiles((prev) => prev.filter((file) => file.name !== fileName));

            // sends updated files (w/o the removed file) to backend
            sendToBackend(files);
          },
        },
      ]
    );
  };

  const getBase64Url = async (uri: string, mimeType: string | undefined) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:${mimeType ?? "application/octet-stream"};base64,${base64}`;
    } catch (error) {
      console.log(error);
    }
  };

  const saveFiles = async () => {
    // only set status to "uploading" for files that aren't already "saved"
    setStatus((prev) => {
      const updated = { ...prev };
      for (const file of files) {
        if (prev[file.name] !== "saved") {
          updated[file.name] = "uploading";
        }
      }
      return updated;
    });

    // start timers for unsaved files
    files.forEach((file) => {
      if (status[file.name] !== "saved") {
        startTimer(file.name);
      }
    });

    // sends all the files for now
    sendToBackend(files);
  };

  const sendToBackend = async (
    savedFiles: DocumentPicker.DocumentPickerAsset[]
  ) => {
    const fileMetaList = await Promise.all(
      savedFiles.map(async (file) => {
        const base64Url = await getBase64Url(file.uri, file.mimeType);
        return {
          name: file.name,
          type: file.mimeType,
          base64Url,
        };
      })
    );

    console.log(fileMetaList);

    try {
      // TODO: need the document set id to be passed
      const response = await fetch(`http://localhost:8081/api/docSet/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: fileMetaList,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      console.log("Success", await response.json());
    } catch (error) {
      console.log(error);
    }
  };

  // depending on file type, it will display a diff icon (add more cases for diff file types)
  const getFileIcon = (mimeType: string | undefined) => {
    switch (mimeType) {
      case "application/pdf":
        return (
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={36}
            color={"#F04438"}
          />
        );
    }
  };

  // handles the loading/checkmark icon
  const statusHandler = (status: string) => {
    switch (status) {
      case "uploading":
        return (
          <View className="mr-3 ml-3">
            <ActivityIndicator color={"#2879FF"} size={"small"} />
          </View>
        );
      case "saved":
        return (
          <View className="mr-3 ml-3">
            <Feather name="check" color={"#2879FF"} size={20} />
          </View>
        );
    }
  };

  const save = (status: boolean) => {
    return (
      <View className="flex-1 justify-end items-center bottom-8 mb-4">
        <Pressable
          className={`w-[361px] h-[44px] rounded-[12px] items-center justify-center ${
            status ? "bg-[#2879FF]" : "bg-[#CECECE]"
          }`}
          onPress={saveFiles}
          disabled={!status}
        >
          <Text
            className={`${
              status ? "color-[#FFFFFF]" : "color-[#5A5E6B]"
            } text-[15px] font-outfit500`}
          >
            Save
          </Text>
        </Pressable>
      </View>
    );
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
        {/** upload box */}
        <Pressable
          className="border-[1px] border-dashed border-[#1849D6] h-[194px] w-[361px] bg-white rounded-[8px] items-center justify-center mb-6"
          onPress={selectDocuments}
        >
          <MaterialCommunityIcons
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

          {/** browse button */}
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
        <>
          <View className="flex-1 justify-center items-center">
            <Text className="text-[16px] font-outfit500 color-[#a3a9b3] leading-[1.3]">
              No documents uploaded yet
            </Text>
          </View>
          <View className="flex-1 justify-center items-center">
            {save(false)}
          </View>
        </>
      ) : (
        <>
          <FlatList
            data={files}
            className="mb-[93px]"
            renderItem={({ item }) => (
              <View className="bg-[#FFFFFF] w-[361px] border border-[#E7E7E7] p-[13px] m-[2px] ml-4 rounded-[12px] flex-row justify-between items-center">
                {/** file icon */}
                <View className="flex-row">
                  {getFileIcon(item.mimeType)}
                  <View className="ml-1">
                    <Text
                      className="text-sm font-outfit500 w-[190px] text-[#0B0B0B]"
                      numberOfLines={1}
                    >
                      {/** file name */}
                      {item.name}
                    </Text>

                    {/** file size */}
                    <Text className="text-sm font-outfit400 text-[#6D6D6D]">
                      {(() => {
                        return (item.size ?? 0) < 1024 * 1024
                          ? `${((item.size ?? 0) / 1024).toFixed(0)} KB`
                          : `${((item.size ?? 0) / (1024 * 1024)).toFixed(
                              1
                            )} MB`;
                      })()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  {/** loading/check icon */}
                  {statusHandler(status[item.name])}

                  {/** remove file button */}
                  <Pressable onPress={() => removeFile(item.name)}>
                    <Feather name="x-circle" size={20} color="#FF3636" />
                  </Pressable>
                </View>
              </View>
            )}
          />
          {save(saveEnabled)}
        </>
      )}
    </View>
  );
}
