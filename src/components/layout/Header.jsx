import { Link, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiHeart, FiUser, FiBarChart2, FiSearch } from 'react-icons/fi'
import { useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCompare } from '../../context/CompareContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import SearchBar from '../forms/SearchBar.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import Navbar from './Navbar.jsx'

function Header() {
  const location = useLocation()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { items: compareItems } = useCompare()
  const { user, isAuthenticated, logout } = useAuth()

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  )

  // Dropdown hover state
  const [openDropdown, setOpenDropdown] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-md shadow-sm dark:bg-surface-dark dark:border-neutral-700">
      <div className="container flex h-20 items-center justify-between gap-6">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-black shadow-md">
            ST
          </span>
          <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            SkyTech
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 lg:block">
          <SearchBar />
        </div>

        {/* Action Icons */}
        <nav aria-label="Quick actions" className="flex items-center gap-1 sm:gap-4 relative">
          <ThemeToggle />

          {/* Mobile Search Toggle */}
          <button
            type="button"
            title="Search"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="inline-flex lg:hidden items-center justify-center rounded-full p-[0.65rem] text-neutral-700 hover:bg-neutral-100 transition-all duration-200 dark:text-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Search"
          >
            <FiSearch className="text-md" />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            title="Wishlist"
            className="group relative rounded-full p-[0.65rem] sm:p-3 text-neutral-700 hover:bg-neutral-100 transition-all duration-200 dark:text-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Wishlist"
          >
            <FiHeart className="text-md sm:text-xl" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Compare */}
          <Link
            to="/compare"
            title="Compare"
            className="group relative rounded-full p-[0.65rem] sm:p-3 text-neutral-700 hover:bg-neutral-100 transition-all duration-200 dark:text-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Compare"
          >
            <FiBarChart2 className="text-md sm:text-xl" />
            {compareItems.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-secondary px-1.5 text-xs font-semibold text-white">
                {compareItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            title="Your Cart"
            className="group relative rounded-full p-[0.65rem] sm:p-3 text-neutral-700 hover:bg-neutral-100 transition-all duration-200 dark:text-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-md sm:text-xl" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition-all duration-200 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
            >
              <FiUser className="text-lg" />
              <span className='hidden sm:inline'>{isAuthenticated ? user?.name : 'Account'}</span>
            </button>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute right-0 w-48 rounded-xl border border-neutral-200 bg-white shadow-lg ring-1 ring-black/5 animate-fadeIn z-50 dark:bg-neutral-800 dark:border-neutral-700">
                <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-700">
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link
                          to="/account/profile"
                          className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/account/orders"
                          className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-600 dark:hover:text-red-50"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signup"
                          className="block px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Search Drawer */}
      {mobileSearchOpen && (
        <div className="border-t border-neutral-200 bg-white/90 py-3 lg:hidden shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="container flex items-center gap-3">
            <SearchBar compact />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:text-neutral-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Navbar Section */}
      <Navbar />
    </header>
  )
}

export default Header
