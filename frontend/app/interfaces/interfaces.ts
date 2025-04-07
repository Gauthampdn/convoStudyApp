export interface DocumentSet {
    // _id: string;
    title: string;
    userId: string;
    files: string[];
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