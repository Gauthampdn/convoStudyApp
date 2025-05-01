import * as DocumentPicker from "expo-document-picker";

export default interface DocumentSet {
    id: string;
    title: string;
    userId: string;
    files: DocumentPicker.DocumentPickerAsset[];
    tags: string[];
    description: string;
    stats: {
      sessions: {
        sessionDate: string;
        totalQuestions: number;
        correct: number;
        somewhatCorrect: number;
        incorrect: number;
        accuracy: number;
        timeSpent: number;
      }[];
    };
    createdAt: string;
    updatedAt: string;
}  
