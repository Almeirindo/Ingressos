import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export default function HowItWorksPage() {
  return (
    <div>
      <div className="min-h-screen p-6 gradient-bg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Como Funciona</h1>
          <div className="space-y-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Crie sua conta</h2>
              <p className="text-gray-300">
                Registre-se rapidamente com seu telefone ou email para começar a comprar ingressos.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Escolha o evento</h2>
              <p className="text-gray-300">
                Navegue pelos próximos eventos disponíveis e selecione o que mais lhe interessa.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Pague e envie comprovante</h2>
              <p className="text-gray-300">
                Transfira o valor via IBAN ou WhatsApp e envie o comprovante para validação pelo administrador.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Receba seu ingresso</h2>
              <p className="text-gray-300">
                Após validação, seu ingresso será gerado e você poderá acessá-lo em sua conta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
