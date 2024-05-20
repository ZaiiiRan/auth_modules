/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { Navigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import useAuth from '../hooks/useAuth'

function AdminAuth({children}) {
    const store = useAuth()
    if (store.isAuth && !store.user.roles.includes('ADMIN') || !store.isAuth) {
        return <Navigate to='/' />
    }

    return (
        <>{children}</>
    )
}

export default observer(AdminAuth)