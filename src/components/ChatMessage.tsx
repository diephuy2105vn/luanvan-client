import AlertContext from "@/contexts/AlertContext";
import { roboto } from "@/theme";
import type { ChatMessage } from "@/types/chat_message";
import { ContentCopy } from "@mui/icons-material";
import {
	Box,
	Container,
	IconButton,
	styled,
	TextareaAutosize,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
enum MessageEnum {
	MESSAGE_ANSWER = "MESSAGE_ANSWER",
	MESSAGE_QUESTION = "MESSAGE_QUESTION",
}

const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
	width: "100%",
	backgroundColor: "transparent",
	color: theme.palette.common.black,
	fontFamily: roboto.style.fontFamily,
	fontSize: "1.6rem",
}));

const StyledChatMessage = styled(Box, {
	shouldForwardProp: (prop) => prop !== "type",
})<{ type: MessageEnum }>(({ theme, type }) => ({
	marginTop: "8px",
	marginLeft: type === MessageEnum.MESSAGE_QUESTION ? "auto" : "0",
	marginRight: type === MessageEnum.MESSAGE_ANSWER ? "auto" : "0",
	padding: `${theme.spacing(2.5)} ${theme.spacing(2)} ${theme.spacing(0.5)}`,
	backgroundColor:
		type === MessageEnum.MESSAGE_QUESTION
			? `rgba(${theme.palette.primary.rgb}, 0.3)`
			: `rgba(${theme.palette.secondary.rgb}, 0.3)`,
	borderRadius:
		type === MessageEnum.MESSAGE_QUESTION
			? `16px 16px 4px 16px`
			: `16px 16px 16px 4px`,
	minWidth: "160px",
	maxWidth: "65%",
}));

const StyledLoading = styled("div")(({ theme }) => ({
	display: "flex",
	gap: "8px",
	padding: ` ${theme.spacing(2.5)} ${theme.spacing(1)}`,
	//Style loading dot
	"& .loading_dot": {
		height: "12px",
		width: "12px",
		backgroundColor: theme.palette.secondary.main,
		borderRadius: "50%",
		animation: "loading 1.5s infinite",
	},
	"& .loading_dot:nth-of-type(1)": {
		animationDelay: "0s",
	},
	"& .loading_dot:nth-of-type(2)": {
		animationDelay: "0.3s",
	},
	"& .loading_dot:nth-of-type(3)": {
		animationDelay: "0.6s",
	},
	"@keyframes loading": {
		"0%, 100%": {
			opacity: 0.2,
		},
		"50%": {
			opacity: 1,
		},
	},
}));

const ChatMessage = ({
	key,
	message,
}: {
	key?: string;
	message: ChatMessage;
}) => {
	const { showAlert } = useContext(AlertContext);
	const handleCopyText = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			showAlert("Nội dung đã được sao chép thành công!", "success");
		} catch (err) {
			showAlert("Sao chép thất bại: ", "error");
		}
	};

	const source = message.source;

	return (
		<Container
			key={key}
			maxWidth={false}
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
			}}>
			{message.question && (
				<StyledChatMessage
					type={MessageEnum.MESSAGE_QUESTION}
					sx={{ position: "relative" }}>
					<StyledTextareaAutosize value={message.question} />
					<Typography
						sx={{
							opacity: "0",
							userSelect: "none",
							fontSize: "1.2rem",
							height: "0px",
						}}>
						{message.question}
					</Typography>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}>
						<IconButton
							sx={{ transform: "translateX(-25%)" }}
							size="small"
							onClick={() => handleCopyText(message.question)}>
							<ContentCopy sx={{ fontSize: "1.4rem" }} />
						</IconButton>
					</Box>
				</StyledChatMessage>
			)}
			{message.loading ? (
				<StyledLoading>
					<span className="loading_dot" />
					<span className="loading_dot" />
					<span className="loading_dot" />
				</StyledLoading>
			) : (
				message.answer && (
					<StyledChatMessage
						type={MessageEnum.MESSAGE_ANSWER}
						sx={{ position: "relative" }}>
						<StyledTextareaAutosize value={message.answer} />
						<Typography
							sx={{
								height: "0px",
								overflow: "hidden",
								opacity: "0",
								userSelect: "none",
								fontSize: "1.2rem",
							}}>
							{message.answer}
						</Typography>
						<Typography>{message.suggest_question}</Typography>

						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							{source ? (
								<Box
									sx={{
										display: "flex",
										gap: "4px",
									}}>
									<Typography sx={{ fontSize: "1.4rem" }}>
										Nguồn:
									</Typography>
									<Link
										href={`/file/${source.file_id}`}
										target="_blank"
										rel="noopener noreferrer">
										<Typography
											sx={{
												fontSize: "1.4rem",
												display: "inline",
												color: (theme) =>
													theme.palette.info.dark,
											}}>
											{source.file_name}
										</Typography>
									</Link>
								</Box>
							) : (
								<span></span>
							)}
							<IconButton
								sx={{ transform: "translateX(25%)" }}
								size="small"
								onClick={() => handleCopyText(message.answer)}>
								<ContentCopy sx={{ fontSize: "1.4rem" }} />
							</IconButton>
						</Box>
					</StyledChatMessage>
				)
			)}
		</Container>
	);
};

export default ChatMessage;
