/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'

function AdminAuth({children}) {
    const {store} = useContext(AuthContext)
    console.log(store)
    if (store.isAuth && !store.user.roles.includes('ADMIN') || !store.isAuth) {
        return <Navigate to='/' />
    }

    return (
        <>{children}</>
    )
}

export default observer(AdminAuth)