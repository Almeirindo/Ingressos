import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigateTo = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // mobile drawer

  const isActive = (path: string) => location.pathname === path;

  const doLogout = () => {
    logout();
    navigateTo("/");
  };

  const prefix = user?.role === "ADMIN" ? "/admin" : user ? "/me" : "";

  return (
    <>
      {/* 👉 ALTERADO: Botão de abrir no mobile (agora na direita) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-primary text-black px-3 py-2 rounded-md shadow-md"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Overlay no mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* 👉 ALTERADO: Sidebar agora fica à direita */}
      <aside
        className={`fixed top-0 right-0 h-screen w-screen bg-black/90 backdrop-blur-lg border-l border-white/10 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
          lg:translate-x-0
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {!isCollapsed && (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="font-bold text-primary text-lg hover:text-primary-light transition-all"
            >
              IngressosDaBanda
            </Link>
          )}

          {/* 👉 ALTERADO: Fechar mobile (fica na esquerda agora, porque a sidebar está à direita) */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            ✕
          </button>

          {/* Colapsar desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block text-gray-400 hover:text-white"
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? "⇤" : "⇥"}
          </button>
        </div>

        {/* Links principais */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              isActive("/")
                ? "bg-primary/20 text-primary"
                : "text-gray-200 hover:bg-white/10"
            }`}
          >
            <span>🏠</span>
            {!isCollapsed && "Home"}
          </Link>

          {user && (
            <Link
              to={`${prefix}/events`}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
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
            <>
              <Link
                to="/me/purchases"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive("/me/purchases")
                    ? "bg-primary/20 text-primary"
                    : "text-gray-200 hover:bg-white/10"
                }`}
              >
                <span>🛒</span>
                {!isCollapsed && "Minhas Compras"}
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive("/me/profile")
                    ? "bg-primary/20 text-primary"
                    : "text-gray-200 hover:bg-white/10"
                }`}
              >
                <span>👤</span>
                {!isCollapsed && "Perfil"}
              </Link>
            </>
          )}
        </nav>

        {/* Admin Section */}
        {user?.role === "ADMIN" && (
          <div className="px-2 py-4 border-t border-white/10 space-y-2">
            {!isCollapsed && (
              <div className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wider border-l-2 border-primary mb-2">
                Admin
              </div>
            )}
            <Link
              to="/admin/events"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
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
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
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
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
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
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
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
