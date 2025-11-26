import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
  const { items, totals, updateQuantity, removeItem, clearCart, promoCode, applyPromo, clearPromo } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    navigate('/checkout')
  }

return (
  <>
    <Helmet>
      <title>Your Cart — SkyTech</title>
    </Helmet>
    <div className="container py-10">
      {items.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Your cart is empty</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Explore our latest arrivals and curated deals.
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Go to shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variantId}`}
                className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${item.image}`}
                  alt={item.title}
                  className="h-20 w-20 rounded-xl bg-neutral-50 object-contain dark:bg-neutral-800"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</p>
                  {item.variantLabel && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.variantLabel}</p>
                  )}
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.variantId, Math.max(1, item.quantity - 1))
                    }
                    className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-700"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                    className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-700"
                  >
                    +
                  </button>
                </div>
                <p className="w-24 text-right text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.id, item.variantId)}
                  className="rounded-full border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:text-neutral-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold dark:border-neutral-700 dark:text-neutral-300"
              >
                Clear cart
              </button>
              <Link
                to="/shop"
                className="rounded-full px-4 py-2 text-sm font-semibold text-primary"
              >
                Continue shopping
              </Link>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Promo code</p>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  defaultValue={promoCode?.code ?? ''}
                  placeholder="Enter code (e.g., SKY10)"
                  className="h-10 flex-1 rounded-xl border border-neutral-200 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousSibling
                    if (input && input.value) applyPromo(input.value)
                  }}
                  className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
                >
                  Apply
                </button>
                {promoCode && (
                  <button
                    type="button"
                    onClick={clearPromo}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-700 dark:text-neutral-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              {promoCode && <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">{promoCode.description}</p>}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-900 dark:text-neutral-100">
                  <span>Subtotal</span>
                  <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-900 dark:text-neutral-100">
                  <span>Shipping</span>
                  <span className="font-semibold">${totals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-900 dark:text-neutral-100">
                  <span>Tax</span>
                  <span className="font-semibold">${totals.tax.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-neutral-200 pt-2 text-base text-neutral-900 dark:border-neutral-700 dark:text-neutral-100">
                  <span>Total</span>
                  <span className="font-semibold">${totals.total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Checkout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  </>
)

}

export default Cart
