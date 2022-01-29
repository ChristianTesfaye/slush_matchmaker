import { createContext } from 'react';
import { Person } from '../../types/Person'
import React from 'react'


export interface IAuthContext extends Person{
    token?: string
}
