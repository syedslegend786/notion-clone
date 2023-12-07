import Axios from "axios";

const instance = Axios.create({
  baseURL: process.env.BACKEND_MAIN_URL,
});

export { instance as axios };
