import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MOUs from './pages/MOUs';
import NPTELCertifications from './pages/NPTELCertifications';
import Achievements from './pages/Achievements';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import ManageMOUs from './pages/admin/ManageMOUs';
import ManageNPTEL from './pages/admin/ManageNPTEL';
import ManageAchievements from './pages/admin/ManageAchievements';
import CreateMOU from './pages/admin/CreateMOU';
import EditMOU from './pages/admin/EditMOU';
import CreateNPTEL from './pages/admin/CreateNPTEL';
import CreateAchievement from './pages/admin/CreateAchievement';

// Utils
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/mous" element={<MOUs />} />
              <Route path="/nptel" element={<NPTELCertifications />} />
              <Route path="/achievements" element={<Achievements />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/create" 
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/mous" 
                element={
                  <ProtectedRoute>
                    <ManageMOUs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/mous/create" 
                element={
                  <ProtectedRoute>
                    <CreateMOU />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/mous/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditMOU />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/nptel" 
                element={
                  <ProtectedRoute>
                    <ManageNPTEL />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/nptel/create" 
                element={
                  <ProtectedRoute>
                    <CreateNPTEL />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/achievements" 
                element={
                  <ProtectedRoute>
                    <ManageAchievements />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/achievements/create" 
                element={
                  <ProtectedRoute>
                    <CreateAchievement />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h1 className="text-3xl font-bold text-secondary-900 mb-2">Page Not Found</h1>
                      <p className="text-secondary-600 mb-6">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn-primary">
                        Go Home
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
          <Footer />
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;