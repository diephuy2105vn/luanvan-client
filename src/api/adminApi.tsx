import axiosClient, { ApiResponse } from "@/config/axios";

const adminApi = {
	// GET /api/admin/message
	getMessages(params?: Record<string, any>, config?: object) {
		const url = "/api/admin/message";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	// GET /api/admin/user
	getUsers(params?: Record<string, any>, config?: object) {
		const url = "/api/admin/user";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	// GET /api/admin/file
	getAllFiles(params?: Record<string, any>, config?: object) {
		const url = "/api/admin/file";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	// GET /api/admin/order
	getOrders(params?: Record<string, any>, config?: object) {
		const url = "/api/admin/order";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	// DELETE /api/admin/order/{order_id}
	deleteOrder(order_id: string, config?: object) {
		const url = `/api/admin/order/${order_id}`;
		return axiosClient.delete(url, config) as ApiResponse;
	},
};

export default adminApi;