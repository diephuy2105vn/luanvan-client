"use client";

import botApi from "@/api/botApi";
import { getUser } from "@/config/redux/userReducer";
import { useAppSelector } from "@/hooks/common";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase, PermissionEnum } from "@/types/bot";
import { OnlyChildrenProps } from "@/types/common";
import {
	Info,
	IntegrationInstructionsSharp,
	Interests,
	People,
	Rule,
	Storage,
} from "@mui/icons-material";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const Layout = ({ children }: OnlyChildrenProps) => {
	const logedUser = useAppSelector((state) => getUser(state));

	const breakpoint = useBreakpoint();
	const pathname = usePathname();
	const { botId } = useParams();
	const [selectedTab, setSelectedTab] = useState(0);
	const [bot, setBot] = useState<BotBase | null>(null);
	const handleChangeTab = (_event: React.SyntheticEvent, newTab: number) => {
		setSelectedTab(newTab);
	};

	const fetchBot = async () => {
		const res = await botApi.getById(botId as string);
		setBot(res as BotBase);
	};

	// Hàm kiểm tra quyền truy cập
	const hasReadFilePermission = () => {
		return bot?.list_user_permission.some((userPermission) => {
			return (
				userPermission.user_id === logedUser?._id &&
				userPermission.permissions.includes(PermissionEnum.READ_FILE)
			);
		});
	};

	const hasReadUserPermission = () => {
		return bot?.list_user_permission.some((userPermission) => {
			return (
				userPermission.user_id === logedUser?._id &&
				userPermission.permissions.includes(PermissionEnum.READ_USER)
			);
		});
	};
	useEffect(() => {
		fetchBot();
	}, []);

	const tabs = useMemo(
		() =>
			[
				{
					label: "Thông tin",
					href: `/management/${botId}`,
					icon: Info,
				},
				hasReadFilePermission() && {
					label: "Dữ liệu",
					href: `/management/${botId}/data`,
					icon: Storage,
				},
				hasReadUserPermission() && {
					label: "Người dùng",
					href: `/management/${botId}/user`,
					icon: People,
				},
				{
					label: "Tích hợp",
					href: `/management/${botId}/integration`,
					icon: IntegrationInstructionsSharp,
				},
			].filter((tab) => !!tab),
		[logedUser, bot, botId]
	);

	useEffect(() => {
		if (botId) {
			const activeTabIndex = tabs.findIndex(
				(tab) => pathname === tab?.href
			);
			if (activeTabIndex !== -1) {
				setSelectedTab(activeTabIndex);
			}
		}
	}, [pathname, botId, tabs]);

	return (
		<Container sx={{ paddingTop: "16px" }}>
			{breakpoint.sm && (
				<Typography variant="h5" sx={{ fontWeight: "500" }}>
					Quản lý trợ lý AI
				</Typography>
			)}
			<Typography
				sx={(theme) => ({
					fontWeight: "500",
					fontSize: "1.6rem",
					color: theme.palette.grey[600],
				})}>
				Tạo trợ lý AI của bạn
			</Typography>
			<Tabs
				value={selectedTab}
				onChange={handleChangeTab}
				variant="scrollable"
				scrollButtons={false}
				sx={{
					margin: { xs: "0 0 10px", md: "10px 0 20px" },
					".MuiTabs-indicator": {
						height: "3px",
					},
				}}>
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						label={tab.label}
						component={Link}
						href={tab.href}
						icon={<tab.icon />}
						iconPosition="start"
						sx={{ minHeight: "60px" }}
					/>
				))}
			</Tabs>
			{children}
		</Container>
	);
};

export default Layout;
