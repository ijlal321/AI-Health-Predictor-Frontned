"use server"

// This is a placeholder for the actual prediction logic
// In a real application, you would use a trained machine learning model


import { supabase } from "../../lib/supabaseClient";

const heart_api_link = "/heart/predict";
const cancer_api_link = "/cancer/predict";

export async function predictCancer(formData, userId) {

  // Extract form data for all 30 features
  const features = [
    "radius_mean",
    "texture_mean",
    "perimeter_mean",
    "area_mean",
    "smoothness_mean",
    "compactness_mean",
    "concavity_mean",
    "concave points_mean",
    "symmetry_mean",
    "fractal_dimension_mean",
    "radius_se",
    "texture_se",
    "perimeter_se",
    "area_se",
    "smoothness_se",
    "compactness_se",
    "concavity_se",
    "concave points_se",
    "symmetry_se",
    "fractal_dimension_se",
    "radius_worst",
    "texture_worst",
    "perimeter_worst",
    "area_worst",
    "smoothness_worst",
    "compactness_worst",
    "concavity_worst",
    "concave points_worst",
    "symmetry_worst",
    "fractal_dimension_worst",
  ]

  // preparing data
  const requestData = {};
  features.forEach((feature) => {
    requestData[feature] = Number.parseFloat(formData.get(feature) || "0");
  });

  // sending data to ai server
  const response = await fetch(process.env.AI_SERVER_ADDRESS + cancer_api_link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  // in case of any error
  if (!response.ok) {
    const errorData = await response.json();
    // in case of our custom known error
    if (errorData.detail) {
      const error_msg = errorData.detail[0].loc[1] + " " + errorData.detail[0].msg;
      return {
        success: false,
        error_msg: error_msg
      }
    }
    // in case of unknown error
    else {
      throw new Error("Failed to fetch prediction from AI server");
    }
  }


  const result = await response.json();
  const riskPercentage = parseFloat((result.probability[0] * 100).toFixed(1));

  // Determine risk category
  let riskCategory
  if (riskPercentage < 20) {
    riskCategory = "Low"
  } else if (riskPercentage < 50) {
    riskCategory = "Moderate"
  } else if (riskPercentage < 75) {
    riskCategory = "High"
  } else {
    riskCategory = "Very High"
  }

  // Save data to the database
  const { error: dbError } = await supabase.from("cancer_predictions").insert([
    {
      user_id: userId,
      prediction_time: new Date(),
      result: result.prediction,
      ...requestData, // Spread all the feature data into the database row
    },
  ]);

  if (dbError) {
    console.error("Error saving prediction to database:", dbError);
    return { success: false, error: "Failed to save prediction to database" };
  }

  return {
    success: true,
    riskPercentage,
    riskCategory,
    cancerType: "breast",
    recommendations: getCancerRecommendations(riskCategory, "breast"),
  }
}

export async function predictHeartDisease(formData, userId) {


  // Extract form data
  const age = Number.parseFloat(formData.get("age") || "0")
  const sex = Number.parseInt(formData.get("sex") || "0")
  const anaemia = formData.get("anaemia") ? 1 : 0
  const creatinine_phosphokinase = Number.parseInt(formData.get("creatinine_phosphokinase") || "0")
  const diabetes = formData.get("diabetes") ? 1 : 0
  const ejection_fraction = Number.parseInt(formData.get("ejection_fraction") || "0")
  const high_blood_pressure = formData.get("high_blood_pressure") ? 1 : 0
  const platelets = Number.parseFloat(formData.get("platelets") || "0")
  const serum_creatinine = Number.parseFloat(formData.get("serum_creatinine") || "0")
  const serum_sodium = Number.parseInt(formData.get("serum_sodium") || "0")
  const smoking = formData.get("smoking") ? 1 : 0
  const time = Number.parseInt(formData.get("time") || "0")



  const requestData = {
    age,
    sex,
    anaemia,
    creatinine_phosphokinase,
    diabetes,
    ejection_fraction,
    high_blood_pressure,
    platelets,
    serum_creatinine,
    serum_sodium,
    smoking,
    time,
  };


  const response = await fetch(process.env.AI_SERVER_ADDRESS + heart_api_link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.detail) {
      const error_msg = errorData.detail[0].loc[1] + " " + errorData.detail[0].msg;
      return {
        success: false,
        error_msg: error_msg
      }
    }
    else {
      throw new Error("Failed to fetch prediction from AI server");
    }
  }

  const result = await response.json();
  const riskPercentage = parseFloat((result.probability[0] * 100).toFixed(1));

  // Determine risk category
  let riskCategory
  if (riskPercentage < 20) {
    riskCategory = "Low"
  } else if (riskPercentage < 50) {
    riskCategory = "Moderate"
  } else if (riskPercentage < 75) {
    riskCategory = "High"
  } else {
    riskCategory = "Very High"
  }


  // save to db
  const { error: dbError } = await supabase.from("heart_disease_predictions").insert([
    {
      user_id: userId,
      prediction_time: new Date(),
      result: result.prediction,
      age,
      sex,
      anaemia,
      creatinine_phosphokinase,
      diabetes,
      ejection_fraction,
      high_blood_pressure,
      platelets,
      serum_creatinine,
      serum_sodium,
      smoking,
      time,
    },
  ]);

  if (dbError) {
    console.error("Error saving prediction to database:", dbError);
    return { success: false, error: "Failed to save prediction to database" };
  }


  return {
    success: true,
    riskPercentage,
    riskCategory,
    recommendations: getHeartRecommendations(riskCategory),
  }
}


