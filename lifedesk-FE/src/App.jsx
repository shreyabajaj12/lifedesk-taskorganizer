import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import DailyPlan from "./pages/DailyPlan";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Profile from "./pages/Profile";
import Settings from "./pages/Setting";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/oauth2/success" element={<OAuthSuccess />} />
        

        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />

        <Route
          path="/tasks"
          element={
            <AppLayout>
              <Tasks />
            </AppLayout>
          }
        />

        <Route
          path="/daily-plan"
          element={
            <AppLayout>
              <DailyPlan />
            </AppLayout>
          }
        />


        <Route
          path="/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
