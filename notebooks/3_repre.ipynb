{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "f0040e39",
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "import numpy as np\n",
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.preprocessing import StandardScaler\n",
    "\n",
    "from scipy.stats import zscore\n",
    "\n",
    "# 데이터 부ㄹ러오기\n",
    "data = pd.read_csv(\"../data/raw/ai4i2020.csv\")"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "id": "de1d69cd",
   "metadata": {},
   "outputs": [],
   "source": [
    "# 이상치 처리 (Z-score 기준)\n",
    "from scipy.stats import zscore\n",
    "numeric_cols = [\"Air temperature [K]\", \"Process temperature [K]\", \"Rotational speed [rpm]\", \n",
    "                \"Torque [Nm]\", \"Tool wear [min]\"]\n",
    "\n",
    "# Z-score 3 이상 값 제거\n",
    "data = data[(zscore(data[numeric_cols]).abs() < 3).all(axis=1)]"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "id": "4e577206",
   "metadata": {},
   "outputs": [],
   "source": [
    "# 범주형 변수 원-핫 인코딩\n",
    "categorical_cols = [\"Type\"]\n",
    "data = pd.get_dummies(data, columns=categorical_cols, drop_first=False)  # drop_first=False로 타입 유지"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "id": "8f7ce096",
   "metadata": {},
   "outputs": [],
   "source": [
    "# 타겟 / 피처 분리\n",
    "X = data.drop(columns=[\n",
    "    \"UDI\", \"Product ID\", \"Machine failure\", \"TWF\", \"HDF\", \"PWF\", \"OSF\", \"RNF\"\n",
    "])\n",
    "y = data[\"Machine failure\"]"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "id": "2e6af9aa",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "증강 후 데이터 크기: (10822, 8) (10822,)\n"
     ]
    }
   ],
   "source": [
    "# 클래스 불균형 처리\n",
    "\n",
    "# 고장 데이터만 추출\n",
    "fault_data = data[data[\"Machine failure\"] == 1]\n",
    "n_aug = 1000  # 증강할 샘플 수\n",
    "\n",
    "# 수치형 컬럼 평균/표준편차 기반 샘플 생성\n",
    "augmented_samples = pd.DataFrame({\n",
    "    col: np.random.normal(loc=fault_data[col].mean(),\n",
    "                          scale=fault_data[col].std(),\n",
    "                          size=n_aug)\n",
    "    for col in numeric_cols\n",
    "})\n",
    "\n",
    "# Type 컬럼 랜덤 배분\n",
    "type_cols = [col for col in X.columns if \"Type_\" in col]\n",
    "chosen_types = np.random.choice(type_cols, size=n_aug, replace=True)\n",
    "\n",
    "for t in type_cols:\n",
    "    augmented_samples[t] = 0\n",
    "\n",
    "for i, t in enumerate(chosen_types):\n",
    "    augmented_samples.loc[i, t] = 1\n",
    "\n",
    "# 타겟 라벨 1\n",
    "augmented_y = pd.Series([1]*n_aug)\n",
    "\n",
    "# 기존 데이터와 합치기\n",
    "X = pd.concat([X, augmented_samples], axis=0).reset_index(drop=True)\n",
    "y = pd.concat([y, augmented_y], axis=0).reset_index(drop=True)\n",
    "\n",
    "print(\"증강 후 데이터 크기:\", X.shape, y.shape)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "id": "7b24ee86",
   "metadata": {},
   "outputs": [],
   "source": [
    "# 학습/검증/테스트 분리\n",
    "X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)\n",
    "X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "id": "6f123d3b",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "Machine failure\n",
       "0    9529\n",
       "1     293\n",
       "Name: count, dtype: int64"
      ]
     },
     "execution_count": 7,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "data['Machine failure'].value_counts()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "id": "0b444f47",
   "metadata": {},
   "outputs": [],
   "source": [
    "# 수치형 컬럼 정규화\n",
    "scaler = StandardScaler()\n",
    "X_train[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])\n",
    "X_val[numeric_cols] = scaler.transform(X_val[numeric_cols])\n",
    "X_test[numeric_cols] = scaler.transform(X_test[numeric_cols])"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 9,
   "id": "02ee98ee",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "학습 데이터: (7575, 8) (7575,)\n",
      "검증 데이터: (1623, 8) (1623,)\n",
      "테스트 데이터: (1624, 8) (1624,)\n"
     ]
    }
   ],
   "source": [
    "# 데이터 확인\n",
    "print(\"학습 데이터:\", X_train.shape, y_train.shape)\n",
    "print(\"검증 데이터:\", X_val.shape, y_val.shape)\n",
    "print(\"테스트 데이터:\", X_test.shape, y_test.shape)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 10,
   "id": "65b6d134",
   "metadata": {},
   "outputs": [],
   "source": [
    "# 데이터 저장\n",
    "X_train.to_csv(\"../data/X_train.csv\", index=False)\n",
    "X_val.to_csv(\"../data/X_val.csv\", index=False)\n",
    "X_test.to_csv(\"../data/X_test.csv\", index=False)\n",
    "y_train.to_csv(\"../data/y_train.csv\", index=False)\n",
    "y_val.to_csv(\"../data/y_val.csv\", index=False)\n",
    "y_test.to_csv(\"../data/y_test.csv\", index=False)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "fbea9fd2",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "smg",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.9.23"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
