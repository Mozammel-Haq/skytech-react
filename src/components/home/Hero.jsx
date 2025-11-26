import { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, A11y, Pagination } from 'swiper/modules'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { useProducts } from '../../context/ProductContext.jsx'
import 'swiper/css'
import 'swiper/css/pagination'

const heroSlides = [
  {
    id: 'hero-smartphones',
    title: 'SkyTech UltraPhone X1',
    tagline: 'AI camera that sees in the dark',
    description:
      'Capture stellar nights, all-day battery, and vivid 120Hz OLED in a featherweight body.',
    image: './assets/products/smartphone-ultra-front.jpg',
    cta: {
      label: 'Shop flagship phones',
      to: '/shop?category=smartphones&deal=1',
    },
    badge: 'Deal of the day',
  },
  {
    id: 'hero-laptops',
    title: 'ZenithBook Creator 16',
    tagline: 'Pixels calibrated for perfection',
    description:
      'Mini-LED brilliance, RTX studio power, and silent thermals crafted for creators.',
    image: './assets/products/laptop-creator-open.jpg',
    cta: {
      label: 'Explore creator rigs',
      to: '/shop?category=laptops&segment=creator',
    },
    badge: 'Creator studio',
  },
  {
    id: 'hero-smart-home',
    title: 'GlowSphere Smart Lighting',
    tagline: 'Atmosphere that reacts to your world',
    description:
      'Dynamic scenes, music-reactive glow, and Matter-ready control for every room.',
    image: './assets/products/smarthome-light-scene.jpg',
    cta: {
      label: 'Brighten your space',
      to: '/shop?category=smart-home&segment=lighting',
    },
    badge: 'Smart home glow',
  },
]

function Hero() {
    const media_base_url = import.meta.env.VITE_BASE_MEDIA_URL
  const { bestValueProducts } = useProducts()

  const promos = useMemo(
    () => bestValueProducts.slice(0, 2),
    [bestValueProducts],
  )

  return (
    <section className="container grid gap-6 py-10 lg:grid-cols-[2fr,1fr] lg:gap-8">
      {/* Hero Swiper */}
      <div className="relative overflow-hidden rounded-4xl border border-neutral-200 bg-neutral-900 text-white shadow-soft dark:bg-neutral-800 dark:border-neutral-600">
        <Swiper
          modules={[Pagination, Autoplay, A11y]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          aria-label="SkyTech hero promotions"
          className="relative"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-12 rounded-4xl overflow-hidden">
                {/* Left content */}
                <div className="space-y-4 relative z-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200 dark:text-teal-300">
                    {slide.badge}
                  </span>
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl font-semibold sm:text-4xl lg:text-5xl"
                  >
                    {slide.tagline}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="max-w-xl text-sm text-neutral-200 sm:text-base dark:text-neutral-300"
                  >
                    {slide.description}
                  </motion.p>
                  <div className="flex items-center gap-3 pt-2">
                    <Button as={Link} to={slide.cta.to} size="lg" variant="secondary">
                      {slide.cta.label}
                    </Button>
                    <Link
                      to="/shop"
                      className="text-sm font-semibold text-white transition hover:text-teal-200 dark:text-neutral-200 dark:hover:text-teal-300"
                    >
                      Browse all products
                    </Link>
                  </div>
                </div>

                {/* Right background image with overlay */}
                <div className="relative w-full h-0 lg:h-96 rounded-xl overflow-hidden">
                  {/* Background image */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${slide.image}")` }}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Promo Cards */}
      <div className="flex flex-col gap-6">
        {promos.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="group relative flex flex-1 flex-col overflow-hidden rounded-4xl shadow-subtle transition hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              backgroundImage: `url(${media_base_url}/products/${product.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/60 dark:bg-black/60"></div>

            {/* Card content */}
            <div className="relative z-10 flex flex-col h-full p-6 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-teal-300">
                Best value pick
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white dark:text-neutral-100">{product.title}</h3>
              <p className="mt-1 text-sm text-white/80 dark:text-neutral-300 line-clamp-2 w-3/4">{product.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-sm font-semibold text-primary dark:text-teal-300">Shop now</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Hero
