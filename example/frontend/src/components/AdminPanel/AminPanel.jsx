import { useEffect, useState } from 'react'
import AdminService from '../../services/AdminService'

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        const getUsers = async () => {
            const response = await AdminService.fetchUsers()
            console.log(response.data)
            setUsers(response.data)
        }
        getUsers()
    }, [])
    return (
        <>
            <h1>ADMIN</h1>
            {
                users.map(user => <div key={user.username}>{user.username}</div>)
            }
        </>
    )
}