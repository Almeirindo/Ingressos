// routes/privateRoutes.tsx
import { Route } from "react-router-dom";
import MyPurchasesPage from "../pages/MyPurchasesPage";
import ProfilePage from "../pages/ProfilePage";
import PaymentPage from "../pages/PaymentPage";
import TicketPage from "../pages/TicketPage";
import { PrivateRouteWrapper } from "../helpers/PrivateRouteWrapper";
import Dashboard from "../pages/Dashboard";
import EventsPage from "../pages/EventsPage";

export const privateRoutes = [
    <Route
        path="/dashboard"
        element={
            <PrivateRouteWrapper>
                <Dashboard />
            </PrivateRouteWrapper>}
        key="/dashboard" />,
    <Route
        path="/me/events"
        element={
            <PrivateRouteWrapper>
                <EventsPage />
            </PrivateRouteWrapper>}
        key="/me/events" />,
    <Route
        path="/me/purchases"
        element={
            <PrivateRouteWrapper>
                <MyPurchasesPage />
            </PrivateRouteWrapper>}
        key="/me/purchases" />,

    <Route
        path="/profile"
        element={
            <PrivateRouteWrapper>
                <ProfilePage />
            </PrivateRouteWrapper>}
        key="/profile" />,

    <Route
        path="/payment"
        element={
            <PrivateRouteWrapper>
                <PaymentPage />
            </PrivateRouteWrapper>
        }
        key="/payment" />,

    <Route
        path="/ticket/:id"
        element={
            <PrivateRouteWrapper>
                <TicketPage />
            </PrivateRouteWrapper>
        }
        key="/ticket/:id" />,
];
