"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CameraCountdownProps {
  isActive: boolean
  initialCount: number
  onComplete: () => void
}

export function CameraCountdown({ isActive, initialCount, onComplete }: CameraCountdownProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    if (!isActive) {
      setCount(initialCount)
      return
    }

    if (count === 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, isActive, initialCount, onComplete])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <span className="text-6xl font-bold text-white">{count}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
