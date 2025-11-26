import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useOrders } from '../context/OrdersContext.jsx'

function TrackOrder() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const { getByIdOrNumber } = useOrders()

  const lookup = () => {
    const found = getByIdOrNumber(query)
    setResult(found ?? null)
  }

  const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered']

  // Determine current step index based on latest tracking log
  const lastStatus = result?.tracking.history[result.tracking.history.length - 1]?.status
  const currentStepIndex = lastStatus
    ? STATUS_FLOW.findIndex((s) => s.toLowerCase() === lastStatus.toLowerCase())
    : 0

  return (
    <>
      <Helmet>
        <title>Track Order — SkyTech</title>
      </Helmet>

      <div className="container py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700 p-6">

          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Track your order
          </h1>

          {/* Search Section */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter order id or number (e.g., ord-5001 or SKY-5001)"
              className="h-11 flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-sm text-neutral-900 dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={lookup}
              className="rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>

          {/* Result Section */}
          {result ? (
            <div className="mt-8">

              {/* Order Number */}
              <p className="text-sm text-neutral-900 dark:text-neutral-100">
                Order <span className="font-semibold">{result.orderNumber}</span>
              </p>

{/* Progress Stepper */}
<div className="mt-6">
  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
    Order Status
  </p>

  <div className="relative w-full flex items-center justify-between px-4">
    {/* Background line */}
    <div className="absolute left-5 right-5 top-[40%]h-1 bg-neutral-300 dark:bg-neutral-700 -translate-y-1/2"></div>

    {/* Progress line */}
    <div
      className="absolute left-5 top-[40%] h-1 bg-primary -translate-y-1/2 transition-all"
      style={{
        width: `${
          currentStepIndex >= 0
            ? Math.min(Math.max(currentStepIndex, 0), STATUS_FLOW.length - 1) /
              (STATUS_FLOW.length - 1) *
              100
            : 0
        }%`,
      }}
    ></div>

    {/* Steps */}
    {STATUS_FLOW.map((step, index) => {
      // Clamp isCompleted to not exceed last step
      const clampedIndex = Math.min(Math.max(currentStepIndex, 0), STATUS_FLOW.length - 1)
      const isCompleted = index <= clampedIndex
      return (
        <div key={step} className="relative flex flex-col items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold 
              ${isCompleted
                ? 'bg-primary border-primary text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-400 dark:border-neutral-600 text-neutral-500'
              }`}
          >
            {index + 1}
          </div>
          <span
            className={`mt-2 text-xs font-medium ${
              isCompleted
                ? 'text-primary dark:text-green-400'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </span>
        </div>
      )
    })}
  </div>
</div>


              {/* Timeline */}
              <div className="mt-8 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-5">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Status Timeline
                </p>

                {result.tracking.history.length > 0 ? (
                  <ul className="relative border-l border-neutral-300 dark:border-neutral-600 pl-4 space-y-4">
                    {result.tracking.history.map((h) => {
                      const stepIndex = STATUS_FLOW.findIndex(
                        (s) => s.toLowerCase() === h.status.toLowerCase()
                      )
                      const isCompleted = stepIndex <= currentStepIndex
                      return (
                        <li key={h.timestamp} className="ml-2 relative">
                          <div
                            className={`absolute -left-2 top-1.5 w-3 h-3 rounded-full ${
                              isCompleted ? 'bg-primary' : 'bg-neutral-400 dark:bg-neutral-600'
                            }`}
                          ></div>
                          <p className="ml-4 font-medium text-neutral-800 dark:text-neutral-200">
                            {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {dayjs(h.timestamp).format('MMM D, YYYY — HH:mm')}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No tracking history available yet.
                  </p>
                )}
              </div>

            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              Enter your order id or number to see status.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default TrackOrder
