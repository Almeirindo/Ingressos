import { Route } from "react-router-dom";
import AdminEventsPage from "../pages/admin/AdminEventsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminUsersPurchasesPage from "../pages/admin/AdminUsersPurchasesPage";
import { AdminRouteWrapper } from "../helpers/AdminRouteWrapper";
import AdminDashboard from "../pages/admin/AdminDashboard";

export const adminRoutes = [
    <Route
        path="/admin/dashboard"
        element={
            <AdminRouteWrapper>
                <AdminDashboard />
            </AdminRouteWrapper>
        }
        key="/admin/dashboard"
    />,
    <Route
        path="/admin/events"
        element={
            <AdminRouteWrapper>
                <AdminEventsPage />
            </AdminRouteWrapper>
        }
        key="/admin/events"
    />,
    <Route
        path="/admin/users"
        element={
            <AdminRouteWrapper>
                <AdminUsersPage />
            </AdminRouteWrapper>
        }
        key="/admin/users"
    />,
    <Route
        path="/admin/users-purchases"
        element={
            <AdminRouteWrapper>
                <AdminUsersPurchasesPage />
            </AdminRouteWrapper>
        }
        key="/admin/users-purchases"
    />,
];
