import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/hooks/use-toast"
import "./globals.css"

export const metadata = {
  title: "Health Prediction System",
  description: "Predict heart disease and cancer risk",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}
