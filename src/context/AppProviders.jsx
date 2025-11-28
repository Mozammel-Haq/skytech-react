import PropTypes from 'prop-types'
import { ProductProvider } from './ProductContext.jsx'
import { CartProvider } from './CartContext.jsx'
import { WishlistProvider } from './WishlistContext.jsx'
import { CompareProvider } from './CompareContext.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { OrdersProvider } from './OrdersContext.jsx'
import { UserProvider } from './UserContext.jsx'
import { DashboardProvider } from './DashboardContext.jsx'

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DashboardProvider>
        <UserProvider>
        <OrdersProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>{children}</CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </OrdersProvider>
        </UserProvider>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppProviders
