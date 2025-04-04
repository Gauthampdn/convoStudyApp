import React, { useState } from "react"
import { View, Text, Pressable, Image, FlatList } from "react-native"
import * as DocumentPicker from "expo-document-picker"

export default function DocumentUpload(){
    const [files, setFiles] = useState<{ files: DocumentPicker.DocumentPickerAsset[]; studyDeckNumber: number }[]>([]);
    let [studyDeckNumber, setStudyDeckNumber] = useState(1)

    const selectDocuments = async () => {
        try{
            const document = await DocumentPicker.getDocumentAsync({
            type: [
                "application/pdf",  // .pdf      
                "text/plain",       // .txt      
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
                "text/markdown",    //. md
                "audio/mpeg",       // .mp3          
            ],
            multiple: true,
        });

        if (!document.canceled && document.assets) {
            // sorted alphabetically
            const sortedAssets = [...document.assets].sort((a, b) => a.name.localeCompare(b.name))

            const newStudyDeck = {
                files: sortedAssets,
                studyDeckNumber,
            }

            // adds the new study deck on top of the previous ones
            setFiles((prevFiles) => [newStudyDeck, ...prevFiles])
            setStudyDeckNumber((prevStudyDeckNumber) => prevStudyDeckNumber + 1)
        }
        } catch (error){
            console.error(error);
        }
        console.log(files)
        return files
    }

    return(
        <View className="flex-1 bg-white">
            <Text className="text-[24px] leading-[1.3] font-bold text-center color-[#1F1F23] pt-10">
                Upload Your Study Materials
            </Text>
            <Text className="text-[16px] leading-[1.5] text-center color-[#1f1f23] pt-3 p-12 pb-8">
                Add PDFs, Docs, or Notes to generate AI-powered study guides 
            </Text>

            <View className="items-center">
                {/* upload box */}
                <Pressable 
                    className="border-[2px] border-dashed border-[#7C8B9D] h-[136px] w-[322px] rounded-[10px] items-center justify-center"
                    onPress={selectDocuments}
                >
                    <Image 
                        source={require("../../assets/images/UploadIcon.png")}
                        resizeMode="contain"
                    />
                    <Text className="text-[14px] font-semibold color-[#7C8B9D] leading-[1.5]">
                        Select or drag documents
                        </Text>
                    <Text className="text-[12px] color-[#a3a9b3] leading-[1.3]">
                        Supported file types: .pdf, .txt, .pptx, .MD, .mp3
                    </Text>
                </Pressable>
                
                {/* upload button */}
                <Pressable 
                    className="w-[113px] h-[40px] bg-[#2879FF] rounded-[12] items-center justify-center m-8"
                    onPress={selectDocuments}
                >
                    <Text className="text-[16px] font-semibold leading-[1.3] color-white">
                        Select
                    </Text>
                </Pressable>
            </View>

            <Text className="text-[20px] font-semibold leading-[1.3] color-[#1f1f23] pl-[33px]">
                Uploaded Study Materials
            </Text>

            {files.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-[16px] font-semibold color-[#a3a9b3] leading-[1.3]">
                        No materials uploaded yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={ files }
                    renderItem={({ item }) => (
                        <View className="bg-gray-100 p-3 rounded-lg mb-4">
                        <Text className="text-[16px] font-semibold pl-[30px] pb-2">
                            Study Deck {item.studyDeckNumber}
                        </Text>
                        {item.files.map((file, index) => (
                            <View
                                key={index}
                                className="bg-white p-2 mb-1 rounded-md"
                            >
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