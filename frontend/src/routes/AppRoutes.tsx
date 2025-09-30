import PublicRoutes from '../routes/PublicRoutes';
import AuthRoutes from '../routes/AuthRoutes';
import PrivateRoutes from '../routes/PrivateRoutes';
import AdminRoutes from '../routes/AdminRoutes';


export default function AppRoutes() {
    return (
        <>
            <PublicRoutes />
            <AuthRoutes />
            <PrivateRoutes />
            <AdminRoutes />
        </>
    );
}

