import axios from "axios";

export const http = axios.create({
  baseURL: "https://dragonball-api.com/api",
  timeout: 15000,
});
