"use client";

import React, { ReactNode } from "react";
import Sidebar from "@/components/common/SlideBar";
import { Container, Box } from "@mui/material";
import { OnlyChildrenProps } from "@/types/common";
import { SIDEBAR_WIDTH } from "@/theme";
import { styled } from "@mui/material";
import Header from "@/components/common/Header";
import useBreakpoint from "@/hooks/useBreakpoins";
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
	open?: boolean;
}>(({ theme, open }) => {
	return {
		flexGrow: 1,
		minHeight: "100vh",
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),

		marginLeft: "0px",
		[theme.breakpoints.up("sm")]: {
			marginLeft: `calc(${theme.spacing(8)} + 1px)`,
		},
		...(open && {
			transition: theme.transitions.create("margin", {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),

			[theme.breakpoints.up("sm")]: {
				marginLeft: `${SIDEBAR_WIDTH}px`,
			},
			[theme.breakpoints.down("sm")]: {
				marginLeft: `0px`,
			},
		}),
	};
});

const DefaultLayout = ({ children }: OnlyChildrenProps) => {
	const [openSidebar, setOpenSidebar] = React.useState(false);

	const breakpoint = useBreakpoint();
	const handleSidebarOpen = () => {
		setOpenSidebar(true);
	};

	const handleSidebarClose = () => {
		setOpenSidebar(false);
	};
	return (
		<Container maxWidth={false} disableGutters={true}>
			<Sidebar
				open={openSidebar}
				setOpen={setOpenSidebar}
				handleOpen={handleSidebarOpen}
				handleClose={handleSidebarClose}
			/>
			<Main open={openSidebar}>
				{!breakpoint.sm && (
					<Header
						openSidebar={openSidebar}
						handleOpenSidebar={handleSidebarOpen}
					/>
				)}
				{children}
			</Main>
		</Container>
	);
};

export default DefaultLayout;
