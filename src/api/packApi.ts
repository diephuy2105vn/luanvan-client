import axiosClient, { ApiResponse } from "@/config/axios";

const packApi = {
  getAll(params?: Record<string, any>, config?: object) {
    const url = "/api/package/";
    for (const key in params) {
      if (params[key] === "") {
        delete params[key];
      }
    }
    return axiosClient.get(url, { params, ...config }) as ApiResponse;
  },

  create(req: object, config?: object) {
    const url = "/api/package/";
    return axiosClient.post(url, req, {
      ...config,
      headers: {
        "Content-Type": "application/json",
      },
    }) as ApiResponse;
  },

  update(package_id: string, req: object, config?: object) {
    const url = `/api/package/${package_id}`;
    return axiosClient.put(url, req, {
      ...config,
      headers: {
        "Content-Type": "application/json",
      },
    }) as ApiResponse;
  },
  delete(package_id: string, req: object, config?: object) {
    const url = `/api/package/${package_id}`;
    return axiosClient.delete(url) as ApiResponse;
  },
};

export default packApi;
