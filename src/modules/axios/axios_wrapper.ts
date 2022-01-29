import axios from "axios";
// import Cookies from "js-cookie"
const Cookies = require('js-cookie')

var axiosInstance = axios.create()

axiosInstance.interceptors.request.use((config) => {
    const headers = { ...config.headers}
    headers['Authorization']=`Bearer ${Cookies.get('jwt')}`
    config.headers = headers
    console.log("HERE IS THE CONIFG", config)
    return config
})

export default axiosInstance;