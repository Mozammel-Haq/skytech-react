function FormField({ label, value, onChange, type = 'text', placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-primary focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
      />
    </div>
  )
}

export default FormField