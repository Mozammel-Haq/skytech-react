import PropTypes from 'prop-types'
import clsx from 'clsx'

function ProductGrid({ children, columns = 4, className }) {
  return (
    <div
      className={clsx(
        'grid gap-6 sm:grid-cols-2 lg:gap-8',
        {
          'md:grid-cols-3 2xl:grid-cols-4': columns === 4,
          'md:grid-cols-2 lg:grid-cols-3': columns === 3,
          'md:grid-cols-1': columns === 1,
        },
        className,
      )}
    >
      {children}
    </div>
  )
}

ProductGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 3, 4]),
  className: PropTypes.string,
}

export default ProductGrid
