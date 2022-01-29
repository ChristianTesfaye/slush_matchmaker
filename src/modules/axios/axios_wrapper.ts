import axios from "axios";
// import Cookies from "js-cookie"
// const Cookies = require('js-cookie')
// import Cookies from '../../js.cookie.min.js'
// import { useCookies } from "react-cookie";
import parseCookie from "../../services/utils";

var axiosInstance = axios.create()
// const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

axiosInstance.interceptors.request.use((config) => {
    const headers = { ...config.headers}
    const cookies = parseCookie(document.cookie)
    headers['Authorization']=`Bearer ${cookies['jwt']}`
    config.headers = headers
    console.log("HERE IS THE CONIFG", config)
    return config
})

export default axiosInstance;