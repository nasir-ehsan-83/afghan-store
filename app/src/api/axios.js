import axios from "axsio";

export const api = axios.create({
    baseURL: "http://localhost:3500s/api"
});
