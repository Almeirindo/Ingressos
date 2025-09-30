import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField, Button, Card } from '../../components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || undefined, phone: phone || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar solicitação');
      setSuccess(data.message);
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
          <h1 className="text-4xl font-bold text-white mb-2">Esqueceu a Senha?</h1>
          <p className="text-gray-300">Digite seu email ou telefone para receber o código de recuperação</p>
        </header>

        {/* Forgot Password Card */}
        <Card className="slide-up">
          <form onSubmit={onSubmit} className="space-y-6" role="form" aria-labelledby="forgot-title">
            <h2 id="forgot-title" className="sr-only">Formulário de Recuperação de Senha</h2>

            {/* Email Field */}
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              disabled={isLoading}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Phone Field */}
            <InputField
              label="Telefone"
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+244 ..."
              disabled={isLoading}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
              disabled={isLoading || (!email && !phone)}
              isLoading={isLoading}
              loadingText="Enviando..."
              aria-describedby={error ? "error-message" : success ? "success-message" : undefined}
            >
              Enviar Código
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
