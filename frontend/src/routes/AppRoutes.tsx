import { Routes, Route } from "react-router-dom";

import { publicRoutes } from "../routes/PublicRoutes";
import { authRoutes } from "../routes/AuthRoutes";
import { privateRoutes } from "../routes/PrivateRoutes";
import { adminRoutes } from "../routes/AdminRoutes";

import NotFoundPage from "../pages/NotFoundPage";


export default function AppRoutes() {
  return (
    <Routes>
      {publicRoutes}
      {authRoutes}
      {privateRoutes}
      {adminRoutes}
      
      {/* Rota global NotFound */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
