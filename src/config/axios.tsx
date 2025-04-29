"use client";
import { getCookie } from "@/utils/cookie";
import axios from "axios";
// import { CookieUtils } from "../utils/cookie";

export type ApiResponse = {
  [key: string]: any;
};
const url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const isDev = process.env.NODE_ENV === "development";

// Thêm /api vào baseURL nếu là dev
const baseURL = isDev ? url : `${url}/api`;

const axiosClient = axios.create({
  baseURL: baseURL,
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
