// routes/authRoutes.tsx
import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export const authRoutes = [
  <Route path="/login" element={<LoginPage />} key="/login" />,
  <Route path="/register" element={<RegisterPage />} key="/register" />,
  <Route path="/forgot-password" element={<ForgotPasswordPage />} key="/forgot-password" />,
  <Route path="/reset-password" element={<ResetPasswordPage />} key="/reset-password" />,
];
