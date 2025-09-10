from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import pandas as pd
import joblib
import logging
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

# -----------------------------
# 로깅 설정
# -----------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -----------------------------
# FastAPI 앱 생성
# -----------------------------
app = FastAPI(
    title="소성공정 고장예측 API",
    description="GradientBoosting 기반 제조 공정 고장 확률 예측",
    version="1.0"
)

# -----------------------------
# 모델 및 전처리 객체 로드
# -----------------------------
try:
    model = joblib.load('../models/best_model_GradientBoosting.pkl')
    scaler = joblib.load('../models/scaler.pkl')
    threshold = joblib.load('../models/best_threshold.pkl')
    feature_cols = joblib.load('../models/feature_cols.pkl')
    logger.info("GradientBoosting 모델 로드 완료")
except Exception as e:
    logger.error(f"모델 로드 실패: {e}")
    model = None
    threshold = 0.5
    feature_cols = None

# -----------------------------
# 입력 데이터 스키마
# -----------------------------
class ProcessData(BaseModel):
    air_temperature: float = Field(..., description="대기 온도 [K]", example=298.1)
    process_temperature: float = Field(..., description="공정 온도 [K]", example=308.6)
    rotational_speed: float = Field(..., description="회전 속도 [rpm]", example=1551)
    torque: float = Field(..., description="토크 [Nm]", example=42.8)
    tool_wear: float = Field(..., description="공구 마모 [min]", example=0)
    product_type: str = Field(..., description="제품 타입 (L, M, H)", example="M")

class BatchProcessData(BaseModel):
    data: List[ProcessData]

# -----------------------------
# 예측 결과 스키마
# -----------------------------
class PredictionResult(BaseModel):
    failure_probability: float
    failure_prediction: bool
    risk_level: str
    confidence: float
    recommendations: Optional[List[str]] = None
    feature_importance: Optional[str] = None

# -----------------------------
# 헬스 체크
# -----------------------------
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "threshold": threshold
    }

# -----------------------------
# 데이터 전처리
# -----------------------------
def preprocess_input(data: ProcessData) -> pd.DataFrame:
    # 1. 기본 데이터프레임 생성 (원본 컬럼명 사용)
    df = pd.DataFrame([{
        'Air temperature [K]': data.air_temperature,
        'Process temperature [K]': data.process_temperature,
        'Rotational speed [rpm]': data.rotational_speed,
        'Torque [Nm]': data.torque,
        'Tool wear [min]': data.tool_wear
    }])
    
    # 2. 파생 피처 생성
    df['Temp_diff'] = df['Process temperature [K]'] - df['Air temperature [K]']
    df['Power_factor'] = df['Torque [Nm]'] * df['Rotational speed [rpm]'] / 1000
    
    # 3. 제품 타입 원핫인코딩
    for col in ['Type_H','Type_L','Type_M']:
        df[col] = 0
    type_map = {'H':'Type_H','L':'Type_L','M':'Type_M'}
    if data.product_type in type_map:
        df[type_map[data.product_type]] = 1
    
    # 4. 스케일링
    numeric_cols = ['Air temperature [K]','Process temperature [K]',
                    'Rotational speed [rpm]','Torque [Nm]',
                    'Tool wear [min]','Temp_diff','Power_factor']
    if scaler is not None:
        df[numeric_cols] = scaler.transform(df[numeric_cols])
    
    # 5. 컬럼 순서 맞추기
    if feature_cols is not None:
        for col in feature_cols:
            if col not in df.columns:
                df[col] = 0
        df = df[feature_cols]
    
    return df

# -----------------------------
# 위험 수준 결정
# -----------------------------
def get_risk_level(prob: float) -> str:
    if prob < 0.3:
        return "낮음"
    elif prob < 0.5:
        return "보통"
    elif prob < 0.7:
        return "높음"
    else:
        return "매우 높음"

# -----------------------------
# 권장사항 생성
# -----------------------------
def get_recommendations(data: ProcessData, prob: float) -> List[str]:
    recs = []
    if prob > 0.5:
        recs.append("즉시 장비 점검을 실시하세요")
    if data.tool_wear > 200:
        recs.append("공구 교체를 고려하세요 (마모도 높음)")
    if data.torque > 60:
        recs.append("토크 값이 높습니다. 부하를 줄이세요")
    if data.rotational_speed > 2500:
        recs.append("회전 속도가 높습니다. 속도 조절을 고려하세요")
    if not recs:
        recs.append("현재 정상 운영 범위입니다")
    return recs

# -----------------------------
# Feature Importance → base64 변환
# -----------------------------
def plot_feature_importance(model, X_cols):
    if hasattr(model,'feature_importances_'):
        fi = pd.DataFrame({'feature': X_cols, 'importance': model.feature_importances_}).sort_values(
            'importance', ascending=False)
        fig = plt.figure(figsize=(6,4))
        sns.barplot(x='importance', y='feature', data=fi.head(10))
        plt.title("Feature Importance")
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        return img_base64
    return None

# -----------------------------
# 단일 데이터 예측
# -----------------------------
@app.post("/predict", response_model=PredictionResult)
def predict(data: ProcessData):
    if not model:
        raise HTTPException(status_code=503, detail="모델이 로드되지 않았습니다")
    
    try:
        X = preprocess_input(data)
        prob = model.predict_proba(X)[0,1]
        pred = prob >= threshold
        confidence = abs(prob - 0.5) * 2
        risk = get_risk_level(prob)
        recs = get_recommendations(data, prob)
        fi_img = plot_feature_importance(model, X.columns)
        
        return PredictionResult(
            failure_probability=float(prob),
            failure_prediction=bool(pred),
            risk_level=risk,
            confidence=float(confidence),
            recommendations=recs,
            feature_importance=fi_img
        )
    except Exception as e:
        logger.error(f"예측 오류: {e}")
        raise HTTPException(status_code=500, detail=f"예측 오류: {e}")

# -----------------------------
# 배치 데이터 예측
# -----------------------------
@app.post("/predict_batch")
def predict_batch(batch_data: BatchProcessData):
    results = []
    for data in batch_data.data:
        try:
            res = predict(data)
            results.append(res.dict())
        except Exception as e:
            results.append({"error": str(e), "data": data.dict()})
    return {"results": results}