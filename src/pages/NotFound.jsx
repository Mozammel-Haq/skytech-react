import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function NotFound() {
return (
  <>
    <Helmet>
      <title>Page Not Found — SkyTech</title>
    </Helmet>
    <div className="container py-16">
      <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
        <h1 className="text-2xl font-bold">404 — Not Found</h1>
        <p className="mt-2 text-sm text-neutral-600">The page you’re looking for does not exist.</p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  </>
)

}

export default NotFound
