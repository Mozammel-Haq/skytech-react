import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import Button from '../ui/Button.jsx'
import { useNavigate } from 'react-router-dom'
import ProductPrice from './ProductPrice.jsx'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 24, transition: { duration: 0.15 } },
}

function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  const isVisible = Boolean(product) && Boolean(isOpen)

  const defaultVariant = product?.variants?.[0]
  const navigate = useNavigate()

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
        >
          <motion.div
            key={product.id}
            className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl dark:bg-neutral-900 dark:shadow-none"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 border-b border-neutral-200 md:border-b-0 md:border-r dark:border-neutral-700">
                <div className="flex items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-800">
                  <img
                    src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${product.thumbnail}`}
                    alt={product.title}
                    className="h-72 w-full max-w-sm object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto px-6 py-4">
                  {product.images?.map((img, idx) => {
                    const name = img?.name ?? img?.image ?? img
                    const key = img?.id ?? `${name}-${idx}`
                    return (
                      <img
                        key={key}
                        src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${name}`}
                        alt={product.title}
                        className="h-16 w-16 rounded-xl border border-neutral-200 object-cover dark:border-neutral-700"
                        loading="lazy"
                      />
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                      {product.brand}
                    </p>
                    <h3 id="quick-view-title" className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                      {product.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{product.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                    aria-label="Close quick view"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
                <div className="space-y-4">
                  <ProductPrice price={product.price} originalPrice={product.originalPrice} />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                      Quick specs
                    </p>
                    <ul className="flex flex-wrap gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      {product.shortSpecs?.map((spec) => (
                        <li key={spec.id} className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-700">
                          {spec.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={() => {
                      onAddToCart({
                        id: product.id,
                        variantId: defaultVariant?.id ?? 'default',
                      })
                    }}
                  >
                    Add to cart
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    View full details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

QuickViewModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    thumbnail: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.object),
    brand: PropTypes.string,
    shortSpecs: PropTypes.arrayOf(PropTypes.object),
    variants: PropTypes.array,
    slug: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onAddToCart: PropTypes.func,
}

QuickViewModal.defaultProps = {
  product: null,
  isOpen: false,
  onClose: () => {},
  onAddToCart: () => {},
}

export default QuickViewModal
