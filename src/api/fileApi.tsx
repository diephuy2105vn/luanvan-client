import axiosClient, { ApiResponse } from "@/config/axios";

const fileApi = {
	getAll(params?: Record<string, any>, config?: object) {
		const url = "/api/file/";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},
	getDeleted(params?: Record<string, any>, config?: object) {
		const url = "/api/file/deleted";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	upload(req: object, config?: object) {
		const url = "/api/file/";
		return axiosClient.post(url, req, {
			...config,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	getById(file_id: string, config?: object) {
		const url = `/api/file/${file_id}`;
		return axiosClient.get(url, config) as ApiResponse;
	},

	download(file_id: string, config?: object) {
		const url = `/api/file/download/${file_id}`;
		return axiosClient.get(url, {
			responseType: "blob",
			...config,
		}) as ApiResponse;
	},

	deleteByIds(file_ids: string[], config?: object) {
		const url = `/api/file/list_id`;
		return axiosClient.delete(url, {
			data: file_ids,
			...config,
		}) as ApiResponse;
	},

	hardDeleteByIds(file_ids: string[], config?: object) {
		const url = `/api/file/hard_delete/list_id`;
		return axiosClient.delete(url, {
			data: file_ids,
			...config,
		}) as ApiResponse;
	},
};

export default fileApi;
