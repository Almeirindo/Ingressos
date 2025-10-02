import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  FaHouse as HomeIcon,
  FaCalendar as EventIcon
} from 'react-icons/fa6'

export default function NavBar() {

  const navigateTo = useNavigate();

  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen || isSearchOpen) {
        if (window.scrollY > lastScrollY.current) {
          setIsMenuOpen(false);
          setIsSearchOpen(false);
        }
        lastScrollY.current = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen, isSearchOpen]);


  const toggleMenu = () => {
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
      navigateTo(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };
  const toggleSearch = () => {
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
    <header role="navigation" className="w-full border-b border-white/10 bg-black/40 backdrop-blur-lg sticky top-0 z-50 shadow-lg">

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
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isActive('/')
                  ? 'text-primary bg-primary/10 border border-primary/30'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                onClick={closeMenu}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <HomeIcon />

                Home
                {isActive('/') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
              {/* Events Link */}
              <Link
                to="/events"
                title=""
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isActive('/events')
                  ? 'text-primary bg-primary/10 border border-primary/30'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                onClick={closeMenu}
                aria-current={isActive('/events') ? 'page' : undefined}
              >
                <EventIcon />

                Eventos
                {isActive('/events') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>

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

            {/* Login/Register */}
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
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${isActive('/')
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                onClick={closeMenu}
              >
                Home
              </Link>

              <Link
                to="/events"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${isActive('/events')
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                onClick={closeMenu}
              >
                Eventos
              </Link>

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
            </div>
          </div>
        )}


      </div>

    </header>
  );
}
