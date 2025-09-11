import Layout from "../components/Layout";
import InputForm from "../components/InputForm";
import PredictionResult from "../components/PredictionResult";
import FeatureImportance from "../components/FeatureImportance";

function Dashboard() {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 - 입력 폼 */}
        <div className="lg:col-span-1">
          <InputForm />
        </div>

        {/* 오른쪽 - 결과 및 feature importance */}
        <div className="lg:col-span-2 space-y-6">
          <PredictionResult />
          <FeatureImportance />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;