import React from 'react'
import Modal from '../../components/Modal/Modal'
import logo from '../../logo.svg'
import axios from '../../modules/axios/axios_wrapper'
import { useState, useEffect } from 'react'
import './login.scss'
import AuthContext from '../../contexts/AuthContext'
import { useAuth } from '../../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import LoadingSpinner from '../../components/Spinner/Spinner'
import 'react-toastify/dist/ReactToastify.min.css';

// const Cookies = require("js-cookie")
// import Cookies from '../../js.cookie.min.js'
// import { useCookies } from 'react-cookie'
import parseCookie from '../../services/utils'


const LoginPage: React.FC = () => {
    const authContext = React.useContext(AuthContext)
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();
    // const [cookies, setCookie, removeCookie] = useCookies([]);
    const cookies = parseCookie(document.cookie)
    const validateInput = ():string => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return 'Invalid Email'
        if (!password) return 'Please enter a Password'
        return ''
    }

    const login: Function = (e: Event):void => {
        e.preventDefault();
        if(validateInput()) {
            toast(validateInput(), {
                position: "top-right",
                progress: undefined,
                hideProgressBar: true,
                closeOnClick: true,
                closeButton: false,
                autoClose: 3000});
                return;
        }
        setIsLoading(true)
        axios.post("/auth/login", { email, password })
        .then(response => {
            // setAuthContext({...response.data.user, token: response.data.token})
            // authContext = {...response.data.user, response.data.token }
            auth?.setToken!("456467")
            document.cookie=`jwt=${response.data.token}`
            auth?.setUser!(response.data.user)
            console.log(auth?.token)
            navigate("/app")
        }).catch((e)=>{
            toast("Incorrect Credentials", {
                position: "top-right",
                progress: undefined,
                hideProgressBar: true,
                type: 'warning',
                closeOnClick: true,
                closeButton: false,
                autoClose: 3000});
        })
        .finally(()=> {
            setIsLoading(false)
        })
    }

    const signup: Function = (e: Event):void => {
        e.preventDefault();
        axios.post("/auth/login", { email, password })
        .then(response => {
            // setAuthContext({...response.data.user, token: response.data.token})
            // authContext = {...response.data.user, response.data.token }
            // auth?.setToken!("456467")
            auth?.setUser!(response.data.user)
            console.log(auth?.token)
            navigate("/app")
        })
    }

    async function loginFromCookies() {
        const jwt = cookies["jwt"]
        if(jwt){
            axios.get("/auth/user")
            .then(response => {
                auth?.setToken!(jwt)
                auth?.setUser!(response.data)
                navigate("/app")  
            })
        }
    }
    
    useEffect(() => {
        loginFromCookies()
    }, [])

    return (
        <div className="login-component">
            <div className="login-modal">
                <div className="top">
                    <img src={logo} alt="" />
                    <p className="modal-title">MATCHMAKER</p>
                </div>
                <div className="bottom">
                    <form>
                        <label>
                            <p>Email</p>
                            <input type="text" onChange={e => setEmail(e.target.value)}/>
                        </label>
                        <label>
                            <p>Password</p>
                            <input type="password" onChange={e => setPassword(e.target.value)}/>
                        </label>
                        <div className='form-actions'>
                            <div>
                                Don't Have an Account? 
                                <Link to="/login">
                                    <span> Signup here</span>
                                </Link>
                            </div>
                            <button className={`submit-button spinner-container`} type="submit" onClick={e => login(e)} disabled={isLoading}>
                                <span className={`${isLoading? 'hidden': null}`}>Login</span>
                                {
                                    isLoading?
                                    <LoadingSpinner/>: null
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default LoginPage;