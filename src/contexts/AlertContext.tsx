"use client";

import { Alert, Snackbar } from "@mui/material";
import React from "react";

type AlertContextType = {
	showAlert: (
		message: string,
		severity: "success" | "info" | "warning" | "error"
	) => void;
};

const AlertContext = React.createContext<AlertContextType>({
	showAlert: () => {},
});

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
	const [message, setMessage] = React.useState<string | null>(null);
	const [severity, setSeverity] = React.useState<
		"success" | "info" | "warning" | "error"
	>();
	const [open, setOpen] = React.useState<boolean>(false);
	const showAlert = (
		message: string,
		severity: "success" | "info" | "warning" | "error"
	) => {
		setOpen(true);
		setSeverity(severity);
		setMessage(message);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			<Snackbar
				open={open}
				autoHideDuration={severity === "error" ? 5000 : 3000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}>
				<Alert severity={severity}>{message}</Alert>
			</Snackbar>
		</AlertContext.Provider>
	);
};

export default AlertContext;
