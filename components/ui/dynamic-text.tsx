"use client"

import { useState, useEffect } from "react"

interface DynamicTextProps {
  words?: string[]
  texts?: string[]
  className?: string
  interval?: number
}

export function DynamicText({ words = [], texts = [], className = "", interval = 2000 }: DynamicTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Combine words and texts arrays, prioritizing words
  const textArray = words.length > 0 ? words : texts.length > 0 ? texts : ["texto dinâmico"]

  useEffect(() => {
    if (textArray.length <= 1) return

    const timer = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % textArray.length)
        setIsVisible(true)
      }, 150)
    }, interval)

    return () => clearInterval(timer)
  }, [textArray.length, interval])

  return (
    <span
      className={`inline-block transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {textArray[currentIndex] || "texto"}
    </span>
  )
}
