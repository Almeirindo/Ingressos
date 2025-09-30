import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from '../contexts/AuthContext';


import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminEventsPage from '../pages/admin/AdminEventsPage';
import AdminUsersPurchasesPage from '../pages/admin/AdminUsersPurchasesPage';

function AdminRoute({ children }: { children: React.ReactElement }) {
    const { user } = useAuth();
    return user?.role === 'ADMIN' ? children : <Navigate to="/" replace />;
}


export default function AdminRoutes() {

    return (
        <Routes>

            <Route
                path="/admin/events"
                element={
                    <AdminRoute>
                        <AdminEventsPage />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <AdminRoute>
                        <AdminUsersPage />
                    </AdminRoute>
                }
            />
            <Route
                path="/admin/users-purchases"
                element={
                    <AdminRoute>
                        <AdminUsersPurchasesPage />
                    </AdminRoute>
                }
            />
        </Routes>
    )

}