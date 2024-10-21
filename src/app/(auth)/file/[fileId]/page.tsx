"use client";

import fileApi from "@/api/fileApi";
import PDFViewer from "@/components/viewer/pdf";
import { Box, Container } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
	const { fileId } = useParams();
	const [fileData, setFileData] = useState<string | null>(null);
	useEffect(() => {
		const fetchFile = async () => {
			const res = await fileApi.download(fileId as string);
			const fileURL = URL.createObjectURL(
				new Blob([res as any], { type: "application/pdf" })
			);

			setFileData(fileURL);
		};

		fetchFile();
	}, [fileId]);
	return (
		<Container>
			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<PDFViewer fileData={fileData} />
			</Box>
		</Container>
	);
};

export default Page;
