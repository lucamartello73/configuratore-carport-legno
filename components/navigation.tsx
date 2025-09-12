"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  currentStep: number
  totalSteps: number
  prevHref?: string
  nextHref?: string
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
}

export function Navigation({
  currentStep,
  totalSteps,
  prevHref,
  nextHref,
  onNext,
  nextDisabled = false,
  nextLabel = "Continua",
}: NavigationProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mt-8">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i + 1 <= currentStep ? "bg-amber-500" : i + 1 === currentStep + 1 ? "bg-orange-600" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <div>
          {prevHref && (
            <Button asChild variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link href={prevHref}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Indietro
              </Link>
            </Button>
          )}
        </div>

        <div className="text-center text-white/90">
          Step {currentStep} di {totalSteps}
        </div>

        <div>
          {nextHref ? (
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white" disabled={nextDisabled}>
              <Link href={nextHref}>
                {nextLabel}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          ) : onNext ? (
            <Button onClick={onNext} className="bg-orange-600 hover:bg-orange-700 text-white" disabled={nextDisabled}>
              {nextLabel}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
