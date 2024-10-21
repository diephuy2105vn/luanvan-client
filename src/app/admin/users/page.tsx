"use client";

import useBreakpoint from "@/hooks/useBreakpoins";
import { Container, Typography } from "@mui/material";
import React from "react";

const Page = () => {
	const breakpoint = useBreakpoint();
	return (
		<Container>
			{breakpoint.sm && (
				<Typography variant="h5" sx={{ fontWeight: "500" }}>
					Nguời dùng
				</Typography>
			)}
			<Typography
				sx={(theme) => ({
					fontWeight: "500",
					fontSize: "1.6rem",
					color: theme.palette.grey[600],
				})}>
				Danh sách người dùng
			</Typography>
		</Container>
	);
};

export default Page;
