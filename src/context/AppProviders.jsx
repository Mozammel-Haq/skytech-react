import PropTypes from 'prop-types'
import { ProductProvider } from './ProductContext.jsx'
import { CartProvider } from './CartContext.jsx'
import { WishlistProvider } from './WishlistContext.jsx'
import { CompareProvider } from './CompareContext.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { OrdersProvider } from './OrdersContext.jsx'

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrdersProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>{children}</CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </OrdersProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppProviders
