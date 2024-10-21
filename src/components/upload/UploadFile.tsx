import React, { useCallback, useEffect, useState } from "react";
import {
	Box,
	Button,
	Grid,
	IconButton,
	Typography,
	styled,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
	AddAPhotoOutlined,
	Archive,
	Close,
	Delete,
	InsertDriveFile,
	InsertDriveFileOutlined,
} from "@mui/icons-material";
import theme from "@/theme";
import Excel from "../icon/Excel";
import Pdf from "../icon/Pdf";
import Word from "../icon/Word";
import { FilePropertyType } from "@/types/file";
import { formatText, getExtensionByName } from "@/utils";

const StyledUpload = styled(Box, {
	shouldForwardProp: (prop) => prop != "size",
})<{ size: "small" | "medium" | "large" }>(({ theme, size }) => ({
	width: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: size === "small" ? "24px" : size === "large" ? "32px" : "16px",
	borderRadius: "12px",
	border: "2px dashed #ccc",
	position: "relative",
}));

type CustomFile = {
	extension: string;
} & File;

const UploadFile = ({
	value,
	onChange,
	size = "medium",
	disabled = false,
	error = false,
}: {
	value?: File[];
	onChange: (value: File[]) => void;
	size?: "small" | "medium" | "large";
	disabled?: boolean;
	error?: boolean;
}) => {
	const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
	const [customFiles, setCustomFiles] = useState<CustomFile[]>([]);

	const getIconByExtension = (extension: string) => {
		switch (extension) {
			case "doc":
			case "docx":
				return <Word sx={{ width: "32px", height: "32px" }} />;
			case "pdf":
				return <Pdf sx={{ width: "32px", height: "32px" }} />;
			case "xlmn":
				return <Excel sx={{ width: "32px", height: "32px" }} />;
			default:
				return <InsertDriveFileOutlined sx={{ fontSize: "32px" }} />;
		}
	};

	const handleDeleteFile = (file: CustomFile) => {
		setCustomFiles((pre) => pre.filter((f) => f.name !== file.name));
		setUploadingFiles((pre) => pre.filter((f) => f.name !== file.name));
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			setCustomFiles((pre) => {
				const uploadingFile = acceptedFiles.map((file) => {
					const extension = getExtensionByName(file.name);

					const customFile = {
						...file,
						extension: extension,
						name: file.name,
					};
					return customFile;
				});

				return uploadingFile;
			});
			setUploadingFiles(acceptedFiles);
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"*/*": [".pdf", ".docx", ".doc", ".txt"],
		},
		disabled: disabled,
	});

	useEffect(() => {
		if (uploadingFiles) {
			onChange && onChange(uploadingFiles);
		}
	}, [uploadingFiles, onChange]);

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: "20px",
			}}>
			<StyledUpload {...getRootProps()} size={size}>
				<input {...getInputProps()} />

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
					}}>
					<Archive
						sx={(theme) => ({
							fontSize:
								size === "large"
									? "5.4rem"
									: size === "small"
									? "4rem"
									: "4.8rem",
							color: theme.palette.grey[500],
						})}
					/>
					<Typography
						sx={{
							marginTop: "8px",
							fontSize:
								size === "large"
									? "1.6rem"
									: size === "small"
									? "1.2rem"
									: "1.4rem",
							color: (theme) => theme.palette.grey[600],
						}}>
						Vui lòng chọn hoặc kéo thả dữ liệu tại đây
					</Typography>
				</Box>
			</StyledUpload>

			<Grid
				container
				spacing={[2, 2]}
				sx={{
					maxHeight: "240px",
					overflow: "auto",
					margin: "0",
				}}>
				{customFiles && customFiles?.length > 0 ? (
					customFiles?.map((file, index) => (
						<Grid item xs={6} sm={4} md={3} key={index} sx={{}}>
							<Box
								sx={{
									position: "relative",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									marginBottom: "1rem",
								}}>
								{getIconByExtension(file.extension)}
								<Typography
									sx={{
										fontSize: "1.2rem",
										color: (theme) =>
											theme.palette.grey[600],
										wordBreak: "break-all",
										maxWidth: "100%",
									}}>
									{file.name}
								</Typography>
								<IconButton
									onClick={() => {
										handleDeleteFile(file);
									}}
									color="error"
									sx={{
										padding: 0,
										position: "absolute",
										top: "0",
										right: "0",
										transform: "translateY(-50%)",
									}}>
									<Close sx={{ fontSize: "1.6rem" }} />
								</IconButton>
							</Box>
						</Grid>
					))
				) : (
					<Grid item xs={12}>
						<Typography
							sx={{
								textAlign: "center",
								display: "block",
								margin: "auto",
								color: (theme) =>
									error
										? theme.palette.error.main
										: theme.palette.grey[600],
							}}>
							* Chưa có dữ liệu
						</Typography>
					</Grid>
				)}
			</Grid>
			<Button
				size={"small"}
				variant="outlined"
				onClick={(e) => {
					e.stopPropagation();
					setUploadingFiles([]);
					setCustomFiles([]);
					onChange([]);
				}}
				color="error"
				disabled={disabled || !uploadingFiles}
				startIcon={<Delete />}>
				Xóa tất cả
			</Button>
		</Box>
	);
};

export default UploadFile;
