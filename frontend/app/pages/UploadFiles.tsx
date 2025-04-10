import { useLayoutEffect, useRef, useState } from "react";
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
import { useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

export default function DocumentUpload() {
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [status, setStatus] = useState<Record<string, string>>({});
  const statusRef = useRef<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>(
    {}
  );
  const timeRef = useRef<Record<string, NodeJS.Timeout>>({});
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
    StatusBar.setBarStyle("dark-content", true);
  });

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

        // sets and starts the file's upload timer
        sortedFiles.forEach((file) => {
          setTimeRemaining((prev) => ({ ...prev, [file.name]: 10 }));
          setStatus((prev) => ({ ...prev, [file.name]: "loading" }));
          startTimer(file.name);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startTimer = (fileName: string) => {
    timeRef.current[fileName] = setInterval(() => {
      setTimeRemaining((prev) => {
        if (statusRef.current[fileName] === "paused") return prev; // skips the file if it's paused

        const timeLeft = prev[fileName] ?? 0;
        if (timeLeft <= 1) {
          // file is done uploading
          clearInterval(timeRef.current[fileName]!);
          setStatus((prev) => ({ ...prev, [fileName]: "done" })); // set status to done
          return { ...prev, [fileName]: 0 }; // set timeRef to 0
        }
        return { ...prev, [fileName]: timeLeft - 1 }; // decrements the timeRef by 1 (just the counter)
      });
    }, 1000); // every second the timer is decremented (controls the actual speed of the interval)
  };

  const pause = (fileName: string) => {
    setStatus((prev) => {
      const updated = { ...prev, [fileName]: "paused" };
      statusRef.current = updated;
      return updated;
    });
  };

  const resume = (fileName: string) => {
    setStatus((prev) => {
      const updated = { ...prev, [fileName]: "loading" };
      statusRef.current = updated;
      return updated;
    });
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
            // goes through every file and keeps the ones that don't match the file that's being removed
            setFiles((prev) => prev.filter((file) => file.name !== fileName));
          },
        },
      ]
    );
  };

  const uploadFiles = () => {
    console.log(files);
    return files;
  };

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

  const statusHandler = (status: string, size: number, time: number) => {
    switch (status) {
      case "loading":
        return (
          <Text className="text-sm font-outfit400 text-[#6D6D6D]">
            Uploading • {time}s remaining
          </Text>
        );
      case "paused":
        return (
          <Text className="text-sm font-outfit400 text-[#6D6D6D]">
            Upload paused • {time}s remaining
          </Text>
        );
      case "done":
        return (
          <Text className="text-sm font-outfit400 text-[#6D6D6D]">
            {(() => {
              return (size ?? 0) < 1024 * 1024
                ? `${((size ?? 0) / 1024).toFixed(0)} KB`
                : `${((size ?? 0) / (1024 * 1024)).toFixed(1)} MB`;
            })()}
          </Text>
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
          onPress={uploadFiles}
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
                      {item.name} {/** file name */}
                    </Text>

                    {/** displays the status of the file upload */}
                    {statusHandler(
                      status[item.name],
                      item.size ?? 0,
                      timeRemaining[item.name]
                    )}
                  </View>
                </View>

                <View className="flex-row">
                  {/** loading icon */}
                  {status[item.name] === "loading" && (
                    <View className="mr-3 ml-3">
                      <ActivityIndicator color={"#2879FF"} size={"small"} />
                    </View>
                  )}

                  {/** pause/resume button */}
                  {status[item.name] !== "done" && (
                    <View className="mr-3">
                      <Pressable
                        onPress={() =>
                          status[item.name] === "paused"
                            ? resume(item.name)
                            : pause(item.name)
                        }
                      >
                        {status[item.name] === "paused" ? (
                          <Feather
                            name="play-circle"
                            size={20}
                            color={"#5A5E6B"}
                          />
                        ) : (
                          <Feather
                            name="pause-circle"
                            size={20}
                            color={"#5A5E6B"}
                          />
                        )}
                      </Pressable>
                    </View>
                  )}
                  {/** remove file button */}
                  <Pressable onPress={() => removeFile(item.name)}>
                    <Feather name="x-circle" size={20} color="#FF3636" />
                  </Pressable>
                </View>
              </View>
            )}
          />
          {save(true)}
        </>
      )}
    </View>
  );
}
