import { Helmet } from 'react-helmet-async'
import DataTable from '../../components/dashboard/DataTable.jsx'
import FormField from '../../components/dashboard/FormField.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import { useState } from 'react'

function RolesPermissions() {
  const rows = []
  const [modalOpen, setModalOpen] = useState(false)
  const [role, setRole] = useState('')
  const [permissions, setPermissions] = useState('')
  const addRole = (e) => {
    e.preventDefault()
    setRole('')
    setPermissions('')
    setModalOpen(false)
  }
  return (
    <>
      <Helmet>
        <title>Super Admin — Roles</title>
      </Helmet>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Roles & Permissions</h2>
        <button type="button" onClick={() => setModalOpen(true)} className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white dark:bg-neutral-800">Add Role</button>
      </div>
      <DataTable columns={[{ key: 'role', label: 'Role' }, { key: 'permissions', label: 'Permissions' }]} rows={rows} />

      <DashboardModal
        open={modalOpen}
        title="Add Role"
        onClose={() => setModalOpen(false)}
        onSubmit={addRole}
        submitLabel="Create Role"
      >
        <FormField label="Role" value={role} onChange={setRole} />
        <FormField label="Permissions (comma-separated)" value={permissions} onChange={setPermissions} />
      </DashboardModal>
    </>
  )
}

export default RolesPermissions