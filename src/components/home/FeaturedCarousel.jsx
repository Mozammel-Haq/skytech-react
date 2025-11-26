import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { useProducts } from '../../context/ProductContext.jsx'
import ProductCard from '../product/ProductCard.jsx'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

function FeaturedCarousel({ source = 'featured', onQuickView }) {
  const { featuredProducts, newArrivals, bestSellers, onSaleProducts } = useProducts()

  const dataset = useMemo(() => {
    switch (source) {
      case 'new':
        return newArrivals
      case 'bestseller':
        return bestSellers
      case 'sale':
        return onSaleProducts
      case 'featured':
      default:
        return featuredProducts
    }
  }, [source, featuredProducts, newArrivals, bestSellers, onSaleProducts])

  if (!dataset.length) return null

  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      slidesPerView={1}
      spaceBetween={20}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true, dynamicBullets: true }}
      aria-label={`${source} products showcase`}
    >
      {dataset.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} onQuickView={onQuickView} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

FeaturedCarousel.propTypes = {
  source: PropTypes.oneOf(['featured', 'new', 'bestseller', 'sale']),
  onQuickView: PropTypes.func,
}

FeaturedCarousel.defaultProps = {
  source: 'featured',
  onQuickView: () => {},
}

export default FeaturedCarousel
