import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  const BASE_URL = import.meta.env.VITE_BASE_API_URL
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${BASE_URL}/testdashboard`)
      console.log(data)
      if (data.success !== 'yes') throw new Error(data.message || 'Failed to fetch stats')
      setStats(data)
    } catch (err) {
      setError(err)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Generic helper to export array-of-objects to excel
  const exportToExcel = (rows, filename = 'export.xlsx', sheetName = 'Sheet1') => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    saveAs(blob, filename)
  }

  return (
    <DashboardContext.Provider value={{ stats, fetchStats, loading, error, exportToExcel }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}
