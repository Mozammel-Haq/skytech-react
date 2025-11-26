import { Helmet } from 'react-helmet-async'

function About() {
return (
  <>
    <Helmet>
      <title>About — SkyTech</title>
    </Helmet>
    <div className="container py-10">
      <div className="rounded-3xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 p-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">About SkyTech</h1>
        <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
          SkyTech curates modern electronics and experiences across smartphones, laptops, audio, gaming and smart home — built to be fast, accessible and delightful.
        </p>
      </div>
    </div>
  </>
)

}

export default About
