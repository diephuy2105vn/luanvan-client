import axiosClient, { ApiResponse } from "@/config/axios";

const botApi = {
	getAll(params?: Record<string, any>, config?: object) {
		const url = "/api/bot/";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},
	getPublic(params?: Record<string, any>, config?: object) {
		const url = "/api/bot/public";
		for (const key in params) {
			if (params[key] === "") {
				delete params[key];
			}
		}
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},
	getAvatar(bot_id: string, timestamp?: number, config?: object) {
		const url = timestamp
			? `/api/bot/${bot_id}/avatar?reset_cache=${timestamp}`
			: `/api/bot/${bot_id}/avatar`;

		return axiosClient.get(url, {
			...config,
			responseType: "blob",
		}) as ApiResponse;
	},

	create(req: object, config?: object) {
		const url = "/api/bot/";
		return axiosClient.post(url, req, {
			...config,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}) as ApiResponse;
	},

	getById(bot_id: string, config?: object) {
		const url = `/api/bot/${bot_id}`;
		return axiosClient.get(url, config) as ApiResponse;
	},

	update(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}`;
		return axiosClient.put(url, req, config) as ApiResponse;
	},

	uploadAvatar(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/upload_avatar`;
		return axiosClient.put(url, req, {
			...config,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}) as ApiResponse;
	},

	delete(bot_id: string, config?: object) {
		const url = `/api/bot/${bot_id}`;
		return axiosClient.delete(url, config) as ApiResponse;
	},

	toggleFavorite(bot_id: string, config?: object) {
		const url = `/api/bot/${bot_id}/favorite`;
		return axiosClient.post(url, {}, config) as ApiResponse;
	},

	getListUserByBotId(bot_id: string, config?: object) {
		const url = `/api/bot/${bot_id}/list_user`;
		return axiosClient.get(url, config) as ApiResponse;
	},

	inviteUser(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/invite_user`;
		return axiosClient.post(url, req, config);
	},

	confirmInviteUser(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/confirm_invite_user`;
		return axiosClient.post(url, req, config);
	},

	declineInviteUser(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/decline_invite_user`;
		return axiosClient.post(url, req, config);
	},

	editUserPermission(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/edit_user`;
		return axiosClient.put(url, req, config) as ApiResponse;
	},

	deleteUserPermission(bot_id: string, user_id: string, config?: object) {
		const url = `/api/bot/${bot_id}/delete_user/${user_id}`;
		return axiosClient.delete(url, config) as ApiResponse;
	},

	getListFiles(bot_id: string, params: object, config?: object) {
		const url = `/api/bot/${bot_id}/list_file`;
		return axiosClient.get(url, { params, ...config }) as ApiResponse;
	},

	addFiles(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/add_files`;
		return axiosClient.post(url, req, config);
	},

	uploadFiles(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/upload_files`;
		return axiosClient.post(url, req, {
			...config,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	deleteFiles(bot_id: string, req: object, config?: object) {
		const url = `/api/bot/${bot_id}/delete_files`;
		return axiosClient.put(url, req, config);
	},

	getListChatHistories(bot_id: string, config?: object) {
		const url = `/api/bot/${bot_id}/list_chat`;
		return axiosClient.get(url, config);
	},

	deleteChat(bot_id: string, chat_id: string, config?: object) {
		const url = `/api/bot/${bot_id}/delete_chat/${chat_id}`;
		return axiosClient.delete(url, config);
	},
};

export default botApi;
