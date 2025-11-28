import { Helmet } from 'react-helmet-async'
import DataTable from '../../components/dashboard/DataTable.jsx'
import { useUsers } from '../../context/UserContext.jsx'

function CustomerUsers() {
  const { customerUsers, loading } = useUsers()

  const rows = !loading
    ? customerUsers.map((u) => ({
        id: u.id,
        name: u.name ?? '',
        email: u.email ?? '',
        phone: u.phone ?? '',
        address: u.address ?? '',
      }))
    : []

  return (
    <>
      <Helmet>
        <title>Super Admin — Customers</title>
      </Helmet>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Customers</h2>
      </div>

      <div className="mt-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
          ]}
          rows={rows}
        />
      </div>
    </>
  )
}

export default CustomerUsers
