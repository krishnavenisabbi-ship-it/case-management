import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PublicCaseView from "./pages/PublicCaseView.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AuthCallback from "./components/AuthCallback.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const API = import.meta.env.VITE_BACKEND_URL || "";

function AppRouter() {
  const location = useLocation();
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  // Synchronous check for session_id in URL fragment before any route renders
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/case/:shareToken" element={<PublicCaseView />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppRouter />;
}

export { API };
