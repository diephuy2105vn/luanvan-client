"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import fileApi from "@/api/fileApi";
import PDFViewer from "@/components/viewer/pdf";
import WordViewer from "@/components/viewer/word";
import { Box, Container } from "@mui/material";

const Page = () => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const file = await fileApi.getById(fileId as string);
        setFile(file);

        const res = await fileApi.download(fileId as string);
        const blob = new Blob([res], {
          type:
            file.extension === "docx" || file.extension === "doc"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "application/pdf",
        });

        setFileData(blob);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [fileId]);

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {file !== null ? (
          file.extension === "doc" || file.extension === "docx" ? (
            <WordViewer fileData={fileData} />
          ) : (
            <PDFViewer fileData={fileData} />
          )
        ) : (
          <></>
        )}
      </Box>
    </Container>
  );
};

export default Page;
