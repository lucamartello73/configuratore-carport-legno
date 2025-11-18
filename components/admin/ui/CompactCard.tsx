import React from "react"
import { cn } from "@/lib/utils"

interface CompactCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function CompactCard({ children, className, hover = false, onClick }: CompactCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm p-4",
        hover && "hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  )
}

interface CompactCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CompactCardHeader({ children, className }: CompactCardHeaderProps) {
  return <div className={cn("mb-3", className)}>{children}</div>
}

interface CompactCardTitleProps {
  children: React.ReactNode
  className?: string
}

export function CompactCardTitle({ children, className }: CompactCardTitleProps) {
  return <h3 className={cn("text-lg font-semibold text-gray-900", className)}>{children}</h3>
}

interface CompactCardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CompactCardDescription({ children, className }: CompactCardDescriptionProps) {
  return <p className={cn("text-sm text-gray-500 mt-1", className)}>{children}</p>
}

interface CompactCardContentProps {
  children: React.ReactNode
  className?: string
}

export function CompactCardContent({ children, className }: CompactCardContentProps) {
  return <div className={cn("", className)}>{children}</div>
}

interface CompactCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CompactCardFooter({ children, className }: CompactCardFooterProps) {
  return <div className={cn("mt-4 flex items-center gap-2", className)}>{children}</div>
}
