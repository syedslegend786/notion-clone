import Axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_MAIN_URL
    : "http://localhost:3000/api";
const instance = Axios.create({
  baseURL,
});

export { instance as axios };
