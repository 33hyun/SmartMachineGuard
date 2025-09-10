from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Smart Machine Guard API")

# 모델 로드
MODEL_PATH = "../models/xgb_final_model.pkl"
THRESHOLD = 0.43
MODEL_COLS = [
    'Air_temperature_K_', 'Process_temperature_K_', 'Rotational_speed_rpm_',
    'Torque_Nm_', 'Tool_wear_min_', 'Type_H', 'Type_L', 'Type_M'
]

model = joblib.load(MODEL_PATH)

# 입력 모델 (JSON에는 _ 없음)
class MachineInput(BaseModel):
    Air_temperature_K: float
    Process_temperature_K: float
    Rotational_speed_rpm: float
    Torque_Nm: float
    Tool_wear_min: float
    Type_H: int
    Type_L: int
    Type_M: int

@app.post("/predict")
def predict_failure(data: MachineInput):
    try:
        df = pd.DataFrame([data.model_dump()])

        # 컬럼명 변환
        rename_map = {
            "Air_temperature_K": "Air_temperature_K_",
            "Process_temperature_K": "Process_temperature_K_",
            "Rotational_speed_rpm": "Rotational_speed_rpm_",
            "Torque_Nm": "Torque_Nm_",
            "Tool_wear_min": "Tool_wear_min_"
        }
        df = df.rename(columns=rename_map)

        # 누락 컬럼 0으로 채우기
        for col in MODEL_COLS:
            if col not in df.columns:
                df[col] = 0

        df = df[MODEL_COLS]

        proba = model.predict_proba(df)[:, 1][0]
        pred = int(proba >= THRESHOLD)

        # numpy 타입 → 파이썬 기본 타입 변환
        return {"Machine_failure_probability": float(proba), "Predicted_failure": pred}

    except Exception as e:
        return {"error": str(e)}
