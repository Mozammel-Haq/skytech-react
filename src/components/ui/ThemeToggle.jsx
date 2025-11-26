import { FiMoon, FiSun } from 'react-icons/fi'
import clsx from 'clsx'
import { useTheme } from '../../context/ThemeContext.jsx'

function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        'group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
        className,
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">Toggle theme</span>
      <FiSun className={clsx('text-xl transition', theme === 'dark' && 'scale-0 opacity-0')} />
      <FiMoon className={clsx('absolute text-xl transition', theme !== 'dark' && 'scale-0 opacity-0')} />
    </button>
  )
}

ThemeToggle.propTypes = {
  className: (value, key, componentName) => {
    if (value[key] && typeof value[key] !== 'string') {
      return new Error(`Invalid prop ${key} supplied to ${componentName}. Expected string.`)
    }
    return null
  },
}

export default ThemeToggle