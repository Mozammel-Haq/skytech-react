import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_API_URL

export async function listProducts(params = {}) {
  const { data } = await axios.get(`${BASE_URL}/admin/products`, { params })
  return data
}

export async function createProduct(payload) {
  const { data } = await axios.post(`${BASE_URL}/admin/products`, payload)
  return data
}

export async function updateProduct(id, payload) {
  const { data } = await axios.put(`${BASE_URL}/admin/products/${id}`, payload)
  return data
}

export async function deleteProduct(id) {
  const { data } = await axios.delete(`${BASE_URL}/admin/products/${id}`)
  return data
}

export async function listOrders(params = {}) {
  const { data } = await axios.get(`${BASE_URL}/admin/orders`, { params })
  return data
}

export async function updateOrderStatus(id, status) {
  const { data } = await axios.put(`${BASE_URL}/admin/orders/${id}/status`, { status })
  return data
}

export async function listCategories() {
  const { data } = await axios.get(`${BASE_URL}/admin/categories`)
  return data
}

export async function listBrands() {
  const { data } = await axios.get(`${BASE_URL}/admin/brands`)
  return data
}

export async function saveHomepageConfig(payload) {
  const { data } = await axios.put(`${BASE_URL}/admin/homepage`, payload)
  return data
}