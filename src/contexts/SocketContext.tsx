"use client";

import { disconnect } from "process";
import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type defaultSocket = {
	socket: Socket | null;
	connect: (token: string) => void;
	disconnect: () => void;
};

const SocketContext = createContext<defaultSocket>({
	socket: null,
	connect: (token: string) => {},
	disconnect: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	const connect = (token: string) => {
		const socket = io("http://localhost:8000/", {
			query: { token },
			transports: ["websocket"],
			path: "/ws",
		});

		socket.on("connect", () => {
			console.log("Socket connected");
		});
		socket.on("disconnect", () => {
			console.log("Socket disconnected");
		});

		setSocket(socket);
	};

	const disconnect = () => {
		socket?.disconnect();
	};

	return (
		<SocketContext.Provider value={{ socket, connect, disconnect }}>
			{children}
		</SocketContext.Provider>
	);
};

export default SocketContext;
