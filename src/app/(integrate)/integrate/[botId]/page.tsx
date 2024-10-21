"use client";
import botApi from "@/api/botApi";
import { HEADER_HEIGHT_SM } from "@/components/common/Header";
import ChatBotFrame from "@/components/frame/ChatBotFrame";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase } from "@/types/bot";
import { Box, Container, Typography } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
	const { botId } = useParams();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [bot, setBot] = useState<BotBase | null>(null);

	const fecthBot = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const res = await botApi.getById(botId as string, config);
		setBot(res as BotBase);
	};

	useEffect(() => {
		fecthBot();
	}, []);

	return (
		<Container maxWidth={false} disableGutters={true}>
			<Box
				sx={{
					display: "flex",
					height: "100vh",
				}}>
				<Box sx={{ flex: 1 }}>
					{bot ? (
						<ChatBotFrame bot={bot} token={token} />
					) : (
						<Box
							sx={{
								height: "100%",
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								gap: "16px",
							}}>
							<Typography
								sx={(theme) => ({
									fontSize: "2rem",
									color: theme.palette.grey[700],
								})}>
								Không tìm thấy trợ lý AI
							</Typography>
						</Box>
					)}
				</Box>
			</Box>
		</Container>
	);
};

export default Page;
