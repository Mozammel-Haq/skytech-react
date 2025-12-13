import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'

function DashboardSidebar({ sections = [] }) {
  const { user, isAdmin, isSuperAdmin } = useAuth()
  const role = isSuperAdmin ? 'super_admin' : isAdmin ? 'admin' : 'customer'
  const location = useLocation()
  const [open, setOpen] = useState(() => new Set())

  const items = useMemo(() => {
    const filterByRole = (item) => {
      if (Array.isArray(item.roles) && item.roles.length > 0) {
        return item.roles.includes(role)
      }
      return true
    }
    const mapChildren = (list) =>
      list
        .filter(filterByRole)
        .map((i) => ({
          ...i,
          children: Array.isArray(i.children) ? i.children.filter(filterByRole) : undefined,
        }))
    return mapChildren(sections)
  }, [sections, role])

  const isRouteActive = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`)

  const toggle = (key) => {
    const next = new Set(open)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setOpen(next)
  }

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900 lg:sticky lg:top-0 lg:h-screen">
      <nav className="space-y-1">
        {items.map((item) => {
          const key = item.label
          const hasChildren = Array.isArray(item.children) && item.children.length > 0
          const activeChild = hasChildren && item.children.some((c) => isRouteActive(c.to))
          const expanded = open.has(key) || activeChild

          if (!hasChildren) {
            return (
              <NavLink
                key={item.to || key}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive || isRouteActive(item.to)
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`
                }
              >
                {item.icon ? <item.icon /> : null}
                <span>{item.label}</span>
              </NavLink>
            )
          }

          return (
            <div key={key} className="">
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  activeChild
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  {item.icon ? <item.icon /> : null}
                  {item.label}
                </span>
                <FiChevronDown className={`transition ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <div className="mt-1 space-y-1 pl-8">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                          isActive || isRouteActive(child.to)
                            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`
                      }
                    >
                      {child.icon ? <child.icon /> : null}
                      <span className="font-medium">{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSidebar
