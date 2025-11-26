import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export async function listAdmins() {
  const { data } = await axios.get(`${BASE_URL}/super-admin/admins`)
  return data
}

export async function createAdmin(payload) {
  const { data } = await axios.post(`${BASE_URL}/super-admin/admins`, payload)
  return data
}

export async function deleteAdmin(id) {
  const { data } = await axios.delete(`${BASE_URL}/super-admin/admins/${id}`)
  return data
}

export async function listCustomers() {
  const { data } = await axios.get(`${BASE_URL}/super-admin/customers`)
  return data
}

export async function listRoles() {
  const { data } = await axios.get(`${BASE_URL}/super-admin/roles`)
  return data
}

export async function updateRole(id, payload) {
  const { data } = await axios.put(`${BASE_URL}/super-admin/roles/${id}`, payload)
  return data
}

export async function getAnalytics(params = {}) {
  const { data } = await axios.get(`${BASE_URL}/super-admin/analytics`, { params })
  return data
}