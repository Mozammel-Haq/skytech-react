import { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext.jsx'
import ProductPrice from '../product/ProductPrice.jsx'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function BestValueSlider() {
    const media_base_url = import.meta.env.VITE_BASE_MEDIA_URL
  const { bestValueProducts } = useProducts()
  const slides = useMemo(() => bestValueProducts.slice(0, 8), [bestValueProducts])

  if (!slides.length) return null

  return (
    <section className="bg-neutral-900 py-12 text-white dark:bg-neutral-900">
      <div className="container space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60 dark:text-primary/70">
              Best value
            </p>
            <h2 className="mt-2 text-2xl font-semibold dark:text-white">
              Bundles engineered to go further
            </h2>
          </div>
          <FiTag className="hidden text-3xl text-primary lg:block" aria-hidden />
        </div>

        <Swiper
          modules={[Pagination, A11y]}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          aria-label="Best value bundles"
        >
          {slides.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                to={`/product/${product.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/30 dark:text-primary">
                    Save more
                  </span>
                  <span className="text-xs text-neutral-300 dark:text-neutral-400">
                    Bundles ship free
                  </span>
                </div>
                <div className="mt-6 flex flex-1 flex-col gap-4">
                  <img
                    src={`${media_base_url}/products/${product.thumbnail}`}
                    alt={product.title}
                    className="h-40 w-full object-contain"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-semibold text-white dark:text-white">
                    {product.title}
                  </h3>
                  <p className="text-sm text-neutral-300 line-clamp-3 dark:text-neutral-400">
                    {product.description}
                  </p>
                  <ProductPrice price={product.price} originalPrice={product.originalPrice} darkMode />
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition group-hover:translate-x-1 dark:text-primary">
                  View bundle
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default BestValueSlider
