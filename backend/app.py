from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

# 1. FastAPI 앱 생성
app = FastAPI(title="Smart Machine Guard API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발단계에서는 * 허용, 나중에 도메인 지정 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 모델 로드
MODEL_PATH = "../models/xgb_final_model.pkl"
THRESHOLD = 0.7

# 학습 시 사용 컬럼 (모든 필요 컬럼 포함)
MODEL_COLS = [
    'Air_temperature_K_', 'Process_temperature_K_', 'Rotational_speed_rpm_',
    'Torque_Nm_', 'Tool_wear_min_', 'Type_H', 'Type_L', 'Type_M'
]

# 모델 로드
model = joblib.load(MODEL_PATH)

# 3. 입력 데이터 모델 정의 (JSON에는 _ 없음)
class MachineInput(BaseModel):
    Air_temperature_K: float
    Process_temperature_K: float
    Rotational_speed_rpm: float
    Torque_Nm: float
    Tool_wear_min: float
    Type_H: int
    Type_L: int
    Type_M: int

# 4. 예측 API
@app.post("/predict")
def predict_failure(data: MachineInput):
    try:
        # 4-1. DataFrame 변환 (pydantic v2: model_dump())
        df = pd.DataFrame([data.model_dump()])

        # 4-2. 컬럼명 변환 (JSON → 학습 컬럼)
        rename_map = {
            "Air_temperature_K": "Air_temperature_K_",
            "Process_temperature_K": "Process_temperature_K_",
            "Rotational_speed_rpm": "Rotational_speed_rpm_",
            "Torque_Nm": "Torque_Nm_",
            "Tool_wear_min": "Tool_wear_min_"
        }
        df = df.rename(columns=rename_map)

        # 4-3. 누락 컬럼 자동 0 채움
        for col in MODEL_COLS:
            if col not in df.columns:
                df[col] = 0

        # 4-4. 컬럼 순서 맞춤
        df = df[MODEL_COLS]

        # 4-5. 예측
        proba = model.predict_proba(df)[:, 1][0]
        pred = int(proba >= THRESHOLD)

        # 4-6. numpy 타입 → 파이썬 기본 타입 변환
        return {"Machine_failure_probability": float(proba), "Predicted_failure": pred}

    except Exception as e:
        return {"error": str(e)}
