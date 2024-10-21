"use client";

import userApi from "@/api/userApi";

import { setUser } from "@/config/redux/userReducer";
import SocketContext from "@/contexts/SocketContext";
import { UserBase } from "@/types/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const dispatch = useDispatch();
	const { socket, connect, disconnect } = useContext(SocketContext);

	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const refreshUser = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await userApi.refresh(config);
			dispatch(setUser(res as UserBase));
		} catch (err) {
			return;
		}
	};

	useEffect(() => {
		refreshUser();
		if (token) {
			connect(token);
		}

		return () => {
			disconnect();
		};
	}, []);

	useEffect(() => {
		if (socket) {
			console.log("Sockets connected");
		}
	}, [socket]);

	return <div id="codechat_integrate">{children}</div>;
}
