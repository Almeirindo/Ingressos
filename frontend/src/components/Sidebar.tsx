import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigateTo = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse

  const isActive = (path: string) => location.pathname === path;

  const doLogout = () => {
    logout();
    navigateTo("/");
  };

  // 👉 prefixo dinâmico: se for admin = "/admin", se for user = "/me"
  const prefix = user?.role === "ADMIN" ? "/admin" : user ? "/me" : "";

  return (
    <>
      {/* Botão de abrir sidebar no mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-md"
      >
        ☰
      </button>

      {/* Overlay para fechar no mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-black/90 backdrop-blur-lg border-r border-white/10 z-50 transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`font-bold text-primary text-lg hover:text-primary-light transition-all ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            IngressosDaBanda
          </Link>

          {/* Botão de fechar no mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white lg:hidden"
          >
            ✕
          </button>

          {/* Botão colapsar no desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block text-gray-400 hover:text-white"
          >
            {isCollapsed ? "⇥" : "⇤"}
          </button>
        </div>

        {/* Links principais */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isActive("/") ? "bg-primary/20 text-primary" : "text-gray-200 hover:bg-white/10"
            }`}
          >
            <span>🏠</span>
            {!isCollapsed && "Home"}
          </Link>

          {user && (
            <Link
              to={`${prefix}/events`}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                isActive(`${prefix}/events`)
                  ? "bg-primary/20 text-primary"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span>🎟</span>
              {!isCollapsed && "Eventos"}
            </Link>
          )}

          {user && user.role !== "ADMIN" && (
            <Link
              to="/me/purchases"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                isActive("/me/purchases")
                  ? "bg-primary/20 text-primary"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span>🛒</span>
              {!isCollapsed && "Minhas Compras"}
            </Link>
          )}

          {user && user.role !== "ADMIN" && (
            <Link
              to="/me/profile"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                isActive("/me/profile")
                  ? "bg-primary/20 text-primary"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span>👤</span>
              {!isCollapsed && "Perfil"}
            </Link>
          )}
        </nav>

        {/* Admin Section */}
        {user?.role === "ADMIN" && (
          <div className="px-2 py-4 border-t border-white/10">
            {!isCollapsed && (
              <div className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wider border-l-2 border-primary mb-2">
                Admin
              </div>
            )}
            <Link
              to="/admin/events"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 pl-4 py-2 rounded-md ${
                isActive("/admin/events")
                  ? "bg-primary/20 text-primary"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span>📅</span>
              {!isCollapsed && "Gerenciar Eventos"}
            </Link>
            <Link
              to="/admin/users"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 pl-4 py-2 rounded-md ${
                isActive("/admin/users")
                  ? "bg-primary/20 text-primary"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span>👥</span>
              {!isCollapsed && "Gerenciar Usuários"}
            </Link>
            <Link
              to="/admin/users-purchases"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 pl-4 py-2 rounded-md ${
                isActive("/admin/users-purchases")
                  ? "bg-primary/20 text-primary"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              <span>💳</span>
              {!isCollapsed && "Gerenciar Compras"}
            </Link>
          </div>
        )}

        {/* Logout */}
        {user && (
          <div className="px-2 py-4 border-t border-white/10">
            <button
              onClick={doLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-md"
            >
              <span>🚪</span>
              {!isCollapsed && "Sair"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
