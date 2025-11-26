import { Helmet } from 'react-helmet-async'
import DataTable from '../../components/dashboard/DataTable.jsx'
import DashboardModal from '../../components/dashboard/DashboardModal.jsx'
import FormField from '../../components/dashboard/FormField.jsx'
import { useState } from 'react'

function ReturnsAdmin() {
  const rows = []
  const [modalOpen, setModalOpen] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [reason, setReason] = useState('')
  const submitReturn = (e) => {
    e.preventDefault()
    setOrderNumber('')
    setReason('')
    setModalOpen(false)
  }
  return (
    <>
      <Helmet>
        <title>Admin — Returns</title>
      </Helmet>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Returns</h2>
        <button type="button" onClick={() => setModalOpen(true)} className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white dark:bg-neutral-800">Add Return</button>
      </div>
      <DataTable columns={[{ key: 'orderNumber', label: 'Order' }, { key: 'status', label: 'Status' }, { key: 'requestedAt', label: 'Requested' }]} rows={rows} />

      <DashboardModal
        open={modalOpen}
        title="Add Return"
        onClose={() => setModalOpen(false)}
        onSubmit={submitReturn}
        submitLabel="Create Return"
      >
        <FormField label="Order Number" value={orderNumber} onChange={setOrderNumber} />
        <FormField label="Reason" value={reason} onChange={setReason} />
      </DashboardModal>
    </>
  )
}

export default ReturnsAdmin