import { useState } from "react";

export default function InputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    air_temperature: "",
    process_temperature: "",
    rotational_speed: "",
    torque: "",
    tool_wear: "",
    product_type: "M",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // 부모(App)로 데이터 전달
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      <div>
        <label className="block mb-1 font-medium">대기 온도 [K]</label>
        <input
          type="number"
          name="air_temperature"
          value={formData.air_temperature}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">공정 온도 [K]</label>
        <input
          type="number"
          name="process_temperature"
          value={formData.process_temperature}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">회전 속도 [rpm]</label>
        <input
          type="number"
          name="rotational_speed"
          value={formData.rotational_speed}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">토크 [Nm]</label>
        <input
          type="number"
          name="torque"
          value={formData.torque}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">공구 마모 [min]</label>
        <input
          type="number"
          name="tool_wear"
          value={formData.tool_wear}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">제품 타입</label>
        <select
          name="product_type"
          value={formData.product_type}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="L">L</option>
          <option value="M">M</option>
          <option value="H">H</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        예측하기
      </button>
    </form>
  );
}