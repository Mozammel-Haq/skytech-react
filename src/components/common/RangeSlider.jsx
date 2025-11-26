import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react'

function RangeSlider({ min, max, step, values, onChange }) {
  const [internalValues, setInternalValues] = useState(values)
  const rangeRef = useRef(null)

  useEffect(() => {
    setInternalValues(values)
  }, [values])

  const percentValues = useMemo(() => {
    const [start, end] = internalValues
    return [((start - min) / (max - min)) * 100, ((end - min) / (max - min)) * 100]
  }, [internalValues, min, max])

  useEffect(() => {
    if (!rangeRef.current) return
    const [startPercent, endPercent] = percentValues
    rangeRef.current.style.background = `linear-gradient(to right, #E5E7EB ${startPercent}%, #0EA5A4 ${startPercent}%, #0EA5A4 ${endPercent}%, #E5E7EB ${endPercent}%)`
  }, [percentValues])

  const updateValue = (index, newValue) => {
    const clampedValue = Math.min(Math.max(newValue, min), max)
    const updated = [...internalValues]
    updated[index] = index === 0 ? Math.min(clampedValue, updated[1]) : Math.max(clampedValue, updated[0])
    setInternalValues(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValues[0]}
          onChange={(event) => updateValue(0, Number(event.target.value))}
          className="range-thumb absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValues[1]}
          onChange={(event) => updateValue(1, Number(event.target.value))}
          className="range-thumb absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
        <div ref={rangeRef} className="h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" aria-hidden />
      </div>
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <span>${internalValues[0]}</span>
        <span>${internalValues[1]}</span>
      </div>
    </div>
  )
}

RangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func,
}

RangeSlider.defaultProps = {
  step: 1,
  onChange: () => {},
}

export default RangeSlider
