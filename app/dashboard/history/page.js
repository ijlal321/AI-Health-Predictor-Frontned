"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { getLatestPredictions } from "../../actions/prediction"

export default function HistoryPage() {
  const [heartPredictions, setHeartPredictions] = useState([]);
  const [cancerPredictions, setCancerPredictions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadAllData() {
      const userId = localStorage.getItem("userId"); // Replace with your actual user ID retrieval logic
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const { success, heartPredictions, cancerPredictions, error } = await getLatestPredictions(userId);

      if (success) {
        setHeartPredictions(heartPredictions);
        setCancerPredictions(cancerPredictions);
      } else {
        console.error("Error fetching predictions:", error);
      }
      setLoading(false);
    }

    loadAllData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Prediction History</h1>
      <p className="text-gray-500 mt-2">View your previous health predictions and results.</p>

      <Tabs defaultValue="heart" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="heart">Heart Disease</TabsTrigger>
          <TabsTrigger value="cancer">Cancer</TabsTrigger>
        </TabsList>

        <TabsContent value="heart">
          <Card>
            <CardHeader>
              <CardTitle>Heart Disease Prediction History</CardTitle>
              <CardDescription>Your previous heart disease risk assessments.</CardDescription>
            </CardHeader>
            <CardContent>
              {heartPredictions.length > 0 ? (
                <div className="space-y-4">
                  {heartPredictions.map((prediction) => (
                    <div key={prediction.id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {prediction.result ? "High Risk" : "Low Risk"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(prediction.prediction_time).toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <p>
                          <strong>Age:</strong> {prediction.age}
                        </p>
                        <p>
                          <strong>Sex:</strong> {prediction.sex === 1 ? "Male" : "Female"}
                        </p>
                        <p>
                          <strong>Anaemia:</strong> {prediction.anaemia ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Diabetes:</strong> {prediction.diabetes ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Smoking:</strong> {prediction.smoking ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>High Blood Pressure:</strong> {prediction.high_blood_pressure ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Creatinine Phosphokinase:</strong> {prediction.creatinine_phosphokinase} U/L
                        </p>
                        <p>
                          <strong>Ejection Fraction:</strong> {prediction.ejection_fraction}%
                        </p>
                        <p>
                          <strong>Platelets:</strong> {prediction.platelets} /µL
                        </p>
                        <p>
                          <strong>Serum Creatinine:</strong> {prediction.serum_creatinine} mg/dL
                        </p>
                        <p>
                          <strong>Serum Sodium:</strong> {prediction.serum_sodium} mEq/L
                        </p>
                        <p>
                          <strong>Follow-up Time:</strong> {prediction.time} months
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No heart disease predictions found.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your prediction history will appear here once you start using the heart disease prediction tool.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancer">
          <Card>
            <CardHeader>
              <CardTitle>Cancer Prediction History</CardTitle>
              <CardDescription>Your previous cancer risk assessments.</CardDescription>
            </CardHeader>
            <CardContent>
              {cancerPredictions.length > 0 ? (
                <div className="space-y-4">
                  {cancerPredictions.map((prediction) => (
                    <div key={prediction.id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {prediction.result ? "High Risk" : "Low Risk"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(prediction.prediction_time).toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <p><strong>Radius Mean:</strong> {prediction.radius_mean}</p>
                        <p><strong>Texture Mean:</strong> {prediction.texture_mean}</p>
                        <p><strong>Perimeter Mean:</strong> {prediction.perimeter_mean}</p>
                        <p><strong>Area Mean:</strong> {prediction.area_mean}</p>
                        {/* Add other fields as needed */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No cancer predictions found.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your prediction history will appear here once you start using the cancer prediction tool.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
