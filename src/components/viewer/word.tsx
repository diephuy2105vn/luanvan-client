"use client";

import { Box } from "@mui/material";
import { renderAsync } from "docx-preview";
import React, { useEffect } from "react";

const WordViewer = ({ fileData }) => {
  // console.log("Hello wword");
  useEffect(() => {
    // Ensure that the container exists
    const container = document.getElementById("container-word");
    if (container && fileData) {
      // Render the DOCX document
      renderAsync(fileData, container)
        .then(() => {})
        .catch((err) => {});
    }
  }, [fileData]);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[500],
        height: "calc(100vh)",

        overflow: "auto",
        justifyContent: "center",
      }}
    >
      <div id="container-word"></div>
    </Box>
  );
};

export default WordViewer;
