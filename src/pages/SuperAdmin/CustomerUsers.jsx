import { Helmet } from 'react-helmet-async'
import DataTable from '../../components/dashboard/DataTable.jsx'
import FormField from '../../components/dashboard/FormField.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import { useState } from 'react'

function CustomerUsers() {
  const rows = []
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const addCustomer = (e) => {
    e.preventDefault()
    setName('')
    setEmail('')
    setModalOpen(false)
  }
  return (
    <>
      <Helmet>
        <title>Super Admin — Customers</title>
      </Helmet>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customers</h2>
        <button type="button" onClick={() => setModalOpen(true)} className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white dark:bg-neutral-800">Add Customer</button>
      </div>
      <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }]} rows={rows} />

      <DashboardModal
        open={modalOpen}
        title="Add Customer"
        onClose={() => setModalOpen(false)}
        onSubmit={addCustomer}
        submitLabel="Create Customer"
      >
        <FormField label="Name" value={name} onChange={setName} />
        <FormField label="Email" value={email} onChange={setEmail} />
      </DashboardModal>
    </>
  )
}

export default CustomerUsers
