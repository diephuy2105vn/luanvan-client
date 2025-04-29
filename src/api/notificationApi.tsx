import axiosClient from "@/config/axios";

const notificationApi = {
  getAll(params?: Record<string, any>, config?: object) {
    const url = "/notification/";
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config });
  },

  delete(notification_id: string, config?: object) {
    const url = `/notification/${notification_id}`;
    return axiosClient.delete(url, config);
  },

  markAsRead(notification_id: string, config?: object) {
    const url = `/notification/${notification_id}/read`;
    return axiosClient.post(url, {}, config);
  },
};

export default notificationApi;
