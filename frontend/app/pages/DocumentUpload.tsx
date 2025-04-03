import React, { useState } from "react"
import { View, Text, Pressable, Image } from "react-native"
import * as DocumentPicker from "expo-document-picker"

export default function DocumentUpload(){
    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    
    const selectDocuments = async () => {
        const document = await DocumentPicker.getDocumentAsync({
            type: [
                "application/pdf",        
                "text/plain",             
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "text/markdown",         
                "audio/mpeg",             
            ],
            copyToCacheDirectory: true,
        });

        if (document.canceled) return;
        setFile(document.assets[0]);
    }
    return(
        <View className="flex-1 bg-white">
            <Text className="text-[24px] leading-[1.3] tracking-tighter font-bold text-center color-[#1F1F23] pt-10">
                Upload Your Study Materials
            </Text>
            <Text className="text-[16px] leading-[1.5] tracking-tighter text-center color-[#1f1f23] pt-3 p-12 pb-8">
                Add PDFs, Docs, or Notes to generate AI-powered study guides 
            </Text>
            <View className="items-center">
                <Pressable 
                    className="border-[2px] border-dashed border-[#7C8B9D] h-[136px] w-[322px] rounded-[10px] items-center justify-center"
                    onPress={selectDocuments}
                >
                    <Image 
                        source={require("../../assets/images/UploadIcon.png")}
                        resizeMode="contain"
                    />
                    <Text className="text-[14px] font-semibold color-[#7C8B9D] leading-[1.5] tracking-tighter">
                        Select or drag documents
                        </Text>
                    <Text className="text-[12px] color-[#a3a9b3] leading-[1.3] tracking-tighter">
                        Supported file types: .pdf, .txt, .pptx, .MD, .mp3
                    </Text>
                </Pressable>
                
                <Pressable 
                    className="w-[113px] h-[40px] bg-[#2879FF] rounded-[12] items-center justify-center m-8"
                    onPress={selectDocuments}
                >
                    <Text className="text-[16px] font-semibold tracking-tighter leading-[1.3] color-white">
                        Select
                    </Text>
                </Pressable>
            </View>

            <Text className="text-[20px] font-semibold leading-[1.3] tracking-tighter color-[#1f1f23] pl-[33px]">Uploaded Study Materials</Text>
            {file && <Text>Selected: {file.name}</Text>}
        </View>
    )
}