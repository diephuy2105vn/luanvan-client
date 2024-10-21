"use client";
import botApi from "@/api/botApi";
import { BotBase } from "@/types/bot";
import { getColorFromInitial, getInitials } from "@/utils";
import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

const StyledChatBotCard = styled(Box, {
	shouldForwardProp: (props) => props != "active",
})<{ active: boolean }>(({ theme, active }) => ({
	padding: `${theme.spacing(2.5)} ${theme.spacing(2)}`,
	display: "flex",
	alignItems: "center",
	gap: "16px",
	color: "black",
	backgroundColor: active
		? `rgba(${theme.palette.secondary.rgb}, 0.2)`
		: "white",
}));

const ChatBotCard = ({
	bot,
	active = false,
}: {
	bot: BotBase;
	active?: boolean;
}) => {
	const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | null>(
		null
	);

	const fetchAvatar = async () => {
		if (bot?._id && bot.avatar_source) {
			const res = await botApi.getAvatar(bot?._id);
			const reader = new FileReader();

			reader.onloadend = () => {
				const base64data = reader.result;
				setAvatarSrc(base64data);
			};
			reader.readAsDataURL(res as Blob);
		}
	};

	useEffect(() => {
		fetchAvatar();
	}, [bot._id]);

	const backgroundColor = !bot?.avatar_source
		? getColorFromInitial(bot.name?.charAt(0))
		: undefined;

	return (
		<StyledChatBotCard active={active}>
			<Avatar
				sx={{
					width: "36px",
					height: "36px",
					backgroundColor: backgroundColor,
				}}
				src={avatarSrc ? (avatarSrc as string) : ""}>
				{!avatarSrc && (
					<Typography fontSize={14} fontWeight={500}>
						{getInitials(bot?.name, 2)}
					</Typography>
				)}
			</Avatar>
			<Typography sx={{ fontSize: "1.4rem", fontWeight: "500" }}>
				{bot?.name}
			</Typography>
		</StyledChatBotCard>
	);
};

export default React.memo(ChatBotCard);
