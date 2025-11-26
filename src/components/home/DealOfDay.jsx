import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext.jsx'
import useCountdown from '../../hooks/useCountdown.js'
import Button from '../ui/Button.jsx'
import ProductPrice from '../product/ProductPrice.jsx'
import { useCart } from '../../context/CartContext.jsx'

function TimerSegment({ label, value }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-neutral-900 dark:bg-neutral-800 px-4 py-3 text-white">
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">{label}</span>
    </div>
  )
}

function DealOfDay() {
  const { dealOfDayProduct } = useProducts()
  const { addItem } = useCart()

  const product = useMemo(() => dealOfDayProduct, [dealOfDayProduct])
  const countdown = useCountdown(product?.dealEndTime)

  if (!product) return null

  const addToCart = () => {
    const variant = product.variants?.[0]
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1,
      variantId: variant?.id ?? 'default',
      variantLabel: [variant?.color, variant?.storage].filter(Boolean).join(' / '),
    })
  }

  return (
    <section className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="grid items-center gap-10 rounded-4xl border border-danger/20 bg-danger/5 p-8 md:grid-cols-2"
      >
        <div className="space-y-5">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-danger">
            Deal of the day
          </span>
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white md:text-4xl">
            {product.title}
          </h2>
          <p className="text-sm dark:text-white text-neutral-600 md:text-base">{product.description}</p>
          <ProductPrice price={product.price} originalPrice={product.originalPrice} />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={addToCart}>
              Add to cart
            </Button>
            <Button variant="ghost" onClick={() => window.open(`/product/${product.slug}`, '_self')}>
              View details
            </Button>
          </div>
          <ul className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-100">
            {product.highlights?.slice(0, 3).map((highlight) => (
              <li key={highlight.id} className="rounded-full border border-neutral-200 px-3 py-1">
                {highlight.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center gap-6">
          <img
            src={`${import.meta.env.VITE_BASE_MEDIA_URL}/products/${product.thumbnail}`}
            alt={product.title}
            className="h-56 w-full max-w-md object-cover rounded"
            loading="lazy"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <TimerSegment label="Days" value={countdown.days} />
            <TimerSegment label="Hours" value={countdown.hours} />
            <TimerSegment label="Minutes" value={countdown.minutes} />
            <TimerSegment label="Seconds" value={countdown.seconds} />
          </div>
          {product.dealEndTime && countdown.completed && (
            <p className="text-sm font-semibold text-danger">
              Deal expired — new offer drops tomorrow.
            </p>
          )}
          <Link
            to="/shop?deal=1"
            className="text-sm font-semibold text-danger transition hover:text-danger/70"
          >
            View more limited deals
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default DealOfDay
