import { Helmet } from 'react-helmet-async'
import FormField from '../../components/dashboard/FormField.jsx'
import { useState } from 'react'

function SuperAdminSettings() {
  const [paymentProvider, setPaymentProvider] = useState('')
  const [shippingProvider, setShippingProvider] = useState('')
  const [siteName, setSiteName] = useState('SkyTech')
  const save = () => {}
  return (
    <>
      <Helmet>
        <title>Super Admin — Settings</title>
      </Helmet>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Site name" value={siteName} onChange={setSiteName} />
          <FormField label="Payment provider" value={paymentProvider} onChange={setPaymentProvider} />
          <FormField label="Shipping provider" value={shippingProvider} onChange={setShippingProvider} />
        </div>
        <div className="mt-3">
          <button type="button" onClick={save} className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white dark:bg-neutral-800">Save</button>
        </div>
      </div>
    </>
  )
}

export default SuperAdminSettings