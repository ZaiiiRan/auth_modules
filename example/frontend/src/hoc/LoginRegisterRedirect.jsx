/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

function LoginRegisterRedirect({children}) {
    const {store} = useContext(AuthContext)
    
    if (store.isAuth) {
        return <Navigate to='/' />
    }

    return (
        <>{children}</>
    )
}

export default observer(LoginRegisterRedirect)