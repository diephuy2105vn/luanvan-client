"use client";

import userApi from "@/api/userApi";
import notificationApi from "@/api/notificationApi";
import AdminLayout from "@/components/layout/AdminLayout";

import {
	getUserPack,
	getUser,
	setUserPack,
	setUser,
} from "@/config/redux/userReducer";
import NotificationContext from "@/contexts/NotificationContext";
import SocketContext from "@/contexts/SocketContext";
import { useAppSelector } from "@/hooks/common";
import { UserBase, UserPackageInfo } from "@/types/user";
import { getCookie } from "@/utils/cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();

	const dispatch = useDispatch();
	const { socket, connect, disconnect } = useContext(SocketContext);
	const { setNotifications } = useContext(NotificationContext);
	const user = useAppSelector((state) => getUser(state));
	const userPack = useAppSelector((state) => getUserPack(state));
	const searchParams = useSearchParams();
	const tokenPamram = searchParams.get("token");

	const refreshUser = async () => {
		try {
			const res = await userApi.refresh();
			dispatch(setUser(res as UserBase));
		} catch (err) {
			router.push("/login");
		}
	};

	const fetchNotifications = async () => {
		try {
			const res = await notificationApi.getAll();
			setNotifications(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const token = tokenPamram ? tokenPamram : getCookie("SESSION");
		refreshUser();
		if (!token) {
			router.push("/login");
		} else {
			fetchNotifications();
			connect(token);
		}

		return () => {
			disconnect();
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("notification", (data) => {
				console.log(data);
				setNotifications((pre) => [...pre, data.notification]);
			});
		}
	}, [socket]);

	useEffect(() => {
		const fetchPackage = async () => {
			const res = await userApi.getPackageInfo();
			dispatch(setUserPack(res as UserPackageInfo));
		};

		if (user) {
			if (user?.role != "admin") {
				router.push("/login");
			}
			fetchPackage();
		}
	}, [user]);

	return (
		<AdminLayout>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				{children}
			</LocalizationProvider>
		</AdminLayout>
	);
}
