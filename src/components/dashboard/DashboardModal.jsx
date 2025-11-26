import PropTypes from 'prop-types'

function DashboardModal({ open, title, onClose, onSubmit, children, submitLabel = 'Save', cancelLabel = 'Cancel' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm">✕</button>
        </div>
        <form onSubmit={onSubmit} className="px-6 py-4">
          <div className="space-y-4">{children}</div>
          <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <button type="button" onClick={onClose} className="rounded-full border px-4 py-2 text-sm">{cancelLabel}</button>
            <button type="submit" className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white dark:bg-neutral-800">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

DashboardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
}

export default DashboardModal