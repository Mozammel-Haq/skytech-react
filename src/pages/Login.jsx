import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
  e.preventDefault();
  if (!email || !password) return;

  try {
    await login({ email, password }); // wait for API response
    navigate('/account'); // only redirect if login succeeds
  } catch (err) {
    // optionally handle errors here, though your AuthContext already shows toast
    console.error(err);
  }
};


return (
  <>
    <Helmet>
      <title>Login — SkyTech</title>
    </Helmet>
    <div className="container py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Login</h1>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-xl border border-neutral-200 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Sign in
          </button>
        </form>
        <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
          Admin: admin@skytech.test / Admin@123
        </p>
        <p className="mt-3 text-sm text-neutral-900 dark:text-neutral-100">
          No account?{' '}
          <Link to="/signup" className="text-primary">
            Create one
          </Link>
        </p>
      </div>
    </div>
  </>
)

}

export default Login
