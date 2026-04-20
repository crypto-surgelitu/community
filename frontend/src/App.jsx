import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Members from './pages/Members';
import Settings from './pages/Settings';
import CaseManagerWork from './pages/CaseManagerWork';
import EventForm from './pages/EventForm';
import NotFound from './pages/NotFound';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DashboardLayout } from './components/common/DashboardLayout';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (user) return <Navigate to="/dashboard" />;
  
  return children;
}

function HomeLoader() {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            <Route path="/" element={<HomeLoader />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            
<Route path="/members" element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } />
            
            <Route path="/events/new" element={
              <ProtectedRoute>
                <EventForm />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['community_manager', 'admin']}>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="/mywork" element={
              <ProtectedRoute allowedRoles={['case_manager', 'community_manager']}>
                <CaseManagerWork />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
