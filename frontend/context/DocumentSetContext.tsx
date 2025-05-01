import React, { createContext, useContext, useState, ReactNode } from "react";
import DocumentSet from "../app/interfaces/interfaces";

type DocumentSetContextType = {
  documentSets: DocumentSet[];
  setDocumentSets: React.Dispatch<React.SetStateAction<DocumentSet[]>>;
};

const DocumentSetContext = createContext<DocumentSetContextType | undefined>(
  undefined
);

export const DocumentSetProvider = ({ children }: { children: ReactNode }) => {
  const [documentSets, setDocumentSets] = useState<DocumentSet[]>([]);

  return (
    <DocumentSetContext.Provider value={{ documentSets, setDocumentSets }}>
      {children}
    </DocumentSetContext.Provider>
  );
};

// for UploadFiles.tsx to find the exact doc set using the passed id param
export const useDocumentSets = () => {
  const context = useContext(DocumentSetContext);
  if (!context) {
    throw new Error(
      "useDocumentSets must be used within a DocumentSetProvider"
    );
  }
  return context;
};

export default DocumentSetContext;
