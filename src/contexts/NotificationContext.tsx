"use client";
import { NotificationBase } from "@/types/notification";
import React, { createContext, useState } from "react";

const NotificationContext = createContext<{
	notifications: NotificationBase[];
	setNotifications: React.Dispatch<React.SetStateAction<NotificationBase[]>>;
}>({
	notifications: [],
	setNotifications: () => {},
});

export const NotificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [notifications, setNotifications] = useState<NotificationBase[]>([]);
	return (
		<NotificationContext.Provider
			value={{ notifications, setNotifications }}>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationContext;
