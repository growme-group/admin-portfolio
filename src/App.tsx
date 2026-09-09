import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { Toaster } from 'sonner';

import AdminLogin from '@/pages/AdminLogin/index';
import AdminDashboard from '@/pages/AdminDashboard/index';
import AdminPortfolio from '@/pages/AdminPortfolio/index';
import AdminInquiries from '@/pages/AdminInquiries/index';
import AdminServices from '@/pages/AdminServices/index';
import AdminPricing from '@/pages/AdminPricing/index';
import AdminFaqs from '@/pages/AdminFaqs/index';
import AdminTestimonials from '@/pages/AdminTestimonials/index';
import AdminSettings from '@/pages/AdminSettings/index';
import AdminProfile from '@/pages/AdminProfile/index';
import AdminUsers from '@/pages/AdminUsers/index';

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AdminLogin />} />
              <Route
                path="/"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <AdminProtectedRoute>
                    <AdminPortfolio />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/inquiries"
                element={
                  <AdminProtectedRoute>
                    <AdminInquiries />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <AdminProtectedRoute>
                    <AdminServices />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <AdminProtectedRoute>
                    <AdminPricing />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/faqs"
                element={
                  <AdminProtectedRoute>
                    <AdminFaqs />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/testimonials"
                element={
                  <AdminProtectedRoute>
                    <AdminTestimonials />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <AdminProtectedRoute>
                    <AdminSettings />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <AdminProtectedRoute>
                    <AdminProfile />
                  </AdminProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
