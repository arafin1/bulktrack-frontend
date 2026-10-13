import axios from "axios"


const API = axios.create({

  baseURL: import.meta.env.REACT_APP_API_URL
    ? `${import.meta.env.REACT_APP_API_URL}/api/v1` 
    : "http://3.27.62.216/api/v1"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default API
