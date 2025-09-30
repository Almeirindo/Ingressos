import React from 'react';

export default function FAQPage() {
  return (
    <div className="min-h-screen p-6 gradient-bg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Perguntas Frequentes</h1>
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Como posso comprar ingressos?</h2>
            <p className="text-gray-300">
              Você pode comprar ingressos diretamente no nosso site. Escolha o evento, selecione a quantidade e siga as instruções de pagamento.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Quais são as formas de pagamento?</h2>
            <p className="text-gray-300">
              Aceitamos pagamentos via transferência bancária (IBAN) e WhatsApp. Após o pagamento, envie o comprovante para validação.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Quanto tempo leva para receber o ingresso?</h2>
            <p className="text-gray-300">
              Após a validação do pagamento pelo administrador, seu ingresso é gerado automaticamente e fica disponível em sua conta.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Posso cancelar minha compra?</h2>
            <p className="text-gray-300">
              Cancelamentos estão sujeitos à política de cada evento. Entre em contato conosco para mais informações.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Como entro em contato com o suporte?</h2>
            <p className="text-gray-300">
              Você pode nos contatar via WhatsApp (+244 949 928 157) ou email (ingressosdabanda@gmail.com).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
