import PropTypes from 'prop-types'
import clsx from 'clsx'

const baseStyles =
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide'

const variants = {
  primary: 'border-primary/70 bg-primary/70 text-white text-[10px]',
  secondary: 'border-secondary/20 bg-secondary/10 text-secondary',
  neutral: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  danger: 'border-danger/60 bg-danger/70 text-white text-[10px]',
  success: 'border-success/20 bg-success/10 text-success',
}

function Badge({ children, variant = 'neutral', className }) {
  return <span className={clsx(baseStyles, variants[variant], className)}>{children}</span>
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'neutral', 'danger', 'success']),
  className: PropTypes.string,
}

export default Badge
