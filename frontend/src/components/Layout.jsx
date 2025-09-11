function Layout({ children }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          소성 공정 고장 예측 프로그램
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;