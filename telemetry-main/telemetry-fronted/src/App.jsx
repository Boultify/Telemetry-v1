<<<<<<< HEAD
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { FleetProvider } from './context/FleetContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import History from './pages/History';
import Logs from './pages/Logs';
import Safety from './pages/Safety';
import Admin from './pages/Admin';
import Alerts from './pages/Alerts';
import Layout from './Layout';

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen text-primary animate-pulse">
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return children;
};

const RoleRoute = ({ children, allow }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (allow === 'admin' && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (allow === 'user' && isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

const HomeRedirect = () => {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRedirect />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="profile"
          element={
            <RoleRoute allow="user">
              <Profile />
            </RoleRoute>
          }
        />
        <Route path="alerts" element={<Alerts />} />
        <Route
          path="admin"
          element={
            <RoleRoute allow="admin">
              <Admin />
            </RoleRoute>
          }
        />
        <Route
          path="history"
          element={
            <RoleRoute allow="admin">
              <History />
            </RoleRoute>
          }
        />
        <Route
          path="logs"
          element={
            <RoleRoute allow="admin">
              <Logs />
            </RoleRoute>
          }
        />
        <Route
          path="safety"
          element={
            <RoleRoute allow="admin">
              <Safety />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <FleetProvider>
            <AppRoutes />
          </FleetProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import History from './pages/History';
import Logs from './pages/Logs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="admin" element={<Admin />} />
          <Route path="history" element={<History />} />
          <Route path="logs" element={<Logs />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> 10094c2d7d52891488b78219451e613e4315e280
