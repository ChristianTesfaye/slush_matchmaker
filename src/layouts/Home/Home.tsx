import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom'
import './home.scss'
import { useAuth } from '../../providers/AuthProvider';
const Home = () => {

    return (
        <div className="home-component">
            <Navbar></Navbar>
            <div className="main">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Home