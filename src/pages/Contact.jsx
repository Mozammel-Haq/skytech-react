import { Helmet } from 'react-helmet-async'

function Contact() {
 return (
  <>
    <Helmet>
      <title>Contact — SkyTech</title>
    </Helmet>
    <div className="container py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 p-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Contact us</h1>
        <form className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Your name"
            className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-neutral-100"
          />
          <input
            type="email"
            placeholder="Email"
            className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-neutral-100"
          />
          <textarea
            placeholder="Message"
            className="min-h-24 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100"
          />
          <button
            type="button"
            className="w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </>
)

}

export default Contact