function getHeartRecommendations(riskCategory) {
  const baseRecommendations = [
    "Maintain a healthy diet rich in fruits, vegetables, and whole grains",
    "Exercise regularly, aiming for at least 150 minutes of moderate activity per week",
    "Avoid smoking and limit alcohol consumption",
    "Manage stress through relaxation techniques or mindfulness",
  ]

  if (riskCategory === "Low") {
    return [...baseRecommendations, "Continue with regular health check-ups"]
  } else if (riskCategory === "Moderate") {
    return [
      ...baseRecommendations,
      "Schedule a follow-up with your healthcare provider",
      "Consider monitoring your blood pressure and cholesterol more frequently",
    ]
  } else {
    return [
      ...baseRecommendations,
      "Consult with a cardiologist as soon as possible",
      "Discuss medication options with your healthcare provider",
      "Consider more frequent cardiac monitoring",
    ]
  }
}

function getCancerRecommendations(riskCategory, cancerType) {
  const baseRecommendations = [
    "Maintain a healthy diet rich in fruits, vegetables, and whole grains",
    "Exercise regularly, aiming for at least 150 minutes of moderate activity per week",
    "Avoid smoking and limit alcohol consumption",
    "Protect your skin from excessive sun exposure",
  ]

  const breastSpecific = [
    "Perform monthly breast self-exams",
    "Schedule regular mammograms as recommended by your healthcare provider",
  ]

  if (riskCategory === "Low") {
    return [
      ...baseRecommendations,
      ...(cancerType === "breast" ? breastSpecific : []),
      "Continue with regular health check-ups",
    ]
  } else if (riskCategory === "Moderate") {
    return [
      ...baseRecommendations,
      ...(cancerType === "breast" ? breastSpecific : []),
      "Schedule a follow-up with your healthcare provider",
      "Consider more frequent cancer screenings",
    ]
  } else {
    return [
      ...baseRecommendations,
      ...(cancerType === "breast" ? breastSpecific : []),
      "Consult with an oncologist as soon as possible",
      "Discuss additional screening options with your healthcare provider",
    ]
  }
}


export async function getLatestPredictions(userId) {
  const { data: heartPredictions, error: heartError } = await supabase
    .from("heart_disease_predictions")
    .select("*")
    .eq("user_id", userId)
    .order("prediction_time", { ascending: false })
    .limit(10);

  const { data: cancerPredictions, error: cancerError } = await supabase
    .from("cancer_predictions")
    .select("*")
    .eq("user_id", userId)
    .order("prediction_time", { ascending: false })
    .limit(10);

  if (heartError || cancerError) {
    console.error("Error fetching predictions:", heartError || cancerError);
    return { success: false, error: "Failed to fetch predictions" };
  }

  return {
    success: true,
    heartPredictions,
    cancerPredictions,
  };
}