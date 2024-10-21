import axiosClient, { ApiResponse } from "@/config/axios";

const userApi = {
	login(req: object, config?: object) {
		const url = "/api/user/login";
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};

		return axiosClient.post(url, req, {
			...config,
			headers,
		}) as ApiResponse;
	},

	register(req: object, config?: object) {
		const url = "/api/user/register";
		return axiosClient.post(url, req, config) as ApiResponse;
	},

	refresh(config?: object) {
		const url = "/api/user/refresh";
		return axiosClient.get(url, config) as ApiResponse;
	},
	getAll(params: object, config?: object) {
		const url = "/api/user/";
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	getAvatar(user_id: string, timestamp?: number, config?: object) {
		const url = timestamp
			? `/api/user/${user_id}/avatar?reset_cache=${timestamp}`
			: `/api/user/${user_id}/avatar`;

		return axiosClient.get(url, {
			...config,
			responseType: "blob",
		}) as ApiResponse;
	},

	update: (req: object, config?: object) => {
		const url = `/api/user/`;
		return axiosClient.put(url, req, config) as ApiResponse;
	},

	uploadAvatar(req: object, config?: object) {
		const url = `/api/user/upload_avatar`;
		return axiosClient.put(url, req, {
			...config,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}) as ApiResponse;
	},
	getPackageInfo: (config?: object) => {
		const url = `api/user/package_info`;
		return axiosClient.get(url, { ...config }) as ApiResponse;
	},
	buyPackage(package_id: string, config?: object) {
		const url = `api/user/buy_package/${package_id}`;
		return axiosClient.post(url, {}, { ...config }) as ApiResponse;
	},
};

export default userApi;