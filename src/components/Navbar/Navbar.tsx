import React from 'react'
import {Link} from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import axios from '../../modules/axios/axios_wrapper'
import "./navbar.scss"
import { useNavigate } from 'react-router-dom'

// const Cookies = require('js-cookie')
// import Cookies from '../../js.cookie.min.js'
// import {useCookies} from 'react-cookie'
import parseCookie from '../../services/utils'

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    // const [cookies, setCookie, removeCookie] = useCookies([]);

    const logout: Function = (e: Event):void => {
        e.preventDefault();
        axios.delete("/auth/logout")
        .then(response => {
            document.cookie="jwt="
            auth?.setUser!(null)
            navigate("/login")
        })
    }

    const auth = useAuth();
    return (
        <div className='navbar-component'>
            <div className="left">
                <Link to='/app'  className='nav-item'>
                    {auth?.firstName || "Matchmaker"} {auth?.lastName ||  "app"}
                </Link>
            </div>
            <div className="right">
                <div>
                    <Link to="/app/requests" className='nav-item'>
                        Requests
                    </Link>
                </div>
                <div>
                    <button className='nav-item' onClick={e => logout(e)}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;