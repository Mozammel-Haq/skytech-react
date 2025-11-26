import PropTypes from 'prop-types'
import clsx from 'clsx'

const baseStyles =
  'inline-flex items-center justify-center rounded-full font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 focus-visible:ring-secondary',
  ghost: 'bg-transparent text-neutral-900 dark:text-white dark:hover:bg-primary hover:bg-neutral-100 focus-visible:ring-neutral-300',
  outline:
    'border border-neutral-300 text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300',
}

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-5 py-2.5',
  lg: 'text-base px-6 py-3',
}

function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button
      type="button"
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Button
