import PropTypes from 'prop-types'
import clsx from 'clsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { getDiscountPrice } from '../../utils/getDiscountPrice.js'

function ProductPrice({ price, originalPrice, className,}) {
  const hasDiscount = Boolean(originalPrice && originalPrice > price)
  const discountPercent = hasDiscount ? getDiscountPrice(price, originalPrice) : 0

  return (
    <div className={clsx('flex items-baseline gap-4', className)}>
      <span
        className={clsx(
          'text-lg font-semibold',
          'dark:text-white',
          'text-primary'
        )}
      >
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <>
          <span
            className={clsx(
              'text-sm line-through',
              'dark:text-white',
              'text-neutral-500'
            )}
          >
            {formatCurrency(originalPrice)}
          </span>
          <span className="rounded-full bg-danger/10 px-2 py-1 text-xs font-semibold text-danger">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  )
}

ProductPrice.propTypes = {
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  className: PropTypes.string,
  darkMode: PropTypes.bool,
}

export default ProductPrice
