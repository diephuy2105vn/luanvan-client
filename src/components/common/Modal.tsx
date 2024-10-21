"use client";

import { Backdrop, Box, Fade, Modal, styled } from "@mui/material";

import * as React from "react";

const StyledModalBox = styled(Box, {
	shouldForwardProp: (prop) => prop !== "size",
})<{ size: "small" | "medium" | "large" }>(({ theme, size }) => ({
	backgroundColor: "white",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	minWidth: "400px",
	maxWidth: "100%",
	boxShadow: theme.shadows[3],
	position: "absolute",
	padding: size === "small" ? "12px" : size === "large" ? "20px" : "16px",
	borderRadius: size === "small" ? "4px" : size === "large" ? "8px" : "6px",
}));

const CustomModal = ({
	children,
	open,
	onClose,
	size = "medium",
}: {
	children: React.ReactNode;
	open: boolean;
	onClose: () => void;
	size?: "small" | "medium" | "large";
}) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0,0.05)",
					},
				},
			}}>
			<Fade in={open}>
				<StyledModalBox size={size}>{children}</StyledModalBox>
			</Fade>
		</Modal>
	);
};

export default CustomModal;
