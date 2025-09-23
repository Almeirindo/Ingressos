import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EventGrid from '../components/EventGrid';
import EventCarousel from '../components/EventCarousel-fixed';
import { Event } from '../types/events';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const heroImage = useMemo(() => {
    const firstWithFlyer = events.find(e => !!e.flyerPath);
    return firstWithFlyer?.flyerPath || undefined;
  }, [events]);

  return (
    <div className="pb-10">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center bg-gradient-to-b from-black to-dark overflow-hidden">
        {heroImage && (
          <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Os melhores eventos em um só lugar</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto">Compre ingressos para as maiores festas de forma rápida, simples e segura.</p>
          <Link to="/events" className="inline-block px-6 py-3 bg-primary text-black font-semibold rounded-full hover:brightness-110">Ver Eventos</Link>
        </div>
      </section>

      {/* Event Carousel - Netflix Style */}
      <EventCarousel events={events} title="🎬 Próximos Eventos" />

      {/* Como funciona */}
      <section id="about" className="px-6 mt-12">
        <h3 className="text-2xl font-semibold mb-6">Como funciona</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-primary font-semibold mb-1">1. Crie sua conta</div>
            <div className="text-gray-300">Registre-se rapidamente com seu telefone para começar.</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-primary font-semibold mb-1">2. Escolha o evento</div>
            <div className="text-gray-300">Navegue pelos próximos eventos e selecione o seu.</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-primary font-semibold mb-1">3. Pague e envie comprovante</div>
            <div className="text-gray-300">Transfira via IBAN/WhatsApp e aguarde validação do admin.</div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contact" className="px-6 mt-12">
        <h3 className="text-2xl font-semibold mb-6">Entre em Contato</h3>
        <div className="bg-white/5 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Fale conosco</h4>
              <p className="text-gray-300 mb-4">
                Tem dúvidas sobre nossos eventos? Precisa de ajuda com sua compra?
                Entre em contato conosco através dos canais abaixo.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 mr-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:migueloprovi@gmail.com" className="text-primary hover:text-white transition-colors">
                    migueloprovi@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Siga-nos</h4>
              <p className="text-gray-300 mb-4">
                Acompanhe nossas redes sociais para ficar por dentro dos próximos eventos e novidades.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/migueloprovi"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/miguelazevedoopro"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
