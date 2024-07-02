import { AuthContext } from '../hoc/AuthProvider'
import { useContext } from 'react'

export default function useAuth() {
    const { store } = useContext(AuthContext)
    return store
}