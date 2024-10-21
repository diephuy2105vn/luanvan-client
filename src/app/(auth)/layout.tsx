"use client";

import { getUser } from "@/config/redux/userReducer";
import { useAppSelector } from "@/hooks/common";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const logedUser = useAppSelector((state) => getUser(state));

	useEffect(() => {
		if (logedUser?._id) {
			router.push("/");
		}
	}, [logedUser?._id]);
	return <div>{children}</div>;
}
