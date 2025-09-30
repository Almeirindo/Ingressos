// routes/privateRoutes.tsx
import { Route } from "react-router-dom";
import MyPurchasesPage from "../pages/profile/MyPurchasesPage";
import ProfilePage from "../pages/profile/ProfilePage";
import PaymentPage from "../pages/profile/PaymentPage";
import TicketPage from "../pages/profile/TicketPage";
import Dashboard from "../pages/profile/Dashboard";
import EventsPage from "../pages/profile/ProfileEventsPage"; // 👈 usa a versão profile
import { PrivateRouteWrapper } from "../helpers/PrivateRouteWrapper";
import ProfileLayout from "../layouts/ProfileLayout";

export const privateRoutes = [
  <Route
    path="/"
    element={
      <PrivateRouteWrapper>
        <ProfileLayout />
      </PrivateRouteWrapper>
    }
    key="profile-layout"
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="me/events" element={<EventsPage />} />
    <Route path="me/purchases" element={<MyPurchasesPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="payment" element={<PaymentPage />} />
    <Route path="ticket/:id" element={<TicketPage />} />
  </Route>,
];
