import { Helmet } from 'react-helmet-async'
import FormField from '../../components/dashboard/FormField.jsx'
import { useState } from 'react'

function HomepageContentAdmin() {
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerSubtitle, setBannerSubtitle] = useState('')
  const [sliderImage, setSliderImage] = useState('')

  const save = () => {}

  return (
    <>
      <Helmet>
        <title>Admin — Homepage</title>
      </Helmet>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Banner title" value={bannerTitle} onChange={setBannerTitle} />
          <FormField label="Banner subtitle" value={bannerSubtitle} onChange={setBannerSubtitle} />
          <FormField label="Slider image" value={sliderImage} onChange={setSliderImage} placeholder="/assets/..." />
        </div>
        <div className="mt-3">
          <button type="button" onClick={save} className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white dark:bg-neutral-800">Save</button>
        </div>
      </div>
    </>
  )
}

export default HomepageContentAdmin