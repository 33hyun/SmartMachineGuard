import pandas as pd
import numpy as np
import joblib

# 모델/스케일러 로드
MODEL_PATH = "../models/xgb_final_model.pkl"
SCALER_PATH = "../models/scaler.pkl"
THRESHOLD = 0.43

NUMERIC_COLS = ["Air_temperature_K", "Process_temperature_K",
                "Rotational_speed_rpm", "Torque_Nm", "Tool_wear_min"]
TYPE_COLS = ["Type_L", "Type_M"]  # 학습 기준

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

def predict_failure(input_data: dict):
    """
    input_data: {컬럼명: 값, ...} 형태
    반환: {"pred": 0/1, "prob": float}
    """
    # 1. DataFrame 변환
    df = pd.DataFrame([input_data])
    
    # 2. Type 원-핫 인코딩
    if "Type" in df.columns:
        df = pd.get_dummies(df, columns=["Type"], drop_first=False)
    for col in TYPE_COLS:
        if col not in df.columns:
            df[col] = 0
    df = df[NUMERIC_COLS + TYPE_COLS]
    
    # 3. 스케일링
    df[NUMERIC_COLS] = scaler.transform(df[NUMERIC_COLS])
    
    # 4. 예측
    proba = model.predict_proba(df)[:, 1][0]
    pred = int(proba >= THRESHOLD)
    
    return {"pred": pred, "prob": proba}