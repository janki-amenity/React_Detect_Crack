import axios from "axios";
import { toast } from "react-toastify";

const ApiImageCall = async ({
  url,
  method = "post",
  data = null,
  headers = {
    "Content-Type": "application/json",
  },
}) => {
  try {
    const Base_Url = process.env.REACT_APP_BASE_URL;
    // const Base_Url = "https://5317-49-36-69-121.ngrok-free.app/detect";
    const response = await axios({ method, url: Base_Url, data, headers });
    // console.log("response", response);
    if (response.status == 200 || response.status == 201) {
      if (method == "post" || method == "put") {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      return response.data;
    }
  } catch (error) {
    console.log("Axios Error ==>", error);
    return error;
  }
};

export default ApiImageCall;
