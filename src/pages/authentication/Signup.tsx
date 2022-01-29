import React from 'react'
import Modal from '../../components/Modal/Modal'
import logo from '../../logo.svg'
import axios from '../../modules/axios/axios_wrapper'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './signup.scss'
import AuthContext from '../../contexts/AuthContext'
import { useAuth } from '../../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/Spinner/Spinner'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';

// const Cookies = require("js-cookie")
// import Cookies from '../../js.cookie.min.js'
// import { useCookies } from 'react-cookie'
// import parseCookie from '../../services/utils'


const SignupPage: React.FC = () => {
    // const [cookies, setCookie, removeCookie] = useCookies([]);
    const authContext = React.useContext(AuthContext)
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [organization, setOrganization] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const validateInput = ():string => {
        if (!firstName) return "Please enter your first name"
        if (!lastName) return "Please enter your last name"
        if (!organization) return "Please enter the organization your from"
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) return 'Invalid Email'
        if (!password || password.length < 8) return 'Password must be greater than 8 characters'
        
        return ''
    }

    const signup: Function = (e: Event):void => {
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
        setIsLoading(true);
        axios.post("/auth/signup", { email, password, firstName, lastName, organization })
        .then(response => {
            setEmail("")
            setPassword("")
            setFirstName("")
            setLastName("")
            setOrganization("")
            toast('Signed up successfully. Login to navigate to portal', {
                position: "top-right",
                progress: undefined,
                hideProgressBar: true,
                closeOnClick: true,
                type: 'success',
                closeButton: false,
                autoClose: 3000});

        }).catch((e) => {
            toast("Couldn't Create Account", {
                position: "top-right",
                progress: undefined,
                hideProgressBar: true,
                closeOnClick: true,
                closeButton: false,
                autoClose: 3000});
        }).finally(()=>{
            setIsLoading(false)
        })
    }

    useEffect(() => {

    }, [])

    return (
        <div className="login-component signup-component">
            <div className="login-modal">
                <div className="top">
                    <img src={logo} alt="" />
                    <p className="modal-title">MATCHMAKER</p>
                </div>
                <div className="bottom">
                    <form>
                        <label>
                            <p>First Name</p>
                            <input type="text" onChange={e => setFirstName(e.target.value)}/>
                        </label>
                        <label>
                            <p>Last Name</p>
                            <input type="text" onChange={e => setLastName(e.target.value)}/>
                        </label>
                        <label>
                            <p>Organization</p>
                            <input type="text" onChange={e => setOrganization(e.target.value)}/>
                        </label>
                        <label>
                            <p>Email</p>
                            <input type="email" onChange={e => setEmail(e.target.value)}/>
                        </label>
                        <label>
                            <p>Password</p>
                            <input type="password" onChange={e => setPassword(e.target.value)}/>
                        </label>

                        <div className='form-actions'>
                            <div>
                                Already Have an Account? 
                                <Link to="/login">
                                     Login here
                                </Link>
                            </div>
                            <button className={`submit-button spinner-container`} type="submit" onClick={e => signup(e)} disabled={isLoading}>
                                <span className={`${isLoading? 'hidden': null}`}>Signup</span>
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

export default SignupPage;