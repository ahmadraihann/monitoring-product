import axios from "axios";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

const handleNotification = (
  type: NotificationType,
  title: string,
  text: string
) => {
  notification[type]({
    message: title,
    description: text,
  });
};

const request = axios.create({
  baseURL: "https://dummyjson.com",
});

request.interceptors.response.use(
  (response) => {
    if (response?.config?.method === "post") {
    } else if (response?.config?.method === "put") {
      handleNotification("success", "Success", "Data successfully updated");
    } else if (response?.config?.method === "delete") {
      handleNotification("success", "Success", "Data successfully deleted");
    }
    return response;
  },
  (error) => {
    handleNotification("error", "Error", "Something went wrong");
    return Promise.reject(error);
  }
);

export default request;
