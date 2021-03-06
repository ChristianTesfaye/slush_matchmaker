
import * as React from "react";
import { Person } from "../types/Person";
import { useEffect } from 'react'
import axios from "../modules/axios/axios_wrapper";
import { useLocation, useNavigate } from 'react-router-dom'
import parseCookie from '../services/utils'
// const Cookies = require('js-cookie')
// import Cookies from '../js.cookie.min.js'
// import { useCookies } from 'react-cookie'

interface AuthContextInterface extends Person{
  token?: string,
  setUser?: React.Dispatch<React.SetStateAction<Person | null>>,
  setToken?: React.Dispatch<React.SetStateAction<string>>
}

const AuthContext = React.createContext<AuthContextInterface | null>(null);

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }: Props) => {
    const [user, setUser] = React.useState<Person | null>(null);
    const [token, setToken ] = React.useState("")
    // const [cookies, setCookie, removeCookie] = useCookies([]);
    const cookies = parseCookie(document.cookie)

    async function loginFromCookies() {
        const jwt = cookies["jwt"]
        if(jwt){
            axios.get("/auth/user")
            .then(response => {
                console.log("USER: ",response)
                setToken(jwt)
                setUser(response.data)
            })
        }else{
            if(window.location.pathname.indexOf('app') > 0){
                window.location.pathname = "/login"
            }
        }
    }
    
    useEffect(() => {
        loginFromCookies()
    }, [])

    return (
        <AuthContext.Provider value={{ ...user, token, setUser, setToken}}>
        {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => React.useContext(AuthContext);
