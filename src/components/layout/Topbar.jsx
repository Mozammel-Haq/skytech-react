import { FiGlobe, FiMapPin, FiPhoneCall } from 'react-icons/fi'
import clsx from 'clsx'
import useScrollDirection from '../../hooks/useScrollDirection.js'

function Topbar() {
  const direction = useScrollDirection({ threshold: 8 })

  return (
    <div
      className={clsx(
        'sticky top-0 z-50 w-full border-b bg-neutral-900 border-neutral-100 dark:border-0 text-neutral-100 transition duration-300',
        direction === 'down' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      )}
    >
      <div className="container flex items-center justify-between py-2 text-xs font-medium">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <FiMapPin className="text-sm" />
            Deliver to your location
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            Free shipping over $50
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <FiPhoneCall className="text-sm" />
            Customer Service
          </span>
          <a href="#track-order" className="hidden md:inline-flex items-center gap-1 underline">
            Track Order
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="inline-flex items-center gap-1 text-xs">
            <FiGlobe aria-hidden />
            <span>EN</span>
          </button>
          <button type="button" className="inline-flex items-center gap-1 text-xs">
            <span>US</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Topbar
