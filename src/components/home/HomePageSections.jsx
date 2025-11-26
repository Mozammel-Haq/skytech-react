import { useState } from 'react'
import { motion } from 'framer-motion'
import Hero from './Hero.jsx'
import CategoriesGrid from './CategoriesGrid.jsx'
import TabbedProducts from './TabbedProducts.jsx'
import BestValueSlider from './BestValueSlider.jsx'
import DealOfDay from './DealOfDay.jsx'
import ServicesRow from './ServicesRow.jsx'
import FeaturedCarousel from './FeaturedCarousel.jsx'
import NewsletterCTA from './NewsletterCTA.jsx'
import QuickViewModal from '../product/QuickViewModal.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useProducts } from '../../context/ProductContext.jsx'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.1 },
  }),
}

function HomePageSections() {
  const [activeProduct, setActiveProduct] = useState(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const { addItem } = useCart()
  const { getProductBySlug } = useProducts()

  const handleQuickView = (product) => {
    setActiveProduct(product)
    setIsQuickViewOpen(true)
  }

  const handleAddToCart = ({ id, variantId }) => {
    const product = getProductBySlug(activeProduct?.slug)
    const variant =
      product?.variants?.find((item) => item.id === variantId) ?? product?.variants?.[0]

    addItem({
      id: product?.id ?? id,
      title: product?.title,
      price: product?.price,
      image: product?.thumbnail,
      quantity: 1,
      variantId: variant?.id ?? 'default',
      variantLabel: [variant?.color, variant?.storage, variant?.switches].filter(Boolean).join(' / '),
    })
    setIsQuickViewOpen(false)
  }

  const sections = [
    <Hero key="hero" />,
    <CategoriesGrid key="categories" />,
    <TabbedProducts key="tabbed" onQuickView={handleQuickView} />,
    <BestValueSlider key="bestvalue" />,
    <DealOfDay key="deal" />,
    <section key="featured" className="container space-y-6 py-12">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-teal-300">
          Trending now
        </p>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Featured showcases
        </h2>
      </div>
      <FeaturedCarousel source="featured" onQuickView={handleQuickView} />
    </section>,
    <section key="new" className="container space-y-6 py-12">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary dark:text-cyan-400">
          For creators
        </p>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Studio-ready power picks
        </h2>
      </div>
      <FeaturedCarousel source="new" onQuickView={handleQuickView} />
    </section>,
    <section key="bestseller" className="container space-y-6 py-12">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
          Trusted favorites
        </p>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          Best sellers from the community
        </h2>
      </div>
      <FeaturedCarousel source="bestseller" onQuickView={handleQuickView} />
    </section>,
    <ServicesRow key="services" />,
    <NewsletterCTA key="newsletter" />,
  ]

  return (
    <div className="space-y-12">
      {sections.map((Section, index) => (
        <motion.div
          key={Section.key}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          {Section}
        </motion.div>
      ))}

      <QuickViewModal
        product={activeProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setActiveProduct(null)
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export default HomePageSections
