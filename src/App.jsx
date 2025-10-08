import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { Loading } from './components/common/Loading';
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading Basilisk Combat Intelligence..." />;
  }

  return user ? <Dashboard /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;