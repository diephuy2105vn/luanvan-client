import axiosClient, { ApiResponse } from "@/config/axios";

const adminApi = {
  // GET /admin/message
  getMessages(params?: Record<string, any>, config?: object) {
    const url = "/admin/message";
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },

  // GET /admin/user
  getUsers(params?: Record<string, any>, config?: object) {
    const url = "/admin/user";
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },

  deleteUser(user_id: string, config?: object) {
    const url = `/admin/user/${user_id}`;
    return axiosClient.delete(url, config) as ApiResponse;
  },

  register(req: object, config?: object) {
    const url = "/user/register";
    return axiosClient.post(url, req, config) as ApiResponse;
  },

  // GET /admin/file
  getAllFiles(params?: Record<string, any>, config?: object) {
    const url = "/admin/file";
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },

  // GET /admin/order
  getOrders(params?: Record<string, any>, config?: object) {
    const url = "/admin/order";
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },

  // DELETE /admin/order/{order_id}
  deleteOrder(order_id: string, config?: object) {
    const url = `/admin/order/${order_id}`;
    return axiosClient.delete(url, config) as ApiResponse;
  },
};

export default adminApi;
