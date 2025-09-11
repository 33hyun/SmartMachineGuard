import React, { useState } from "react";
import {
  Activity,
  Thermometer,
  RotateCcw,
  Gauge,
  Settings,
  Zap,
} from "lucide-react";

const ProcessInputForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    air_temperature: 298.1,
    process_temperature: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 0,
    product_type: "M",
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputFields = [
    {
      key: "air_temperature",
      label: "대기 온도",
      unit: "K",
      icon: Thermometer,
      min: 250,
      max: 350,
    },
    {
      key: "process_temperature",
      label: "공정 온도",
      unit: "K",
      icon: Thermometer,
      min: 250,
      max: 350,
    },
    {
      key: "rotational_speed",
      label: "회전 속도",
      unit: "rpm",
      icon: RotateCcw,
      min: 0,
      max: 3000,
    },
    { key: "torque", label: "토크", unit: "Nm", icon: Gauge, min: 0, max: 100 },
    {
      key: "tool_wear",
      label: "공구 마모",
      unit: "min",
      icon: Settings,
      min: 0,
      max: 300,
    },
  ];

  const renderInputField = (field) => {
    const { key, label, unit, icon: IconComponent, min, max } = field;

    return (
      <div key={key} className="space-y-2">
        <label className="flex items-center gap-2 text-gray-300 font-medium">
          <IconComponent className="w-4 h-4" />
          {label} ({unit})
        </label>
        <input
          type="number"
          value={formData[key]}
          onChange={(e) => handleChange(key, parseFloat(e.target.value))}
          min={min}
          max={max}
          step="0.1"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
        />
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Activity className="w-8 h-8 text-blue-400" />
        공정 파라미터 입력
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map(renderInputField)}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-300 font-medium">
              <Zap className="w-4 h-4" />
              제품 타입
            </label>
            <select
              value={formData.product_type}
              onChange={(e) => handleChange("product_type", e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            >
              <option value="L" className="bg-gray-800">
                Low (L)
              </option>
              <option value="M" className="bg-gray-800">
                Medium (M)
              </option>
              <option value="H" className="bg-gray-800">
                High (H)
              </option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              예측 중...
            </div>
          ) : (
            "고장 확률 예측하기"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProcessInputForm;