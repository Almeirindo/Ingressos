import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen p-6 gradient-bg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Contato</h1>
        <div className="bg-white/5 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Fale conosco</h2>
              <p className="text-gray-300 mb-4">
                Tem dúvidas sobre nossos eventos? Precisa de ajuda com sua compra?
                Entre em contato conosco através dos canais abaixo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="https://wa.me/244949928157?text=Olá! Gostaria de saber mais sobre os eventos disponíveis."
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-primary hover:text-white transition-colors">
                    +244 949 928 157
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:ingressosdabanda@gmail.com" className="text-primary hover:text-white transition-colors">
                    ingressosdabanda@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Horário de Atendimento</h2>
              <p className="text-gray-300 mb-4">
                Estamos disponíveis para atendê-lo nos seguintes horários:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>Segunda a Sexta: 9h - 18h</li>
                <li>Sábado: 9h - 14h</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
