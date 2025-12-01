import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout.jsx'
import AdminInvoice from '../pages/Admin/AdminInvoice.jsx'

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/Home.jsx'))
const ShopPage = lazy(() => import('../pages/Shop.jsx'))
const ProductPage = lazy(() => import('../pages/Product.jsx'))
const CartPage = lazy(() => import('../pages/Cart.jsx'))
const CheckoutPage = lazy(() => import('../pages/Checkout.jsx'))
const WishlistPage = lazy(() => import('../pages/Wishlist.jsx'))
const ComparePage = lazy(() => import('../pages/Compare.jsx'))
const LoginPage = lazy(() => import('../pages/Login.jsx'))
const SignupPage = lazy(() => import('../pages/Signup.jsx'))
const AccountDashboard = lazy(() => import('../pages/Account/Dashboard.jsx'))
const AccountOrders = lazy(() => import('../pages/Account/Orders.jsx'))
const AccountProfile = lazy(() => import('../pages/Account/Profile.jsx'))
const AccountLayout = lazy(() => import('../pages/Account/AccountLayout.jsx'))
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard.jsx'))
const AdminProducts = lazy(() => import('../pages/Admin/ProductsAdmin.jsx'))
const AdminOrders = lazy(() => import('../pages/Admin/OrdersAdmin.jsx'))
const AdminCategories = lazy(() => import('../pages/Admin/CategoriesAdmin.jsx'))
const AdminBrands = lazy(() => import('../pages/Admin/BrandsAdmin.jsx'))
const AdminReturns = lazy(() => import('../pages/Admin/ReturnsAdmin.jsx'))
const AdminHomepage = lazy(() => import('../pages/Admin/HomepageContentAdmin.jsx'))
const SuperAdminLayout = lazy(() => import('../pages/SuperAdmin/SuperAdminLayout.jsx'))
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdmin/Dashboard.jsx'))
const SuperAdminAdminUsers = lazy(() => import('../pages/SuperAdmin/AdminUsers.jsx'))
const SuperAdminCustomerUsers = lazy(() => import('../pages/SuperAdmin/CustomerUsers.jsx'))
const SuperAdminRoles = lazy(() => import('../pages/SuperAdmin/RolesPermissions.jsx'))
const SuperAdminSettings = lazy(() => import('../pages/SuperAdmin/Settings.jsx'))
const AboutPage = lazy(() => import('../pages/About.jsx'))
const ContactPage = lazy(() => import('../pages/Contact.jsx'))
const TrackOrderPage = lazy(() => import('../pages/TrackOrder.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFound.jsx'))

// Simple loading screen fallback (you can customize it)
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-lg font-semibold text-gray-600">Loading...</p>
  </div>
)

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Account Routes */}
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="profile" element={<AccountProfile />} />
          </Route>

          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id/invoice" element={<AdminInvoice />} /> 
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="returns" element={<AdminReturns />} />
          <Route path="homepage" element={<AdminHomepage />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id/invoice" element={<AdminInvoice />} /> 
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="returns" element={<AdminReturns />} />
          <Route path="homepage" element={<AdminHomepage />} />
          <Route path="admins" element={<SuperAdminAdminUsers />} />
          <Route path="customers" element={<SuperAdminCustomerUsers />} />
          <Route path="roles" element={<SuperAdminRoles />} />
          <Route path="settings" element={<SuperAdminSettings />} />
          <Route path="analytics" element={<SuperAdminDashboard />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
