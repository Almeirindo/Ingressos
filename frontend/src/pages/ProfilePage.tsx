import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Card from '../components/ui/Card';
import InputField from '../components/ui/InputField';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type UserProfile = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  role: 'USER' | 'ADMIN';
};

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setProfile(data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-400">
          Erro ao carregar perfil. Tente novamente.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Informações da Conta</h3>
          <div className="space-y-4">
            <InputField
              label="Nome"
              value={profile.name}
              onChange={() => {}}
              disabled
            />
            <InputField
              label="Email"
              value={profile.email || 'Não informado'}
              onChange={() => {}}
              disabled
            />
            <InputField
              label="Telefone"
              value={profile.phone.toString()}
              onChange={() => {}}
              disabled
            />
            <InputField
              label="Tipo de Conta"
              value={profile.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
              onChange={() => {}}
              disabled
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-4">
            <Link
              to="/me/purchases"
              className="block w-full px-4 py-3 bg-primary text-black rounded-lg hover:bg-primary-light transition-colors text-center font-semibold"
            >
              Ver Minhas Compras
            </Link>
            <div className="text-sm text-gray-400">
              Visualize seus ingressos e histórico de compras.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
