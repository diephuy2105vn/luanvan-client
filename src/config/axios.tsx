"use client";
import { getCookie } from "@/utils/cookie";
import axios from "axios";
// import { CookieUtils } from "../utils/cookie";

export type ApiResponse = {
	[key: string]: any;
};

const axiosClient = axios.create({
	baseURL: "http://127.0.0.1:8000",
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use((config) => {
	const sessionToken = getCookie("SESSION");
	if (sessionToken && !config?.headers?.Authorization) {
		config.headers.Authorization = `Bearer ${sessionToken}`;
	}

	return config;
});

axiosClient.interceptors.response.use(
	(response: ApiResponse) => {
		return response.data;
	},
	(error) => {
		throw error.response.data.errors;
	}
);

export default axiosClient;
