import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  useLocation
} from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Footer from './components/layout/Footer';
import BackgroundChakra from './components/layout/BackgroundChakra';
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
import AdminDashboard from './components/admin/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import KidsSection from './components/kids/KidsSection';
import Header from './components/common/Header';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserInfo from './components/layout/UserInfo';
import QuestionReview from './components/admin/QuestionReview';
import ArticleManager from './components/admin/ArticleManager';
import VideoManager from './components/admin/VideoManager';
import BusinessDirectory from './components/business/BusinessDirectory';
import BusinessDetails from './components/business/BusinessDetails';
import BusinessManager from './components/admin/BusinessManager';
import EventCalendar from './components/events/EventCalendar';
import EventManager from './components/admin/EventManager';
import HomePage from './components/home/HomePage';


// Temporary placeholder components
const Business = () => <div>Business Directory</div>;

// Create an AppContent component that can use hooks
const AppContent = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [returnPath, setReturnPath] = useState(null);
  const location = useLocation();  // This is now safe to use

  const handleLoginClick = (path) => {
    setReturnPath(path || location.pathname);
    setLoginOpen(true);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <BackgroundChakra />
        <Header 
          onLoginClick={() => handleLoginClick()}
        />
        <UserInfo />
        <Box component="main" sx={{ 
          flexGrow: 1,
          position: 'relative',
          zIndex: 1
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/business" element={<BusinessDirectory />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
            <Route path="/kids" element={
              <KidsSection 
                onLoginClick={(returnPath) => {
                  setReturnPath(returnPath);
                  setLoginOpen(true);
                }}
              />
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/questions" 
              element={
                <ProtectedRoute requireAdmin>
                  <QuestionReview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/articles" 
              element={
                <ProtectedRoute requireAdmin>
                  <ArticleManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/videos" 
              element={
                <ProtectedRoute requireAdmin>
                  <VideoManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/businesses" 
              element={
                <ProtectedRoute requireAdmin>
                  <BusinessManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <EventCalendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute isAdmin>
                  <EventManager />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Box>
        <Footer />
        <Login 
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          returnPath={returnPath}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1200
          }}
        />
      </Box>
    </>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
