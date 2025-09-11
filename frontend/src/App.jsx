import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { api } from './api';
import ProcessInputForm from './components/ProcessInputForm';
import PredictionResults from './components/PredictionResults';

const App = () => {
  const [health, setHealth] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 헬스 체크
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthData = await api.healthCheck();
        setHealth(healthData);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 30초마다 체크
    return () => clearInterval(interval);
  }, []);

  // 예측 실행
  const handlePredict = async (formData) => {
    setLoading(true);
    try {
      const result = await api.predict(formData);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('예측 실행 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* 헤더 */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                소성공정 고장예측 시스템
              </h1>
              <p className="text-gray-400 mt-2">AI 기반 실시간 제조 공정 모니터링</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                health?.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  health?.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
                } animate-pulse`}></div>
                <span className="text-sm font-medium">
                  {health?.status === 'healthy' ? '시스템 정상' : '시스템 오류'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 폼 */}
          <div>
            <ProcessInputForm onSubmit={handlePredict} loading={loading} />
          </div>

          {/* 예측 결과 */}
          <div>
            {prediction ? (
              <PredictionResults result={prediction} />
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 flex items-center justify-center h-full">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">공정 파라미터를 입력하고<br />예측 버튼을 클릭하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <p>©소성 공정 고장 예측 프로그램</p>
            <p>GradientBoosting ML Model v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;