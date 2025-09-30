import { AuthProvider } from './contexts/AuthContext';

// Componentes de Layout Fundamentais
import NavBar from './components/NavBar';
import Footer from './components/Footer';


import AppRoutes from './routes/AppRoutes';


export default function App() {
  return (
    <AuthProvider>
      {/* <NavBar /> */}
      
      {/* <div className="max-w-6xl mx-auto"> */}
      <main className="">
        <AppRoutes />
      </main>
      {/* <Footer /> */}
      
    </AuthProvider>
  );
}

