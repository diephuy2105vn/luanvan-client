import axiosClient, { ApiResponse } from "@/config/axios";

const chatHistoryApi = {
  getChatsByBotId(
    bot_id: string,
    params?: Record<string, any>,
    config?: object
  ) {
    const url = `/chat_history/${bot_id}`;
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },
  joinChat(bot_id: string, params?: Record<string, any>, config?: object) {
    const url = `/chat_history/join_chat_bot/${bot_id}`;
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },

  deleteChat(chat_id: string, config?: object) {
    const url = `/chat_history/${chat_id}`;
    return axiosClient.delete(url, config);
  },

  getMessages(chat_id: string, params?: Record<string, any>, config?: object) {
    const url = `/chat_history/${chat_id}/messages`;
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config });
  },
};

export default chatHistoryApi;
