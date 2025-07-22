"use client"
import { useState } from "react"

import { Input } from "./input"
import { Badge } from "./badge"
import { X } from "lucide-react"

export function MultiSelectInput({ value, onChange, placeholder, className }) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = e => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const trimmedValue = inputValue.trim()
      if (trimmedValue && !value.includes(trimmedValue)) {
        onChange([...value, trimmedValue])
        setInputValue("")
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeItem = indexToRemove => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className={`border rounded-md p-2 min-h-[40px] ${className}`}>
      <div className="flex flex-wrap gap-1 mb-1">
        {value.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {item}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <p className="text-xs text-gray-500 mt-1">
        Press Enter or comma to add items
      </p>
    </div>
  )
}
