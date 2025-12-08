/* eslint-disable no-unused-vars */
import {  useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { Loading } from './components/common/Loading';
import VoyagerForecastApp from './VoyagerForecastApp';
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading Basilisk Combat Intelligence..." />;
  }

  return user ? <Dashboard /> : <LoginPage />;
}

function App() {
  return (
    <>
    {/* <AuthProvider>
      <AppContent />
    </AuthProvider>  */}
    {/* <VirtualRingTryOn  />
     {/* <div style={{ padding: 20 }}>
      <h1>Tangiblee Adjustable Silhouette Demo</h1>
      <p>
        Example of integrating Tangiblee's virtual try-on experience in a React
        app.
      </p>
      <TangibleeWidget productId="RING12345" />
    </div> */}

    {/* <RingConfigurator /> */}

     {/* <div>
      <h2 style={{ textAlign: "center" }}>360° Product Viewer</h2>

      <Model360Viewer src={sword} />
    </div> */}
    {/* <RingTryOn /> */}
    <VoyagerForecastApp />
    </>
  );
}

export default App;