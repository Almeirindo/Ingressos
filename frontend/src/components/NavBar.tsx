import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen || isSearchOpen) {
        if (window.scrollY > lastScrollY.current) {
          // Scrolling down, close menus/search
          setIsMenuOpen(false);
          setIsSearchOpen(false);
        }
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen, isSearchOpen]);

  function doLogout() {
    logout();
    nav('/');
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    // On desktop, close search if open
    if (window.innerWidth >= 768 && isSearchOpen) {
      setIsSearchOpen(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      nav(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    // On desktop, close menu if open
    if (window.innerWidth >= 768 && isMenuOpen) {
      setIsMenuOpen(false);
    }
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav role="navigation" className="w-full border-b border-white/10 bg-black/40 backdrop-blur-lg sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="font-display font-bold text-primary text-xl md:text-2xl hover:text-primary-light transition-all duration-300 transform hover:scale-105 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={closeMenu}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              IngressosDaBanda
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-8">
              {/* Home Link */}
              <Link
                to="/"
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive('/')
                    ? 'text-primary bg-primary/10 border border-primary/30'
                    : 'text-gray-200 hover:text-white hover:bg-white/5'
                }`}
                onClick={closeMenu}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
                {isActive('/') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
              {/* Events Link */}
              <Link
                to="/events"
                title=""
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive('/events')
                    ? 'text-primary bg-primary/10 border border-primary/30'
                    : 'text-gray-200 hover:text-white hover:bg-white/5'
                }`}
                onClick={closeMenu}
                aria-current={isActive('/events') ? 'page' : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Eventos
                {isActive('/events') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
              {user && (
                <Link
                  to="/me/purchases"
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isActive('/me/purchases')
                      ? 'text-primary bg-primary/10 border border-primary/30'
                      : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={closeMenu}
                  aria-current={isActive('/me/purchases') ? 'page' : undefined}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5-1.5m0 0L3 3m2 2h10l4-8" />
                  </svg>
                  Minhas Compras
                  {isActive('/me/purchases') && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </Link>
              )}
            </div>
          </div>

          {/* Search and User Menu - Right Side */}
            <div className="flex items-center gap-4">
              {/* Desktop Search Icon - Toggleable */}
              <div className="relative hidden md:block">
                <button
                  onClick={toggleSearch}
                  className="p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                  aria-label="Buscar eventos"
                  aria-expanded={isSearchOpen}
                >
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {isSearchOpen && (
                  <form onSubmit={handleSearch} className="absolute top-full right-0 mt-2 w-64 max-w-[90vw] bg-black/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/10 p-2 z-50">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar eventos..."
                        className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mt-2 text-sm text-gray-300 hover:text-white w-full text-left"
                      >
                        Limpar busca
                      </button>
                    )}
                  </form>
                )}
              </div>

              {/* User Menu or Login/Register */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                    aria-label="Menu do usuário"
                    aria-expanded={isMenuOpen}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:inline text-white text-sm">{user.name || 'Usuário'}</span>
                  </button>

                {/* User Dropdown - Only on Desktop */}
                {isMenuOpen && (
                  <div className="hidden md:block absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/10 py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-200 hover:bg-white/5 rounded transition-colors"
                      onClick={closeMenu}
                    >
                      Perfil
                    </Link>
                    {user.role === 'ADMIN' && (
                      <>
                        <div className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wider border-l-2 border-primary ml-4">Admin</div>
                        <Link
                          to="/admin/events"
                          className="block pl-8 py-2 text-gray-200 hover:bg-white/5 rounded transition-colors"
                          onClick={closeMenu}
                        >
                          Gerenciar Eventos
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block pl-8 py-2 text-gray-200 hover:bg-white/5 rounded transition-colors"
                          onClick={closeMenu}
                        >
                          Gerenciar Usuários
                        </Link>
                        <Link
                          to="/admin/users-purchases"
                          className="block pl-8 py-2 text-gray-200 hover:bg-white/5 rounded transition-colors"
                          onClick={closeMenu}
                        >
                          Gerenciar Compras
                        </Link>
                      </>
                    )}
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={doLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                    onClick={closeMenu}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-all duration-300 font-medium"
                    onClick={closeMenu}
                  >
                    Registrar
                  </Link>
                </div>
              )}
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              aria-label="Abrir menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive('/')
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-200 hover:text-white hover:bg-white/5'
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive('/events')
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-200 hover:text-white hover:bg-white/5'
                }`}
                onClick={closeMenu}
              >
                Eventos
              </Link>
              {user && (
                <>
                  <Link
                    to="/me/purchases"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                      isActive('/me/purchases')
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-200 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMenu}
                  >
                    Minhas Compras
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                      isActive('/profile')
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-200 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMenu}
                  >
                    Perfil
                  </Link>
                </>
              )}
              {user && user.role === 'ADMIN' && (
                <div className="space-y-1 mt-2">
                  <span className="block px-3 py-1 text-xs text-gray-400 uppercase tracking-wider border-l-2 border-primary ml-4">Admin</span>
                  <Link
                    to="/admin/events"
                    className="block pl-8 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-all"
                    onClick={closeMenu}
                  >
                    Gerenciar Eventos
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block pl-8 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-all"
                    onClick={closeMenu}
                  >
                    Gerenciar Usuários
                  </Link>
                  <Link
                    to="/admin/users-purchases"
                    className="block pl-8 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-all"
                    onClick={closeMenu}
                  >
                    Gerenciar Compras
                  </Link>
                </div>
              )}
              {/* Mobile Search - Toggleable in menu */}
              <div className="px-3 py-2">
                <button
                  onClick={toggleSearch}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar eventos
                </button>
                {isSearchOpen && (
                  <form onSubmit={handleSearch} className="mt-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar eventos..."
                        className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="mt-2 text-sm text-gray-300 hover:text-white w-full text-left"
                      >
                        Limpar busca
                      </button>
                    )}
                  </form>
                )}
              </div>
              {user ? (
                <div className="px-3 py-2 space-y-1 border-t border-white/10">
                  <button
                    onClick={doLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-all"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-1 border-t border-white/10">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-200 hover:text-white hover:bg-white/5 rounded-md transition-all"
                    onClick={closeMenu}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-all text-center"
                    onClick={closeMenu}
                  >
                    Registrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
