import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { InputField, Button, Card } from '../../components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no login');
      login(data.token, data.user);
      nav('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes('@')) {
      setEmail(value);
      setPhone('');
    } else {
      setPhone(value);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-8 gradient-bg" role="main">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo</h1>
          <p className="text-gray-300">Entre na sua conta para continuar</p>
        </header>

        {/* Login Card */}
        <Card className="slide-up">
          <form onSubmit={onSubmit} className="space-y-6" role="form" aria-labelledby="login-title">
            <h2 id="login-title" className="sr-only">Formulário de Login</h2>

            {/* Phone/Email Field */}
            <InputField
              label="Telefone ou Email"
              type="text"
              value={phone || email}
              onChange={handleContactChange}
              placeholder="+244 ... ou email@exemplo.com"
              disabled={isLoading}
              required
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Password Field */}
            <InputField
              label="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={isLoading}
              required
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                className="text-primary hover:text-blue-300 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                to="/forgot-password"
                aria-label="Esqueci minha senha"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 fade-in"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              loadingText="Entrando..."
              aria-describedby={error ? "error-message" : undefined}
            >
              Entrar
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Ainda não tem conta?{' '}
              <Link
                className="text-primary hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                to="/register"
                aria-label="Ir para página de cadastro"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8 fade-in">
          <p className="text-gray-400 text-sm">
            Ao continuar, você concorda com nossos{' '}
            <a
              href="#"
              className="text-primary hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              aria-label="Ler termos de uso"
            >
              Termos de Uso
            </a>{' '}
            e{' '}
            <a
              href="#"
              className="text-primary hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
              aria-label="Ler política de privacidade"
            >
              Política de Privacidade
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

