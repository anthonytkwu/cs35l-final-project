import axios from "axios"
import { ACCESS_TOKEN } from "./config"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    
)