"use client"
import { Heart, Activity, Users, AlertCircle } from "lucide-react"
import { PredictionCard } from "@/components/prediction-card"
import JwtVerifirer from "../../components/jwt-verifier"

export default function Dashboard() {
  
  // In a real app, these would be fetched from your backend
  const stats = [
    {
      title: "Total Predictions",
      value: "0",
      icon: Users,
      description: "Total predictions made by all users",
    },
    {
      title: "Heart Disease Risk",
      value: "14%",
      icon: AlertCircle,
      description: "Average risk across all predictions",
    },
  ]



  return (
    <div>
      <JwtVerifirer />
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome to your health prediction dashboard.</p>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Prediction Cards */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Health Predictions</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <PredictionCard
          title="Heart Disease Prediction"
          description="Predict your risk of heart disease based on medical and lifestyle factors."
          icon={Heart}
          href="/dashboard/heart-prediction"
          stats={[
            { value: "93%", label: "Accuracy" },
            { value: "30+", label: "Factors Analyzed" },
          ]}
        />

        <PredictionCard
          title="Cancer Prediction"
          description="Assess your risk of cancer based on various health indicators and genetic factors."
          icon={Activity}
          href="/dashboard/cancer-prediction"
          stats={[
            { value: "91%", label: "Accuracy" },
            { value: "25+", label: "Indicators" },
          ]}
        />
      </div>

      {/* Health Tips */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Health Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-sm text-gray-600">
              Regular exercise can reduce your risk of heart disease by up to 35%.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-sm text-gray-600">A diet rich in fruits and vegetables can help lower cancer risk.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <p className="text-sm text-gray-600">
              Regular health check-ups can help detect conditions early when they're most treatable.
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}
