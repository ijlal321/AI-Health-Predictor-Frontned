import { AuthForm } from "@/components/auth-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-rose-50 to-teal-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">Health Prediction System</h1>
        <AuthForm />
      </div>
    </div>
  )
}
