import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    Air_temperature_K: "",
    Process_temperature_K: "",
    Rotational_speed_rpm: "",
    Torque_Nm: "",
    Tool_wear_min: "",
    Type_H: "",
    Type_L: "",
    Type_M: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Air_temperature_K: parseFloat(form.Air_temperature_K),
          Process_temperature_K: parseFloat(form.Process_temperature_K),
          Rotational_speed_rpm: parseFloat(form.Rotational_speed_rpm),
          Torque_Nm: parseFloat(form.Torque_Nm),
          Tool_wear_min: parseFloat(form.Tool_wear_min),
          Type_H: parseInt(form.Type_H),
          Type_L: parseInt(form.Type_L),
          Type_M: parseInt(form.Type_M),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Machine Guard</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label>{key}: </label>
            <input
              type="number"
              step="any"
              name={key}
              value={form[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Prediction Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;