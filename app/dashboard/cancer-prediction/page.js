"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { predictCancer } from "@/app/actions/prediction"
import { useToast } from "@/hooks/use-toast"
import JwtVerifirer from "../../../components/jwt-verifier"


export default function CancerPredictionPage() {
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
      const prediction = await predictCancer(formData, localStorage.getItem("userId"))

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
          description: `Your cancer risk is ${prediction.riskPercentage}% (${prediction.riskCategory} Risk)`,
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
      <h1 className="text-2xl font-bold tracking-tight">Cancer Prediction</h1>
      <p className="text-gray-500 mt-2">Fill in the tumor characteristics to predict cancer malignancy.</p>

      {result ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prediction Result</CardTitle>
            <CardDescription>Your cancer risk assessment</CardDescription>
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
                Based on your inputs, you have a {result.riskPercentage}% risk of malignancy.
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
            <Button type="reset" onClick={() => {setDontCall(true);setResult(null)}} className="w-full">
              Make Another Prediction
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Breast Cancer Prediction</CardTitle>
            <CardDescription>Enter tumor characteristics for breast cancer malignancy prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="cancer-form" onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Mean Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="radius_mean">Radius Mean</Label>
                      <Input
                        id="radius_mean"
                        name="radius_mean"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="9.99"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="texture_mean">Texture Mean</Label>
                      <Input
                        id="texture_mean"
                        name="texture_mean"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="9.98"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perimeter_mean">Perimeter Mean</Label>
                      <Input
                        id="perimeter_mean"
                        name="perimeter_mean"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="45"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area_mean">Area Mean</Label>
                      <Input
                        id="area_mean"
                        name="area_mean"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="149.99"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smoothness_mean">Smoothness Mean</Label>
                      <Input
                        id="smoothness_mean"
                        name="smoothness_mean"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.07"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compactness_mean">Compactness Mean</Label>
                      <Input
                        id="compactness_mean"
                        name="compactness_mean"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concavity_mean">Concavity Mean</Label>
                      <Input
                        id="concavity_mean"
                        name="concavity_mean"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.40"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concave points_mean">Concave Points Mean</Label>
                      <Input
                        id="concave points_mean"
                        name="concave points_mean"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.19"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symmetry_mean">Symmetry Mean</Label>
                      <Input
                        id="symmetry_mean"
                        name="symmetry_mean"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.2"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fractal_dimension_mean">Fractal Dimension Mean</Label>
                      <Input
                        id="fractal_dimension_mean"
                        name="fractal_dimension_mean"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.08"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Standard Error Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="radius_se">Radius SE</Label>
                      <Input
                        id="radius_se"
                        name="radius_se"
                        type="number"
                        step="0.001"
                        placeholder="Enter value"
                        defaultValue="0.999"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="texture_se">Texture SE</Label>
                      <Input
                        id="texture_se"
                        name="texture_se"
                        type="number"
                        step="0.001"
                        placeholder="Enter value"
                        defaultValue="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perimeter_se">Perimeter SE</Label>
                      <Input
                        id="perimeter_se"
                        name="perimeter_se"
                        type="number"
                        step="0.001"
                        placeholder="Enter value"
                        defaultValue="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area_se">Area SE</Label>
                      <Input
                        id="area_se"
                        name="area_se"
                        type="number"
                        step="0.001"
                        placeholder="Enter value"
                        defaultValue="7"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smoothness_se">Smoothness SE</Label>
                      <Input
                        id="smoothness_se"
                        name="smoothness_se"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.02"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compactness_se">Compactness SE</Label>
                      <Input
                        id="compactness_se"
                        name="compactness_se"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.13"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concavity_se">Concavity SE</Label>
                      <Input
                        id="concavity_se"
                        name="concavity_se"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.04"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concave points_se">Concave Points SE</Label>
                      <Input
                        id="concave points_se"
                        name="concave points_se"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.04"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symmetry_se">Symmetry SE</Label>
                      <Input
                        id="symmetry_se"
                        name="symmetry_se"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.06"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fractal_dimension_se">Fractal Dimension SE</Label>
                      <Input
                        id="fractal_dimension_se"
                        name="fractal_dimension_se"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Worst Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="radius_worst">Radius Worst</Label>
                      <Input
                        id="radius_worst"
                        name="radius_worst"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="8"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="texture_worst">Texture Worst</Label>
                      <Input
                        id="texture_worst"
                        name="texture_worst"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perimeter_worst">Perimeter Worst</Label>
                      <Input
                        id="perimeter_worst"
                        name="perimeter_worst"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area_worst">Area Worst</Label>
                      <Input
                        id="area_worst"
                        name="area_worst"
                        type="number"
                        step="0.01"
                        placeholder="Enter value"
                        defaultValue="190"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smoothness_worst">Smoothness Worst</Label>
                      <Input
                        id="smoothness_worst"
                        name="smoothness_worst"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.2"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compactness_worst">Compactness Worst</Label>
                      <Input
                        id="compactness_worst"
                        name="compactness_worst"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.3"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concavity_worst">Concavity Worst</Label>
                      <Input
                        id="concavity_worst"
                        name="concavity_worst"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="concave points_worst">Concave Points Worst</Label>
                      <Input
                        id="concave points_worst"
                        name="concave points_worst"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symmetry_worst">Symmetry Worst</Label>
                      <Input
                        id="symmetry_worst"
                        name="symmetry_worst"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.4601"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fractal_dimension_worst">Fractal Dimension Worst</Label>
                      <Input
                        id="fractal_dimension_worst"
                        name="fractal_dimension_worst"
                        type="number"
                        step="0.00001"
                        placeholder="Enter value"
                        defaultValue="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" form="cancer-form" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Predict Cancer Risk"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
