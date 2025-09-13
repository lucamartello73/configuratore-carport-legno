import { SimpleIcons } from "@/components/ui/simple-icons"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`}>
      <SimpleIcons.AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-700">{message}</AlertDescription>
    </Alert>
  )
}
