import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { useCart } from '../context/CartContext.jsx'

function Wishlist() {
  const { items, toggleItem, clearWishlist } = useWishlist()
  const { getProductsByIds } = useProducts()
  const { addItem } = useCart()
  const products = getProductsByIds(items.map((i) => i.id))

  return (
  <>
    <Helmet>
      <title>Wishlist — SkyTech</title>
    </Helmet>
    <div className="container py-10">
      {products.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Your wishlist is empty
          </h1>
          <Link
            to="/shop"
            className="mt-4 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Saved items</h1>
            <button
              type="button"
              onClick={clearWishlist}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
            >
              Clear wishlist
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <img
                  src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${p.thumbnail}`}
                  alt={p.title}
                  className="h-32 w-full object-contain"
                />
                <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {p.title}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  ${p.price.toFixed(2)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: p.thumbnail,
                        quantity: 1,
                        variantId: p.variants?.[0]?.id ?? 'default',
                        variantLabel: [p.variants?.[0]?.color, p.variants?.[0]?.storage]
                          .filter(Boolean)
                          .join(' / '),
                      })
                    }
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleItem({ id: p.id })}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    Remove
                  </button>
                  <Link
                    to={`/product/${p.slug}`}
                    className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
)

}

export default Wishlist
