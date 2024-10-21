"use client";
import { Container, useTheme } from "@mui/material";
import React from "react";
import { FourSquare } from "react-loading-indicators";

const Loading = () => {
	const theme = useTheme();

	return (
		<Container
			sx={{
				width: "100vw",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<FourSquare
				color={theme.palette.primary.main}
				size="medium"
				text="Loading ..."
				textColor=""
			/>
		</Container>
	);
};

export default Loading;
