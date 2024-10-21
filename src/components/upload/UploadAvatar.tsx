import { getColorFromInitial, getInitials } from "@/utils";
import {
	Add,
	AddAPhotoOutlined,
	Close,
	Delete,
	HdrPlus,
	Height,
	PlusOneOutlined,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	IconButton,
	styled,
	Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const StyledUpload = styled(Box, {
	shouldForwardProp: (prop) => prop != "size",
})<{ size: "small" | "medium" | "large" }>(({ theme, size }) => ({
	height: size === "small" ? "148px" : size === "large" ? "180px" : "160px",
	width: size === "small" ? "148px" : size === "large" ? "180px" : "160px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	aspectRatio: "1",
	padding: size === "small" ? "6px" : size === "large" ? "12px" : "8px",
	borderRadius: "50%",
	border: "2px dashed #ccc",
	position: "relative",
}));

const UploadAvatar = ({
	value,
	onChange,
	alt = "Avatar",
	size = "medium",
	src,
	disabled = false,
}: {
	value?: File | null;
	onChange: (value: File | null) => void;
	src?: string;
	alt?: string;
	size?: "small" | "medium" | "large";
	disabled?: boolean;
}) => {
	const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | null>(
		src ? src : null
	);

	useEffect(() => {
		setAvatarSrc(src as string | ArrayBuffer | null);
	}, [src]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			const reader = new FileReader();
			onChange(file);
			reader.onloadend = () => {
				setAvatarSrc(reader.result);
			};

			reader.readAsDataURL(file);
		}
	}, []);
	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png"],
		},
		disabled: disabled,
	});
	const backgroundColor = !avatarSrc
		? getColorFromInitial(alt?.charAt(0))
		: undefined;

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: "16px",
			}}>
			<StyledUpload {...getRootProps()} size={size}>
				<input {...getInputProps()} />
				<Avatar
					src={avatarSrc ? (avatarSrc as string) : ""}
					sx={{
						backgroundColor: backgroundColor,
						width: "100%",
						height: "100%",
						color: "white",
						fontSize: "6.4rem",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					{!avatarSrc && (
						<Typography fontSize={64} fontWeight={300}>
							{getInitials(alt, 2)}
						</Typography>
					)}
				</Avatar>
				{!disabled && (
					<IconButton
						sx={{
							position: "absolute",
							width: "100%",
							height: "100%",
						}}
						disabled={disabled}>
						{!avatarSrc && (
							<AddAPhotoOutlined
								sx={{
									fontSize:
										size === "large"
											? "3.6rem"
											: size === "small"
											? "2.8rem"
											: "3.2rem",
								}}
							/>
						)}
					</IconButton>
				)}
			</StyledUpload>
			{!disabled && (
				<>
					<Typography
						sx={(theme) => ({
							fontWeight: "400",
							fontSize:
								size === "large"
									? "1.6rem"
									: size === "small"
									? "1.2rem"
									: "1.4rem",
							color: theme.palette.grey[600],
						})}>
						Vui lòng chọn hoặc kéo thả ảnh vào khung
					</Typography>

					<Button
						size={size === "small" ? "small" : "medium"}
						variant="outlined"
						onClick={(e) => {
							e.stopPropagation();
							setAvatarSrc(null);
							onChange(null);
						}}>
						Mặc định
					</Button>
				</>
			)}
		</Box>
	);
};
export default UploadAvatar;
