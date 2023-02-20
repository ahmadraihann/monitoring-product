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
    // console.log("response", response);
    if (response?.config?.method === "post") {
      //   if (
      //     response?.config?.url !== "login" &&
      //     response?.config?.url !== "import-xls"
      //   ) {
      //     handleNotification("success", "Success", "Data successfully added");
      //   }
    } else if (response?.config?.method === "put") {
      handleNotification("success", "Success", "Data successfully updated");
    } else if (response?.config?.method === "delete") {
      handleNotification("success", "Success", "Data successfully deleted");
    }
    return response;
  },
  (error) => {
    // console.log("Error", error);
    // if (!error?.response) {
    handleNotification("error", "Error", "Something went wrong");
    // }
    // if (error?.response?.data?.message) {
    //   handleNotification("error", "Error", error?.response?.data?.message);
    // }
    return Promise.reject(error);
  }
);

export default request;
