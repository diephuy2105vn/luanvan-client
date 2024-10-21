import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Cho phép tất cả các origin truy cập
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
	return response;
}

export const config = {
	matcher: "/aichat-script.js",
};
