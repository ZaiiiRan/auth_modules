/* eslint-disable react/prop-types */
import { createContext } from 'react'
import Store from '../store/authStore.js'

const store = new Store()

export const AuthContext = createContext({
    store
})

export function AuthProvider({children}) {

    return (
        <AuthContext.Provider value={{store}}>
            {children}
        </AuthContext.Provider>
    )
}