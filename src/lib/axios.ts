import Axios from "axios";

const instance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_MAIN_URL,
});

export { instance as axios };
