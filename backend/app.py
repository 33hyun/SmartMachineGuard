from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# 1. FastAPI 앱 생성
app = FastAPI(title="Smart Machine Guard API")

# 2. 모델 로드
model = joblib.load("../models/xgb_final_model.pkl")  # 기존 저장한 XGBoost 모델
THRESHOLD = 0.43  # 최적 임계값

# 3. 입력 데이터 모델 정의
class MachineInput(BaseModel):
    Air_temperature_K: float
    Process_temperature_K: float
    Rotational_speed_rpm: float
    Torque_Nm: float
    Tool_wear_min: float
    Type_L: int
    Type_M: int

# 4. 예측 API
@app.post("/predict")
def predict_failure(data: MachineInput):
    # 입력값 데이터프레임 변환
    df = pd.DataFrame([data.dict()])
    
    # 예측
    proba = model.predict_proba(df)[:, 1][0]
    prediction = int(proba >= THRESHOLD)
    
    return {"Machine_failure_probability": proba, "Predicted_failure": prediction}