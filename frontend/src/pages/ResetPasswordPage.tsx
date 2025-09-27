import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { InputField, Button, Card } from '../components/ui';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao redefinir senha');
      setSuccess(data.message);
      setTimeout(() => nav('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg" role="main">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Redefinir Senha</h1>
          <p className="text-gray-300">Digite sua nova senha</p>
        </header>

        {/* Reset Password Card */}
        <Card className="slide-up">
          <form onSubmit={onSubmit} className="space-y-6" role="form" aria-labelledby="reset-title">
            <h2 id="reset-title" className="sr-only">Formulário de Redefinição de Senha</h2>

            {/* Token Field (hidden or readonly) */}
            <InputField
              label="Código de Recuperação"
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Cole o código aqui"
              disabled={isLoading}
              required
            />

            {/* New Password Field */}
            <InputField
              label="Nova Senha"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              disabled={isLoading}
              required
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Confirm Password Field */}
            <InputField
              label="Confirmar Nova Senha"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              disabled={isLoading}
              required
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 fade-in"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 fade-in"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-300 text-sm">{success}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !token || !newPassword || !confirmPassword}
              isLoading={isLoading}
              loadingText="Redefinindo..."
              aria-describedby={error ? "error-message" : success ? "success-message" : undefined}
            >
              Redefinir Senha
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Lembrou a senha?{' '}
              <Link
                className="text-primary hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                to="/login"
                aria-label="Voltar para login"
              >
                Faça login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
