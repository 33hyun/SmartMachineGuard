import { useState } from "react";
import InputForm from "./components/InputForm";

function App() {
  const [result, setResult] = useState(null);

  const handleSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">소성공정 고장 예측</h1>
      <InputForm onSubmit={handleSubmit} />

      {result && (
        <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow space-y-2">
          <p>고장 확률: {(result.failure_probability * 100).toFixed(2)}%</p>
          <p>예측 결과: {result.failure_prediction ? "고장" : "정상"}</p>
          <p>위험 수준: {result.risk_level}</p>
          <p>신뢰도: {(result.confidence * 100).toFixed(1)}%</p>
          <ul className="list-disc list-inside">
            {result.recommendations.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;