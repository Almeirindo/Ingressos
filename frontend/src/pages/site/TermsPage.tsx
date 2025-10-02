import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export default function TermsPage() {
  return (
    <>
      <NavBar/>
      <div className="min-h-screen p-6 gradient-bg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Termos de Uso</h1>
          <div className="bg-white/5 rounded-lg p-6 text-gray-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o site IngressosDaBanda, você concorda em cumprir e estar vinculado a estes Termos de Uso.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Uso do Serviço</h2>
              <p>
                O serviço é destinado à compra de ingressos para eventos. Você concorda em usar o serviço apenas para fins legais.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Pagamentos</h2>
              <p>
                Os pagamentos são processados via transferência bancária ou WhatsApp. É responsabilidade do usuário enviar o comprovante correto.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Cancelamentos e Reembolsos</h2>
              <p>
                Cancelamentos estão sujeitos às políticas de cada evento. Reembolsos serão processados conforme aplicável.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Responsabilidades</h2>
              <p>
                O IngressosDaBanda não se responsabiliza por eventos cancelados ou alterações nas programações.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Privacidade</h2>
              <p>
                Suas informações pessoais são protegidas conforme nossa Política de Privacidade.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Alterações</h2>
              <p>
                Reservamo-nos o direito de alterar estes termos a qualquer momento.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
