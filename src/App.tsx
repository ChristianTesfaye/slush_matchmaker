import {useEffect} from 'react';
import React from 'react'
import logo from './logo.svg';
import Landing from './pages/landing/Landing';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import LoginPage from './pages/authentication/Login';
import SignupPage from './pages/authentication/Signup';
import AuthContext from './contexts/AuthContext';
import AuthProvider, { useAuth } from './providers/AuthProvider';
import Navbar from './components/Navbar/Navbar';
import Home from './layouts/Home/Home';
import axios from './modules/axios/axios_wrapper'
import { useNavigate, useLocation } from 'react-router-dom'
import RequestHistory from './pages/requests/RequestHistory';
// import Cookies from './js.cookie.min.js'

function App() {
  const auth = useAuth()
  // const navigate = useNavigate()
  // const location = useLocation()

  // useEffect(() => {

  return (
    <div>
      {/* <AuthContext.Provider value={initialAuthContext}> */}
      <AuthProvider>
        <div id="modal"></div>
        <BrowserRouter>
          <Routes>
            <Route path="/*">
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="app" element={<Home/>}>
                  <Route index element={<Landing />} />
                  <Route path="requests" element={<RequestHistory />} />
              </Route>
              <Route path="*"  element={<Navigate to="login" />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      {/* </AuthContext.Provider> */}
    </div>
  );
}

export default App;
