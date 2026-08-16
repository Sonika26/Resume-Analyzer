import axios from "axios";

const apiResume = axios.create({
  baseURL: "http://localhost:5000/api/resume",
});

export default apiResume;
