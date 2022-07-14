import axios from "axios";
import type { AxiosInstance } from "axios";
import { processExpression } from "@vue/compiler-core";

const devUrl = "http://localhost:4000/video-library/api/";
const prodUrl = "https://gallantries.github.io/video-library/api/";

const apiClient: AxiosInstance = axios.create({
        // @ts-ignore
	baseURL: process.env.NODE_ENV === "production" ? prodUrl : devUrl,
	headers: {
		"Content-type": "application/json",
	},
});
export default apiClient;
