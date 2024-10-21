"use client";

import useBreakpoint from "@/hooks/useBreakpoins";
import { OnlyChildrenProps } from "@/types/common";
import {
	DeleteRounded,
	EditRounded,
	InsertDriveFile,
} from "@mui/icons-material";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const Layout = ({ children }: OnlyChildrenProps) => {
	const breakpoint = useBreakpoint();
	const pathname = usePathname();
	const [selectedTab, setSelectedTab] = useState(0);

	const handleChangeTab = (_event: React.SyntheticEvent, newTab: number) => {
		setSelectedTab(newTab);
	};

	const tabs = useMemo(
		() =>
			[
				{
					label: "Dữ liệu",
					href: `/data/`,
					icon: InsertDriveFile,
				},

				// {
				// 	label: "Soạn thảo",
				// 	href: `/data/create`,
				// 	icon: EditRounded,
				// },
				{
					label: "Thùng gác",
					href: `/data/trash`,
					icon: DeleteRounded,
				},
			].filter((tab) => !!tab),
		[]
	);

	useEffect(() => {
		const activeTabIndex = tabs?.findIndex((tab) => pathname === tab?.href);
		if (activeTabIndex !== -1) {
			setSelectedTab(activeTabIndex);
		}
	}, [pathname, tabs]);

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
