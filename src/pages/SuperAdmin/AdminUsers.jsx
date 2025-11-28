import { Helmet } from 'react-helmet-async'
import DataTable from '../../components/dashboard/DataTable.jsx'
import FormField from '../../components/dashboard/FormField.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext.jsx'
import { useUsers } from '../../context/UserContext.jsx'

function AdminUsers() {
  const { user } = useAuth()
  const { adminUsers, setAllUsers, loading } = useUsers()

  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    role_id: 1,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  const [rows, setRows] = useState([])

  // Load admin users into local table rows
  useState(() => {
    if (!loading) {
      const mapped = adminUsers.map((u) => {
        const roleId =
          u.role_id !== undefined && u.role_id !== null
            ? Number(u.role_id)
            : u?.role?.toLowerCase() === 'super_admin'
            ? 2
            : 1

        return {
          id: u.id,
          name: u.name ?? '',
          email: u.email ?? '',
          phone: u.phone ?? '',
          address: u.address ?? '',
          city: u.city ?? '',
          postal_code: u.postal_code ?? '',
          country: u.country ?? '',
          role_id: roleId,
          role: roleId === 2 ? 'Super Admin' : 'Admin',
        }
      })

      setRows(mapped)
    }
  }, [loading, adminUsers])

  // Update form fields
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Add admin
  const addAdmin = async () => {
    const payload = { ...form, token: user?.token }

    const { data } = await axios.post(`${BASE_URL}/testuser/save`, payload, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })

    if (data.success === 'yes') {
      const newUser = {
        id: data.id,
        ...form,
        role: form.role_id === 1 ? 'Admin' : 'Super Admin',
      }

      setRows((prev) => [...prev, newUser])

      // Update global context
      setAllUsers((prev) => [
        ...prev,
        { id: data.id, ...form, role_id: form.role_id },
      ])
    }
  }

  // Update admin
  const updateAdmin = async () => {
    const payload = { ...form, id: editId, token: user?.token }

    const { data } = await axios.post(`${BASE_URL}/testuser/update`, payload, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
    console.log(data)
    if (data.success === 'yes') {
      const updatedRow = {
        ...form,
        id: editId,
        role: form.role_id === 1 ? 'Admin' : 'Super Admin',
      }

      setRows((prev) =>
        prev.map((r) => (r.id === editId ? updatedRow : r))
      )

      // Update global context
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === editId ? { ...u, ...form, role_id: form.role_id } : u
        )
      )
    }
  }

  // Delete admin
  const deleteAdmin = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    const { data } = await axios.post(
      `${BASE_URL}/testuser/delete`,
      { id, token: user?.token },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    )

    if (data.success === 'yes') {
      setRows((prev) => prev.filter((r) => r.id !== id))

      // Remove from global context
      setAllUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  // Open Edit Modal
  const handleEdit = (row) => {
    setEditMode(true)
    setEditId(row.id)
    setForm({
      name: row.name,
      email: row.email,
      password: '',
      phone: row.phone,
      address: row.address,
      city: row.city,
      postal_code: row.postal_code,
      country: row.country,
      role_id: Number(row.role_id),
    })
    setModalOpen(true)
  }

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await updateAdmin()
      } else {
        await addAdmin()
      }
    } catch (err) {
      console.error(err)
    }
    resetForm()
  }

  // Reset Form
  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
      role_id: 1,
    })
    setModalOpen(false)
    setEditMode(false)
    setEditId(null)
  }

  return (
    <>
      <Helmet>
        <title>Super Admin — Admin Users</title>
      </Helmet>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Admin Users</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white dark:bg-neutral-800"
        >
          Add Admin
        </button>
      </div>

      <div className="mt-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
            { key: 'role', label: 'Role' },
          ]}
          rows={rows}
          actions={[
            {
              key: 'edit',
              label: <FiEdit />,
              onClick: (row) => handleEdit(row),
            },
            {
              key: 'delete',
              label: <FiTrash2 />,
              onClick: (row) => deleteAdmin(row.id),
            },
          ]}
        />
      </div>

      <DashboardModal
        open={modalOpen}
        title={editMode ? 'Edit Admin' : 'Add Admin'}
        onClose={resetForm}
        onSubmit={handleSubmit}
        submitLabel={editMode ? 'Update Admin' : 'Create Admin'}
      >
        <div className="flex flex-wrap w-full justify-between gap-4">
          <FormField
            className="flex-grow"
            label="Name"
            value={form.name}
            onChange={(v) => updateField('name', v)}
          />
          <FormField
            className="flex-grow"
            label="Email"
            value={form.email}
            onChange={(v) => updateField('email', v)}
          />
        </div>

        <div className="flex flex-wrap w-full justify-between gap-4">
          <FormField
            type="password"
            className="flex-grow"
            label={editMode ? 'Password (optional)' : 'Password'}
            value={form.password}
            onChange={(v) => updateField('password', v)}
          />
          <FormField
            className="flex-grow"
            label="Phone"
            value={form.phone}
            onChange={(v) => updateField('phone', v)}
          />
        </div>

        <div className="flex flex-wrap w-full justify-between gap-4">
          <FormField
            className="flex-grow"
            label="Address"
            value={form.address}
            onChange={(v) => updateField('address', v)}
          />
          <FormField
            className="flex-grow"
            label="City"
            value={form.city}
            onChange={(v) => updateField('city', v)}
          />
        </div>

        <div className="flex flex-wrap w-full justify-between gap-4">
          <FormField
            className="flex-grow"
            label="Postal Code"
            value={form.postal_code}
            onChange={(v) => updateField('postal_code', v)}
          />

          <FormField
            className="flex-grow"
            label="Country"
            value={form.country}
            onChange={(v) => updateField('country', v)}
          />

          <div className="flex-grow">
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              value={form.role_id}
              onChange={(e) => updateField('role_id', Number(e.target.value))}
            >
              <option value={1}>Admin</option>
              <option value={2}>Super Admin</option>
            </select>
          </div>
        </div>
      </DashboardModal>
    </>
  )
}

export default AdminUsers
