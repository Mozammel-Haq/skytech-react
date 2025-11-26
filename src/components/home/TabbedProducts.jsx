import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useProducts } from '../../context/ProductContext.jsx'
import ProductGrid from '../product/ProductGrid.jsx'
import ProductCard from '../product/ProductCard.jsx'

const tabs = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'New Arrivals' },
  { id: 'bestseller', label: 'Best Sellers' },
  { id: 'sale', label: 'On Sale' },
]

function TabbedProducts({ onQuickView }) {
  const { featuredProducts, newArrivals, bestSellers, onSaleProducts } = useProducts()
  const [activeTab, setActiveTab] = useState('featured')

  const productsByTab = useMemo(
    () => ({
      featured: featuredProducts,
      new: newArrivals,
      bestseller: bestSellers,
      sale: onSaleProducts,
    }),
    [featuredProducts, newArrivals, bestSellers, onSaleProducts],
  )

  const activeProducts = productsByTab[activeTab] ?? []

  return (
    <section className="container space-y-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-700 dark:text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
              )}
            >
              {tab.label}
              {activeProducts.length > 0 && activeTab === tab.id && (
                <motion.span
                  layoutId="tab-count"
                  className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-neutral-900 dark:bg-neutral-700 dark:text-white"
                >
                  {activeProducts.length}
                </motion.span>
              )}
            </button>
          ))}
        </div>
        <a
          href="/shop"
          className="text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          View all
        </a>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <ProductGrid>
            {activeProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
          </ProductGrid>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export default TabbedProducts
