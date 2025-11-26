import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

function AccountProfile() {
  const { user, isAuthenticated, updateProfile } = useAuth()

  // Local state for all editable fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Initialize state from user
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setAddress(user.address || '')
      setCity(user.city || '')
      setPostalCode(user.postal_code || '')
      setCountry(user.country || '')
    }
  }, [user])
  

  if (!isAuthenticated) {
    return (
      <div className="container py-10">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center dark:bg-neutral-900 dark:border-neutral-700">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Please login to edit your profile
          </p>
          <Link
            to="/login"
            className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }
  console.log(user)

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const updatedData = {
      id: user.id,
      name,
      email,
      phone,
      address,
      city,
      postal_code: postalCode,
      country,
    }

    if (password) updatedData.password = password

    updateProfile(updatedData)
    console.log(updatedData)
  }

  return (
    <>
      <Helmet>
        <title>Account — Profile</title>
      </Helmet>
      <div className="container py-10">
        <div className="mx-auto max-w-lg rounded-3xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 p-6">
          <h1 className="text-2xl font-bold dark:text-white">Profile settings</h1>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal Code"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (leave blank if no change)"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm dark:text-white"
            />
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountProfile
