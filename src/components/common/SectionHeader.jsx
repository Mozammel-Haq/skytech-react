import PropTypes from 'prop-types'
import clsx from 'clsx'
import Button from '../ui/Button.jsx'

function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
  align = 'left',
  className,
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        align === 'center' && 'text-center md:text-left',
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-semibold text-neutral-900 md:text-3xl">{title}</h2>
        {description && <p className="text-sm text-neutral-600 md:max-w-2xl">{description}</p>}
      </div>
      {cta && (
        <Button variant={cta.variant ?? 'ghost'} size="sm" onClick={cta.onClick}>
          {cta.label}
        </Button>
      )}
    </div>
  )
}

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  cta: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'outline']),
  }),
  align: PropTypes.oneOf(['left', 'center']),
  className: PropTypes.string,
}

export default SectionHeader
