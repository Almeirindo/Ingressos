import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function doLogout() {
    logout();
    nav('/');
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="font-bold text-primary text-lg md:text-xl hover:text-blue-300 transition-colors duration-200"
              onClick={closeMenu}
            >
               IngressosDaBanda
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-gray-200 hover:text-white transition-colors duration-200">
              Eventos
            </Link>
            {user && (
              <Link to="/me/purchases" className="text-gray-200 hover:text-white transition-colors duration-200">
                Minhas Compras
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <Link to="/admin/events" className="text-gray-200 hover:text-white transition-colors duration-200">
                  Admin Eventos
                </Link>
                <Link to="/admin/users-purchases" className="text-gray-200 hover:text-white transition-colors duration-200">
                  Admin Compras
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Criar conta
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-300 mr-3">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={doLogout}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                >
                  Sair
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3 border-t border-white/10 mt-3">
            <Link
              to="/events"
              className="block px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              onClick={closeMenu}
            >
              Eventos
            </Link>
            {user && (
              <Link
                to="/me/purchases"
                className="block px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Minhas Compras
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/events"
                  className="block px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  onClick={closeMenu}
                >
                  Admin Eventos
                </Link>
                <Link
                  to="/admin/users-purchases"
                  className="block px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  onClick={closeMenu}
                >
                  Admin Compras
                </Link>
              </>
            )}

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-200 text-center"
                    onClick={closeMenu}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-3 py-2 bg-primary text-black rounded-lg hover:bg-blue-600 transition-all duration-200 text-center"
                    onClick={closeMenu}
                  >
                    Criar conta
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-sm text-gray-300">
                    {user.name} ({user.role})
                  </div>
                  <button
                    onClick={doLogout}
                    className="w-full px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

