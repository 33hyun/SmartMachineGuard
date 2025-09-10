import React, { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
} from "recharts";

function App() {
  const [form, setForm] = useState({
    Air_temperature_K: "",
    Process_temperature_K: "",
    Rotational_speed_rpm: "",
    Torque_Nm: "",
    Tool_wear_min: "",
    Type_H: 0,
    Type_L: 0,
    Type_M: 0,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Type 셀렉트 박스 전용
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      Type_H: value === "H" ? 1 : 0,
      Type_L: value === "L" ? 1 : 0,
      Type_M: value === "M" ? 1 : 0,
    });
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
          Type_H: form.Type_H,
          Type_L: form.Type_L,
          Type_M: form.Type_M,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const chartData = result
    ? [
        {
          name: "Failure Probability",
          value: result.Machine_failure_probability * 100,
          fill: "#ef4444",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center text-white px-4">
      <header className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-teal-400 drop-shadow-lg">
          Smart Machine Guard
        </h1>
        <p className="text-gray-300 mt-2">
          Predict machine failure with AI in real-time 🚀
        </p>
      </header>

      <main className="w-full max-w-3xl bg-gray-800 shadow-lg rounded-2xl p-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-gray-300">Air Temperature (K)</label>
            <input
              type="number"
              name="Air_temperature_K"
              value={form.Air_temperature_K}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Process Temperature (K)</label>
            <input
              type="number"
              name="Process_temperature_K"
              value={form.Process_temperature_K}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Rotational Speed (rpm)</label>
            <input
              type="number"
              name="Rotational_speed_rpm"
              value={form.Rotational_speed_rpm}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Torque (Nm)</label>
            <input
              type="number"
              name="Torque_Nm"
              value={form.Torque_Nm}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Tool Wear (min)</label>
            <input
              type="number"
              name="Tool_wear_min"
              value={form.Tool_wear_min}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Machine Type</label>
            <select
              onChange={handleTypeChange}
              className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-teal-400 outline-none"
            >
              <option value="">Select Type</option>
              <option value="H">Type H</option>
              <option value="L">Type L</option>
              <option value="M">Type M</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-lg font-semibold rounded-xl shadow-md transition"
            >
              Predict Failure
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">
              Prediction Result
            </h2>
            <p className="text-lg">
              <span className="font-bold text-red-400">Failure Probability:</span>{" "}
              {(result.Machine_failure_probability * 100).toFixed(2)}%
            </p>
            <p className="text-lg">
              <span className="font-bold text-yellow-400">Predicted Failure:</span>{" "}
              {result.Predicted_failure === 1 ? "⚠️ Yes" : "✅ No"}
            </p>

            {/* Radial Chart */}
            <div className="flex justify-center mt-8">
              <RadialBarChart
                width={300}
                height={300}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={20}
                data={chartData}
              >
                <RadialBar
                  minAngle={15}
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={{ color: "white" }}
                />
                <Tooltip />
              </RadialBarChart>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;