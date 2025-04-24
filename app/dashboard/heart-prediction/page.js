"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { predictHeartDisease } from "@/app/actions/prediction"
import { useToast } from "@/hooks/use-toast"
import JwtVerifirer from "../../../components/jwt-verifier"


export default function HeartPredictionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { toast } = useToast()

  const [dontCall, setDontCall] = useState(false);

  const handleSubmit = async (e) => {
    if (dontCall) {
      setDontCall(false);
      return;
    }
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target)

    try {
      const prediction = await predictHeartDisease(formData, localStorage.getItem("userId"))

      if (prediction.success == false) {
        toast({
          variant: "destructive",
          title: "Error",
          description: prediction.error_msg,
        })
      } else {
        setResult(prediction)
        toast({
          title: "Prediction Complete",
          description: `Your heart disease risk is ${prediction.riskPercentage}% (${prediction.riskCategory} Risk)`,
        })
      }
    } catch (error) {
      console.error("Prediction error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your prediction. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <JwtVerifirer />
      <h1 className="text-2xl font-bold tracking-tight">Heart Disease Prediction</h1>
      <p className="text-gray-500 mt-2">Fill in your health information to predict your risk of heart disease.</p>

      {result ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prediction Result</CardTitle>
            <CardDescription>Your heart disease risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="text-4xl font-bold">{result.riskPercentage}%</div>
                </div>
                <div
                  className="absolute top-0 left-0 w-full h-full rounded-full border-8 border-rose-500"
                  style={{
                    clipPath: `polygon(0% 0%, ${result.riskPercentage}% 0%, ${result.riskPercentage}% 100%, 0% 100%)`,
                  }}
                ></div>
              </div>
              <div className="text-xl font-semibold mb-2">{result.riskCategory} Risk</div>
              <div className="text-center text-gray-500 mb-6">
                Based on your inputs, you have a {result.riskPercentage}% risk of heart disease.
              </div>

              <div className="w-full">
                <h3 className="font-medium mb-2">Recommendations:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="reset" onClick={() => { setDontCall(true); setResult(null) }} className="w-full">
              Make Another Prediction
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Heart Disease Risk Factors</CardTitle>
            <CardDescription>Enter your health information for heart disease risk prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="heart-form" onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" placeholder="Enter your age" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Select name="sex" required>
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Female</SelectItem>
                        <SelectItem value="1">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creatinine_phosphokinase">Creatinine Phosphokinase (CPK) Level</Label>
                  <Input
                    id="creatinine_phosphokinase"
                    name="creatinine_phosphokinase"
                    type="number"
                    placeholder="Enter CPK level (mcg/L)"
                    required
                  />
                  <p className="text-xs text-gray-500">Normal range: 10-120 mcg/L (female), 10-200 mcg/L (male)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ejection_fraction">Ejection Fraction (%)</Label>
                    <Input
                      id="ejection_fraction"
                      name="ejection_fraction"
                      type="number"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                      required
                    />
                    <p className="text-xs text-gray-500">Normal range: 55-70%</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serum_creatinine">Serum Creatinine (mg/dL)</Label>
                    <Input
                      id="serum_creatinine"
                      name="serum_creatinine"
                      type="number"
                      step="0.1"
                      placeholder="Enter level"
                      required
                    />
                    <p className="text-xs text-gray-500">Normal range: 0.5-1.1 mg/dL (female), 0.6-1.2 mg/dL (male)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serum_sodium">Serum Sodium (mEq/L)</Label>
                    <Input id="serum_sodium" name="serum_sodium" type="number" placeholder="Enter level" required />
                    <p className="text-xs text-gray-500">Normal range: 135-145 mEq/L</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platelets">Platelets (kiloplatelets/mL)</Label>
                    <Input id="platelets" name="platelets" type="number" placeholder="Enter count" required />
                    <p className="text-xs text-gray-500">Normal range: 150,000-450,000 platelets/mL</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Follow-up Period (days)</Label>
                  <Input id="time" name="time" type="number" placeholder="Enter days" required />
                  <p className="text-xs text-gray-500">Period of follow-up for the patient</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="anaemia">Anaemia</Label>
                      <Switch id="anaemia" name="anaemia" value="1" />
                    </div>
                    <p className="text-xs text-gray-500">Decrease of red blood cells or hemoglobin</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="diabetes">Diabetes</Label>
                      <Switch id="diabetes" name="diabetes" value="1" />
                    </div>
                    <p className="text-xs text-gray-500">If the patient has diabetes</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high_blood_pressure">High Blood Pressure</Label>
                      <Switch id="high_blood_pressure" name="high_blood_pressure" value="1" />
                    </div>
                    <p className="text-xs text-gray-500">If the patient has hypertension</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smoking">Smoking</Label>
                      <Switch id="smoking" name="smoking" value="1" />
                    </div>
                    <p className="text-xs text-gray-500">If the patient smokes</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="heart-form" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Predict Heart Disease Risk"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
