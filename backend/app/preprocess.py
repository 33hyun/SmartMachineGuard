import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# 1. 데이터 불러오기
data = pd.read_csv("../../data/ai4i.csv")

# 2. 결측치 확인
print("결측치 확인:", data.isnull().sum())

# (이번 데이터는 결측치 없음, 필요시 처리)
# data = data.fillna(method='ffill')  # 예시

# 3. 이상치 처리 (간단히 z-score 기반 예시)
from scipy.stats import zscore
numeric_cols = ["Air temperature [K]", "Process temperature [K]", "Rotational speed [rpm]", 
                "Torque [Nm]", "Tool wear [min]"]

data[numeric_cols] = data[numeric_cols].apply(lambda x: x[(zscore(x).abs() < 3)])

# 4. 범주형 변수 원-핫 인코딩
categorical_cols = ["Type"]
data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)

# 5. Feature / Target 분리
X = data.drop(columns=["UDI", "Product ID", "Machine failure", "TWF","HDF","PWF","OSF","RNF"])
y = data["Machine failure"]

# 6. 학습/검증/테스트 분리
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)

# 7. 정규화 (StandardScaler)
scaler = StandardScaler()
X_train[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])
X_val[numeric_cols] = scaler.transform(X_val[numeric_cols])
X_test[numeric_cols] = scaler.transform(X_test[numeric_cols])

# 8. 데이터 확인
print("학습용 데이터 shape:", X_train.shape)
print("검증용 데이터 shape:", X_val.shape)
print("테스트용 데이터 shape:", X_test.shape)

# 9. 필요 시 CSV 저장
X_train.to_csv("../../data/X_train.csv", index=False)
X_val.to_csv("../../data/X_val.csv", index=False)
X_test.to_csv("../../data/X_test.csv", index=False)
y_train.to_csv("../../data/y_train.csv", index=False)
y_val.to_csv("../../data/y_val.csv", index=False)
y_test.to_csv("../../data/y_test.csv", index=False)
