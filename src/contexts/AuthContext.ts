import { createContext } from 'react';
import { Person } from '../types/Person'
import React from 'react'


interface IAuthContext extends Person{
    token?: string
}

const defaultContext: IAuthContext = {
    token: "",
    firstName: "Christian",
    lastName: "Kassahun"
}


const AuthContext = React.createContext<IAuthContext | null>(defaultContext)

export default AuthContext;