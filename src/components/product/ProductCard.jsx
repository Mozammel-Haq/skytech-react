import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FiHeart, FiBarChart2, FiEye } from 'react-icons/fi'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useCart } from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCompare } from '../../context/CompareContext.jsx'
import ProductPrice from './ProductPrice.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'

function ProductCard({ product, onQuickView }) {
  const media_base_url = import.meta.env.VITE_BASE_MEDIA_URL
  const { addItem } = useCart()
  const { toggleItem, items: wishlistItems } = useWishlist()
  const { addItem: addCompare, items: compareItems } = useCompare()

  const isWishlisted = wishlistItems.some((item) => item.id === product.id)
  const isCompared = compareItems.some((item) => item.id === product.id)

  const handleAddToCart = () => {
    const defaultVariant = product.variants?.[0]

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1,
      variantId: defaultVariant?.id ?? 'default',
      variantLabel: [defaultVariant?.color, defaultVariant?.storage, defaultVariant?.switches]
        .filter(Boolean)
        .join(' / '),
    })
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-subtle transition hover:border-primary/40 hover:shadow-soft focus-within:border-primary/40 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary/60 dark:shadow-none"
    >

      {/* Corrected Badge Rendering */}
      {product.badges?.length > 0 && (
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {product.badges.slice(0, 2).map((b) => (
            <Badge key={b.id} variant="primary">
              {b.badge}
            </Badge>
          ))}
        </div>
      )}

      <div className="relative max-h-[220px] max-w-[285] flex aspect-[4/3] items-center justify-center bg-neutral-50 dark:bg-neutral-700">
        <img
          src={`${media_base_url}/products/${product.thumbnail}`}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {/* Action Buttons */}
        <div className="absolute right-0 top-2 flex flex-col items-start justify-end gap-2 p-4 opacity-0 transition group-hover:opacity-100">

          {/* Wishlist */}
          <button
            type="button"
            onClick={() =>
              toggleItem({
                id: product.id,
                title: product.title,
                thumbnail: product.thumbnail,
                price: product.price,
              })
            }
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-white transition hover:bg-primary/80',
              isWishlisted && 'bg-secondary text-white'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart />
          </button>

          {/* Compare */}
          <button
            type="button"
            onClick={() =>
              addCompare({
                id: product.id,
                title: product.title,
                specs: product.shortSpecs, // unchanged; consumer handles array of objects
              })
            }
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-white transition hover:bg-primary/80',
              isCompared && 'bg-secondary text-white'
            )}
            aria-label={isCompared ? 'Already in compare list' : 'Add to compare'}
          >
            <FiBarChart2 />
          </button>

          {/* Quick View */}
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-white transition hover:bg-primary/80"
            aria-label="Quick view"
          >
            <FiEye />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
            {product.brand}
          </p>

          <Link
            to={`/product/${product.slug}`}
            className="text-lg font-semibold leading-tight text-neutral-900 transition hover:text-primary dark:text-neutral-100 dark:hover:text-primary"
          >
            {product.title}
          </Link>

          <p className="text-sm text-neutral-500 line-clamp-2 dark:text-neutral-400">
            {product.description}
          </p>
        </div>

        <div className="space-y-3">
          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
            darkMode
          />
        </div>

        {/* Rating (Corrected: reviewsCount) */}
        {product.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              {product.rating.toFixed(1)}
            </span>

            {product.reviewsCount && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                ({product.reviewsCount})
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2">
          <Button className="flex-1" size="sm" variant="primary" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    thumbnail: PropTypes.string.isRequired,
    brand: PropTypes.string,

    // Corrected: array of objects
    shortSpecs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),

    // Corrected: array of objects
    badges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        badge: PropTypes.string.isRequired,
      })
    ),

    // Corrected: matches API
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        color: PropTypes.string,
        storage: PropTypes.string,
        price: PropTypes.number,
      })
    ),

    rating: PropTypes.number,
    reviewsCount: PropTypes.number, // corrected field name from API
  }).isRequired,

  onQuickView: PropTypes.func,
}

ProductCard.defaultProps = {
  onQuickView: () => {},
}

export default ProductCard
