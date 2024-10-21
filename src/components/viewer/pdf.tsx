import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, styled } from "@mui/material";
import Loading from "@/components/common/Loading";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const StyledPage = styled(Page)(({ theme }) => ({
	"& + &": {
		marginTop: "4px",
	},
}));

const PDFViewer = ({ fileData }: { fileData: string | null }) => {
	const [numPages, setNumPages] = useState(0);

	return (
		<Box
			sx={{
				padding: "8px",
				backgroundColor: (theme) => theme.palette.grey[500],
			}}>
			{fileData ? (
				<Document
					file={fileData}
					onLoadSuccess={({ numPages }) => {
						setNumPages(numPages);
					}}>
					{Array.apply(null, Array(numPages))
						.map((x, i) => i + 1)
						.map((page, i) => (
							<StyledPage
								key={i}
								canvasBackground="white"
								renderTextLayer={false}
								renderAnnotationLayer={false}
								scale={1.2}
								pageNumber={page}
								renderMode="canvas"
							/>
						))}
				</Document>
			) : (
				<Loading />
			)}
		</Box>
	);
};

export default PDFViewer;
