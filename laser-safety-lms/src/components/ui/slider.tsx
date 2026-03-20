"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const [localValue, setLocalValue] = React.useState(value[0])
  
  React.useEffect(() => {
    setLocalValue(value[0])
  }, [value])

  const percentage = ((localValue - min) / (max - min)) * 100

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    setLocalValue(newValue)
    onValueChange([newValue])
  }

  return (
    <div
      className={cn(
        "relative flex w-full touch-none select-none items-center h-6",
        className
      )}
      {...props}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute h-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
        style={{ margin: 0 }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={localValue}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        id={id}
      />
      <div
        className="absolute h-4 w-4 rounded-full border-2 border-primary bg-background shadow transition-all pointer-events-none top-1"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  )
}

export { Slider }
