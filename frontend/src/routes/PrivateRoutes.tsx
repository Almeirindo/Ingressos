import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Páginas (users)
import MyPurchasesPage from '../pages/MyPurchasesPage';
import TicketPage from '../pages/TicketPage';
import PaymentPage from '../pages/PaymentPage';
import ProfilePage from '../pages/ProfilePage';


function PrivateRoute({ children }: { children: React.ReactElement }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}



export default function PrivateRoutes() {
    return (

        <Routes>
            <Route
                path="/me/purchases"
                element={
                    <PrivateRoute>
                        <MyPurchasesPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                }
            />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket/:id" element={<TicketPage />} />


        </Routes>

    )
}