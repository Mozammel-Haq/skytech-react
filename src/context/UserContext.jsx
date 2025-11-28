import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'


const UserContext = createContext()


export function UserProvider({ children }) {
const BASE_URL = import.meta.env.VITE_BASE_API_URL


const [allUsers, setAllUsers] = useState([])
const [loading, setLoading] = useState(true)


// Fetch all users once
useEffect(() => {
const fetchUsers = async () => {
try {
const res = await axios.get(`${BASE_URL}/testuser`)
const users = Array.isArray(res.data?.all_users) ? res.data.all_users : []
setAllUsers(users)
} catch (err) {
setAllUsers([])
} finally {
setLoading(false)
}
}


fetchUsers()
}, [])


// Derived lists
const adminUsers = allUsers.filter((u) => {
const rid = String(u?.role_id ?? '').trim()
return rid === '1' || rid === '2' || u?.role === 'admin' || u?.role === 'super_admin'
})


const customerUsers = allUsers.filter((u) => {
const rid = String(u?.role_id ?? '').trim()
return rid === '3' || u?.role === 'customer'
})


return (
<UserContext.Provider
value={{ allUsers, adminUsers, customerUsers, setAllUsers, loading }}
>
{children}
</UserContext.Provider>
)
}


export function useUsers() {
return useContext(UserContext)
}