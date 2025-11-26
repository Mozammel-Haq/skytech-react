import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header.jsx'
import Topbar from './Topbar.jsx'
import Footer from './Footer.jsx'

const variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } },
}

function ScrollToTop({ pathname }) {
  if (typeof window !== 'undefined') {
    Promise.resolve().then(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
    })
  }
  return null
}

function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/' // detect homepage

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Topbar />
      <Header />

      <Suspense
        fallback={
          <div className="flex h-[40vh] items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
          </div>
        }
      >
        {isHome ? (
          // Homepage: render immediately, sections handle animation
          <main className="flex-1">
            <ScrollToTop pathname={location.pathname} />
            <Outlet />
          </main>
        ) : (
          // Other pages: wrap in AnimatePresence for smooth page transitions
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={location.pathname}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1"
            >
              <ScrollToTop pathname={location.pathname} />
              <Outlet />
            </motion.main>
          </AnimatePresence>
        )}
      </Suspense>

      <Footer />
    </div>
  )
}

export default MainLayout
