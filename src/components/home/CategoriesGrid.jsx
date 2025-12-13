import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext.jsx'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.05 },
  }),
}

function CategoriesGrid() {
  const media_base_url = import.meta.env.VITE_BASE_MEDIA_URL
  const { categorySummary } = useProducts()
  return (
  <section className="container py-12">
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
  >
    {categorySummary.slice(0, 8).map((category, index) => (
      <motion.div
        key={category.id}
        custom={index}
        className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
      >
        {/* Top Badge */}
        <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">
          {category.count} items
        </span>

        {/* Content Grid */}
        <div className="mt-3 grid grid-cols-2 gap-4 items-center">
          {/* LEFT SIDE TEXT */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {category.name}
            </h3>

            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">
              {category.description}
            </p>

            <Link
              to={`/shop?category=${category.slug}`}
              className="mt-3 inline-flex items-center text-sm font-semibold text-primary hover:translate-x-1 transition-transform"
            >
              Shop {category.name}
            </Link>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="relative flex justify-end">
            <img
              src={`${media_base_url}/products/${category.image}`}
              alt={`${category.name} illustration`}
              loading="lazy"
              className="
                h-32 w-32 object-contain 
                transition-transform duration-300 
                group-hover:scale-110
                opacity-90 dark:opacity-80
              "
            />
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
</section>

  )
}

export default CategoriesGrid
