import { useState, useMemo } from 'react'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'

function DataTable({ columns, rows, actions = [], rowsPerPageOptions = [5, 10, 20], defaultRowsPerPage = 5 }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [selectedRows, setSelectedRows] = useState([])

  // Filter rows
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows
    return rows.filter((row) =>
      columns.some((col) => String(row[col.key]).toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [rows, searchQuery, columns])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows
    return [...filteredRows].sort((a, b) => {
      const av = a[sortConfig.key]
      const bv = b[sortConfig.key]
      const canCompare = (v) => typeof v === 'string' || typeof v === 'number'
      if (!canCompare(av) || !canCompare(bv)) return 0
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredRows, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage)
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return sortedRows.slice(start, end)
  }, [sortedRows, currentPage, rowsPerPage])

  // Sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  // Selection handlers
  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedRows.length) setSelectedRows([])
    else setSelectedRows(paginatedRows.map((r) => r.id))
  }

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages))
  const handlePageChange = (page) => setCurrentPage(page)

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
        placeholder="Search..."
        className="max-w-40 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 shadow-sm">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
  <tr className="whitespace-nowrap">
    {/* Select All */}
    <th className="p-3 text-left">
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer"
        checked={selectedRows.length === paginatedRows.length && paginatedRows.length > 0}
        onChange={toggleSelectAll} // <-- wired correctly
      />
    </th>

    {/* Data Columns */}
    {columns.map((c) => (
      <th
        key={c.key}
        onClick={() => handleSort(c.key)}
        className="p-3 text-left text-neutral-900 dark:text-neutral-100 cursor-pointer select-none"
      >
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">{c.label}</span>
          {sortConfig.key === c.key ? (
            sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
          ) : (
            <span className="opacity-20"><FiChevronUp /></span>
          )}
        </div>
      </th>
    ))}

    {/* Actions Column */}
    {actions.length > 0 && (
      <th className="p-3 text-left text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
        Actions
      </th>
    )}
  </tr>
</thead>

          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                className={`border-t border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition ${selectedRows.includes(row.id) ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
              >
                <td className="p-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleSelectRow(row.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="p-3 text-neutral-900 dark:text-neutral-100 whitespace-nowrap">{row[c.key]}</td>
                ))}
                {actions.length > 0 && (
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      {actions.map((a) => (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => a.onClick(row)}
                          className="flex items-center justify-center rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between text-sm text-neutral-700 dark:text-neutral-300 gap-2">
        <div>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="rounded-full border px-3 py-1 disabled:opacity-50">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={`rounded-full border px-3 py-1 ${currentPage === page ? 'bg-neutral-900 text-white dark:bg-neutral-700' : ''}`}>
              {page}
            </button>
          ))}
          <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="rounded-full border px-3 py-1 disabled:opacity-50">Next</button>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }} className="rounded-xl border px-2 py-1">
            {rowsPerPageOptions.map((opt) => <option key={opt} value={opt}>{opt} per page</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

export default DataTable
