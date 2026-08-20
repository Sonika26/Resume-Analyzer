import axios from "axios";

const apiResume = axios.create({
  baseURL: "http://localhost:5000",
});

export default apiResume;
