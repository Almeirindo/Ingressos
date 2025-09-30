import { Routes, Route } from "react-router-dom";

import { publicRoutes } from "../routes/publicRoutes";
import { authRoutes } from "../routes/authRoutes";
import { privateRoutes } from "../routes/privateRoutes";
import { adminRoutes } from "../routes/adminRoutes";
// import { adminRoutes } from "../routes/adminRoutes";

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
