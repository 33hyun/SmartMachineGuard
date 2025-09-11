import React from "react";

const StatusCard = (props) => {
  const { title, value, icon: Icon, color, subtitle } = props;
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-xl ${
            color.includes("red")
              ? "bg-red-500/20"
              : color.includes("yellow")
              ? "bg-yellow-500/20"
              : color.includes("green")
              ? "bg-green-500/20"
              : "bg-blue-500/20"
          }`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;