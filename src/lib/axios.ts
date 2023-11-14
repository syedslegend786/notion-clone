import axios from "axios";
axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_MAIN_URL
    : "http://localhost:3000/api";
export { axios };
