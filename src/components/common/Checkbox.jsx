import PropTypes from 'prop-types'
import clsx from 'clsx'

function Checkbox({ id, label, description, checked, onChange, className }) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        'flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:focus-within:ring-primary',
        checked && 'border-primary bg-primary/5 dark:border-primary dark:bg-primary/10',
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary dark:border-neutral-500"
      />
      <span className="flex flex-col">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{label}</span>
        {description && <span className="text-xs text-neutral-500 dark:text-neutral-400">{description}</span>}
      </span>
    </label>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
}

Checkbox.defaultProps = {
  description: undefined,
  checked: false,
  onChange: () => {},
  className: undefined,
}

export default Checkbox
