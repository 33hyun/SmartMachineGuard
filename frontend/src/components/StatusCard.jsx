import React from 'react';

const StatusCard = (props) => {
  const { title, value, icon: Icon, color, subtitle } = props;
  
  return (
    <div className="bg-white/12 backdrop-blur-lg rounded-2xl p-6 border border-white/25 hover:border-white/40 transition-all duration-300 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-200 text-sm font-medium mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1 drop-shadow-sm`}>{value}</p>
          {subtitle && <p className="text-gray-200 text-xs mt-2 font-medium">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color.includes('red') ? 'bg-red-500/25 border border-red-400/30' : 
                                          color.includes('yellow') ? 'bg-yellow-500/25 border border-yellow-400/30' : 
                                          color.includes('green') ? 'bg-green-500/25 border border-green-400/30' : 
                                          color.includes('orange') ? 'bg-orange-500/25 border border-orange-400/30' :
                                          'bg-blue-500/25 border border-blue-400/30'} backdrop-blur-sm`}>
          <Icon className={`w-6 h-6 ${color} drop-shadow-sm`} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;