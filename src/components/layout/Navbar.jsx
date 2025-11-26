import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiMenu } from 'react-icons/fi'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../../context/ProductContext.jsx'

/* ------------------- Desktop Mega Menu ------------------- */
function DesktopMegaMenu({ categories }) {
  const [activeCategory, setActiveCategory] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  if (!Array.isArray(categories) || categories.length === 0) return null

  const handleMouseEnter = (slug) => {
    setActiveCategory(slug)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false)
      setActiveCategory(null)
    }, 200)
  }

  return (
    <div className="hidden border-b border-neutral-200 bg-white lg:block dark:bg-surface-dark dark:border-neutral-600">
      <div className="container flex items-center gap-6">
        <nav className="flex flex-1 items-center gap-3 text-sm font-semibold relative">
          {categories.map((category) => (
            <div
              key={category?.id || category?.slug}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category.slug)}
              onMouseLeave={handleMouseLeave}
            >
              {/* --- Menu Button --- */}
              <button
                type="button"
                className={clsx(
                  'flex items-center gap-1 rounded-full px-3 py-2 transition',
                  activeCategory === category.slug && isHovered
                    ? 'bg-neutral-900 text-white dark:bg-neutral-700'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-600',
                )}
              >
                {category.name}
                <FiChevronDown className="text-xs" />
              </button>

              {/* --- Dropdown --- */}
              <AnimatePresence>
                {activeCategory === category.slug && isHovered && (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-0 top-full z-30 mt-0 w-[640px] rounded border border-neutral-200 bg-white p-6 shadow-soft dark:bg-neutral-800 dark:border-neutral-700"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="grid grid-cols-3 gap-6">
                      {/* Left section */}
                      <div className="col-span-2 space-y-3">
                        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide dark:text-neutral-400">
                          Top picks
                        </h3>
                        <ul className="grid grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                          {[
                            { label: 'Explore all', sort: '' },
                            { label: 'New arrivals', sort: 'new' },
                            { label: 'Best value deals', sort: 'best-value' },
                            { label: 'Top rated', sort: 'top-rated' },
                          ].map((item, i) => (
                            <li key={i}>
                              <Link
                                to={`/shop?category=${category.slug}${item.sort ? `&sort=${item.sort}` : ''}`}
                                className="block rounded-xl border border-neutral-200 p-3 transition hover:border-primary hover:bg-primary/5 dark:border-neutral-600 dark:hover:bg-primary/10"
                              >
                                {item.label} {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right section (featured) */}
                      <div className="rounded-2xl bg-neutral-900 p-6 text-white dark:bg-neutral-700 dark:text-neutral-200">
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-300 dark:text-neutral-400">
                          Featured
                        </p>
                        <p className="mt-3 text-lg font-semibold">{category.name}</p>
                        <p className="mt-2 text-sm text-neutral-200 dark:text-neutral-300">
                          {category.description}
                        </p>
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="mt-4 h-28 w-full object-contain"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

DesktopMegaMenu.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      slug: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
    }),
  ).isRequired,
}

/* ------------------- Mobile Menu ------------------- */
function MobileMenu({ categories }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expanded, setExpanded] = useState(null)

  if (!Array.isArray(categories) || categories.length === 0) return null

  return (
    <div className="container border-b border-neutral-200 bg-white lg:hidden dark:bg-surface-dark dark:border-neutral-600">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
      >
        <span className="inline-flex items-center gap-2">
          <FiMenu />
          Browse Categories
        </span>
        <FiChevronDown className={clsx('transition', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-neutral-200 dark:border-neutral-600"
          >
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((prev) => (prev === category.id ? null : category.id))
                    }
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
                    aria-expanded={expanded === category.id}
                  >
                    {category.name}
                    <FiChevronDown
                      className={clsx('transition', expanded === category.id && 'rotate-180')}
                    />
                  </button>

                  <AnimatePresence>
                    {expanded === category.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 bg-neutral-50 px-4 py-4 dark:bg-neutral-700"
                      >
                        <Link
                          to={`/shop?category=${category.slug}`}
                          className="block rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-primary hover:bg-primary/10 dark:bg-neutral-600 dark:text-neutral-200 dark:hover:bg-primary/20"
                        >
                          Explore all {category.name}
                        </Link>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{category.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

MobileMenu.propTypes = {
  categories: DesktopMegaMenu.propTypes.categories,
}

/* ------------------- Navbar Wrapper ------------------- */
function Navbar() {
  const { categories = [] } = useProducts() || {}

  if (!Array.isArray(categories) || categories.length === 0) return null

  return (
    <div className="sticky top-20 z-30">
      <MobileMenu categories={categories} />
      <DesktopMegaMenu categories={categories} />
    </div>
  )
}

export default Navbar
