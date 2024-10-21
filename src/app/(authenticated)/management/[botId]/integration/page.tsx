"use client";

import React, { useContext, useRef, useState } from "react";
import { Box, Button, styled, Switch, Fade, Typography } from "@mui/material";
import { CopyAllOutlined } from "@mui/icons-material";
import AlertContext from "@/contexts/AlertContext";
import { getCookie } from "@/utils/cookie";
import { useParams } from "next/navigation";

const StyledTextArea = styled("textarea")(({ theme }) => ({
	backgroundColor: "transparent",
	fontSize: "1.4rem",
	fontWeight: "500",
	[theme.breakpoints.down("sm")]: {
		fontSize: "1.2rem",
	},
}));

const Page = () => {
	const { showAlert } = useContext(AlertContext);
	const [token, setToken] = useState("");
	const { botId } = useParams();
	const [checkedSwitch, setCheckedSwitch] = useState(false);

	const textAreaScriptRef = useRef<HTMLTextAreaElement>(null);
	const textAreaIFrameRef = useRef<HTMLTextAreaElement>(null);

	const handleChangeSwitch = (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		setCheckedSwitch(checked);
		const token = getCookie("SESSION");
		if (token) {
			setToken(token);
		}
	};
	const handleCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			showAlert("Nội dung đã được sao chép!", "success");
		} catch (e) {
			showAlert("Đã có lỗi xảy ra", "error");
		}
	};

	return (
		<Box
			sx={{
				width: "100%",
				marginTop: "16px",
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				gap: "16px",
			}}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Typography sx={{ fontWeight: "500" }}>
					Tích hợp trợ lý AI vào trang web của bạn
				</Typography>
				<Switch
					onChange={handleChangeSwitch}
					sx={{ padding: "10px" }}
				/>
			</Box>

			{checkedSwitch && (
				<Fade in={checkedSwitch}>
					<Box
						sx={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}>
						<Box
							sx={{
								width: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								gap: "8px",
							}}>
							<Typography>
								Sao chép và dán mã bên dưới vào trang web của
								bạn
							</Typography>
							<Box
								sx={(theme) => ({
									borderRadius: "8px",
									width: {
										xs: "100%",
										md: "560px",
									},
									boxShadow: theme.shadows[1],
									backgroundColor: theme.palette.grey[200],
									padding: {
										xs: theme.spacing(1),
										md: theme.spacing(2),
									},
								})}>
								<StyledTextArea
									ref={textAreaScriptRef}
									rows={9}
									sx={{ width: "100%" }}
									spellCheck={false}
									readOnly={true}>
									{`<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
<script	id="codechat-script"
	src="http://localhost:3000/codechat-script.js"\ntoken="${token}"
	botToken="${botId}">
</script>`}
								</StyledTextArea>
							</Box>
							<Button
								color="inherit"
								variant="outlined"
								onClick={() => {
									const textToCopy =
										textAreaScriptRef.current?.value || "";
									handleCopy(textToCopy);
								}}
								startIcon={<CopyAllOutlined />}>
								Sao chép
							</Button>
						</Box>

						<Box
							sx={{
								width: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								gap: "8px",
							}}>
							<Typography>
								Nhúng trực tiếp khung chat vào trang web của bạn
							</Typography>
							<Box
								sx={(theme) => ({
									borderRadius: "8px",
									width: {
										xs: "100%",
										md: "100%",
									},
									boxShadow: theme.shadows[1],
									backgroundColor: theme.palette.grey[200],
									padding: {
										xs: theme.spacing(1),
										md: `${theme.spacing(
											2
										)} ${theme.spacing(4)}`,
									},
								})}>
								<StyledTextArea
									ref={textAreaIFrameRef}
									rows={10}
									sx={{ width: "100%" }}
									spellCheck={false}
									readOnly={true}>
									{`<iframe	id="integrate-iframe"
	scrolling="no"	loading="lazy"	
	frameborder="0"	allowfullscreen="true"
	style="width: 100%; border: none; height: 100%"
	src="http://localhost:3000/integrate/${botId}?token=${token}"
	allow="clipboard-read; clipboard-write; autoplay; encrypted-media; fullscreen; display-capture">
</iframe>`}
								</StyledTextArea>
							</Box>
							<Button
								color="inherit"
								variant="outlined"
								onClick={() => {
									const textToCopy =
										textAreaIFrameRef.current?.value || "";

									handleCopy(textToCopy);
								}}
								startIcon={<CopyAllOutlined />}>
								Sao chép
							</Button>
						</Box>
					</Box>
				</Fade>
			)}
		</Box>
	);
};

export default Page;
