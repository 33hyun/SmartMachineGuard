import React from 'react';
import { AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import StatusCard from './StatusCard';

const PredictionResults = ({ result }) => {
  if (!result) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case '낮음': return 'text-green-300';
      case '보통': return 'text-yellow-300';
      case '높음': return 'text-orange-300';
      case '매우 높음': return 'text-red-300';
      default: return 'text-gray-300';
    }
  };

  const getRiskBgColor = (level) => {
    switch (level) {
      case '낮음': return 'bg-green-500/10 border-green-400/40 backdrop-blur-sm';
      case '보통': return 'bg-yellow-500/10 border-yellow-400/40 backdrop-blur-sm';
      case '높음': return 'bg-orange-500/10 border-orange-400/40 backdrop-blur-sm';
      case '매우 높음': return 'bg-red-500/10 border-red-400/40 backdrop-blur-sm';
      default: return 'bg-gray-500/10 border-gray-400/40 backdrop-blur-sm';
    }
  };

  return (
    <div className="space-y-6">
      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="고장 확률"
          value={`${(result.failure_probability * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color={result.failure_probability > 0.5 ? 'text-red-300' : 'text-green-300'}
          subtitle={result.failure_prediction ? '고장 예상' : '정상 운영'}
        />
        <StatusCard
          title="위험 수준"
          value={result.risk_level}
          icon={AlertTriangle}
          color={getRiskColor(result.risk_level)}
        />
        <StatusCard
          title="신뢰도"
          value={`${(result.confidence * 100).toFixed(1)}%`}
          icon={Activity}
          color="text-blue-400"
        />
      </div>

      {/* 권장사항 */}
      <div className={`rounded-2xl p-6 border-2 ${getRiskBgColor(result.risk_level)}`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          권장사항
        </h3>
        <ul className="space-y-3">
          {result.recommendations?.map((rec, index) => (
            <li key={index} className="text-gray-100 flex items-start gap-3 text-sm leading-relaxed">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span className="font-medium">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Feature Importance 차트 */}
      {result.feature_importance && (
        <div className="bg-white/8 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-400" />
            특성 중요도
          </h3>
          <div className="flex justify-center bg-white/5 rounded-xl p-4">
            <img 
              src={`data:image/png;base64,${result.feature_importance}`} 
              alt="Feature Importance"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;