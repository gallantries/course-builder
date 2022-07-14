import axios from "axios";
import type { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
	// baseURL: "https://gallantries.github.io/video-library/api/",
	baseURL: "http://localhost:4000/video-library/api/",
	headers: {
		"Content-type": "application/json",
	},
});
export default apiClient;
