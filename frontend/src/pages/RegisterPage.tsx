import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { InputField, Button, Card } from '../components/ui';

export default function RegisterPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return name.trim().length >= 2;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email.trim());
        const trimmedEmail = email.trim().toLowerCase();
        const isLowerCase = trimmedEmail === email.trim().toLowerCase();
        const cleanPhone = phone.replace(/\D/g, '');
        const isValidPhone = cleanPhone.length === 9 && !isNaN(parseInt(cleanPhone));
        return name.trim().length >= 2 && isValidPhone && isValidEmail && isLowerCase;
      case 3:
        const trimmedPassword = password.trim();
        const trimmedConfirm = confirmPassword.trim();
        return trimmedPassword.length >= 6 && trimmedPassword === trimmedConfirm;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;

    setError(null);
    setIsLoading(true);

    // Trim and normalize inputs before submission
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');
    const trimmedPassword = password.trim();

    // Final validation
    if (cleanPhone.length !== 9 || isNaN(parseInt(cleanPhone))) {
      setError('Telefone deve ter exatamente 9 dígitos numéricos.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, phone: cleanPhone, password: trimmedPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no registro');
      login(data.token, data.user);
      nav('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const renderStepIndicator = () => (
    <nav className="flex items-center justify-center mb-8" aria-label="Progresso do cadastro">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              step === currentStep
                ? 'bg-primary text-white shadow-lg'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-gray-400'
            }`}
            aria-current={step === currentStep ? 'step' : undefined}
          >
            {step < currentStep ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                step < currentStep ? 'bg-green-500' : 'bg-white/20'
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </nav>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 fade-in">
            <header className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Informações Pessoais</h3>
              <p className="text-gray-300">Vamos começar com seu nome</p>
            </header>
            <InputField
              label="Nome Completo"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              disabled={isLoading}
              required
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 fade-in">
            <header className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Contato</h3>
              <p className="text-gray-300">Como podemos entrar em contato?</p>
            </header>
            <div className="space-y-4">
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
                required
                error={
                  email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? "Email inválido"
                    : email && email !== email.toLowerCase()
                    ? "Email não pode conter maiúsculas"
                    : undefined
                }
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <InputField
                label="Telefone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="912345678"
                disabled={isLoading}
                required
                error={
                  phone
                    ? (() => {
                        const cleanPhone = phone.replace(/\D/g, '');
                        return cleanPhone.length !== 9 || isNaN(parseInt(cleanPhone)) ? 'Telefone deve ter exatamente 9 dígitos numéricos' : undefined;
                      })()
                    : undefined
                }
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 fade-in">
            <header className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Segurança</h3>
              <p className="text-gray-300">Crie uma senha segura</p>
            </header>
            <div className="space-y-4">
              <InputField
                label="Senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading}
                required
                error={password.trim().length < 6 ? "Senha deve ter pelo menos 6 caracteres" : undefined}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              <InputField
                label="Confirmar Senha"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                disabled={isLoading}
                required
                error={
                  password && confirmPassword && password.trim() !== confirmPassword.trim()
                    ? "As senhas não coincidem"
                    : undefined
                }
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg" role="main">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-gray-300">Junte-se a nós em poucos passos</p>
        </header>

        {/* Register Card */}
        <Card className="slide-up">
          {renderStepIndicator()}

          <form onSubmit={onSubmit} role="form" aria-labelledby="register-title">
            <h2 id="register-title" className="sr-only">Formulário de Cadastro</h2>
            {renderStepContent()}

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mt-6 fade-in"
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

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="secondary"
                  disabled={isLoading}
                  className="flex-1"
                >
                  Voltar
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="flex-1"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!validateStep(3) || isLoading}
                  isLoading={isLoading}
                  loadingText="Criando conta..."
                  className="flex-1"
                >
                  Criar Conta
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Já tem conta?{' '}
              <Link
                className="text-primary hover:text-blue-300 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                to="/login"
                aria-label="Ir para página de login"
              >
                Entrar
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8 fade-in">
          <p className="text-gray-400 text-sm">
            Ao criar sua conta, você concorda com nossos{' '}
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

