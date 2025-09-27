import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Purchase } from '../types/purchases';

interface TicketCarouselProps {
  purchases: Purchase[];
  title?: string;
  className?: string;
}

export default function TicketCarousel({
  purchases,
  title = "Meus Ingressos",
  className = "",
}: TicketCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTicket, setHoveredTicket] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = window.setInterval(() => {
      if (!isHovered && purchases.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, purchases.length - 3));
      }
    }, 4000);
  }, [isHovered, purchases.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const scrollToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, purchases.length - 3)));
    if (carouselRef.current) {
      const cardWidth = 320; // w-80 = 320px
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    if (currentIndex < purchases.length - 3) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Helper functions for ticket enhancements
  const getStatusBadge = useCallback((purchase: Purchase): string => {
    switch (purchase.status) {
      case 'VALIDATED': return '✅ Validado';
      case 'PENDING': return '⏳ Pendente';
      case 'CANCELLED': return '❌ Cancelado';
      default: return 'Desconhecido';
    }
  }, []);

  const getTicketTypeBadge = useCallback((ticketType: 'NORMAL' | 'VIP'): string => {
    return ticketType === 'VIP' ? '⭐ VIP' : '🎫 Normal';
  }, []);

  const getCountdownText = useCallback((purchase: Purchase): string => {
    const eventDate = new Date(purchase.event.date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Evento passado';
    if (diffDays === 0) return 'Hoje!';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays <= 7) return `${diffDays} dias`;
    return `${Math.ceil(diffDays / 7)} semanas`;
  }, []);

  if (purchases.length === 0) {
    return (
      <section className={`px-6 py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <div className="flex items-center justify-center h-64 bg-white/5 rounded-xl">
          <p className="text-gray-400">Nenhum ingresso disponível. Faça login para ver seus ingressos.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`px-6 py-8 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrossel de ingressos"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-3">
          {/* Navigation dots */}
          <div className="hidden md:flex gap-2">
            {Array.from({ length: Math.max(1, purchases.length - 2) }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-primary w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir para o slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-3 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Ingresso anterior"
            >
              <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= purchases.length - 3}
              className="p-3 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Próximo ingresso"
            >
              <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {purchases.map((purchase, index) => (
            <div
              key={purchase.id}
              className="flex-shrink-0 w-80 snap-start"
              style={{ width: '320px' }}
              onMouseEnter={() => setHoveredTicket(purchase.id)}
              onMouseLeave={() => setHoveredTicket(null)}
            >
              <Link
                to={purchase.status === 'VALIDATED' ? `/ticket/${purchase.id}` : '#'}
                className={`block group no-underline h-full ${
                  purchase.status !== 'VALIDATED' ? 'pointer-events-none' : 'text-white'
                }`}
              >
                <div className={`relative h-[480px] rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 ${
                  purchase.status === 'VALIDATED' ? 'hover:shadow-primary/20' : 'opacity-70'
                }`}>
                  {/* Ticket Image */}
                  {purchase.event.flyerPath ? (
                    <img
                      src={purchase.event.flyerPath}
                      alt={purchase.event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-600/20">
                      <div className="text-center p-6">
                        <div className="text-6xl mb-4">🎫</div>
                        <div className="text-lg font-semibold">{purchase.event.title}</div>
                      </div>
                    </div>
                  )}

                  {/* Status badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      purchase.status === 'VALIDATED' ? 'bg-green-600' :
                      purchase.status === 'PENDING' ? 'bg-yellow-600' :
                      'bg-red-600'
                    } text-white`}>
                      {getStatusBadge(purchase)}
                    </div>
                    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {getTicketTypeBadge(purchase.ticketType)}
                    </div>
                  </div>

                  {/* Countdown badge */}
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    ⏰ {getCountdownText(purchase)}
                  </div>

                  {/* Unique Ticket ID if validated */}
                  {purchase.status === 'VALIDATED' && purchase.uniqueTicketId && (
                    <div className="absolute bottom-4 right-4 bg-primary/90 text-black px-3 py-1 rounded-full text-xs font-bold z-10">
                      {purchase.uniqueTicketId.slice(-8)}
                    </div>
                  )}

                  {/* Quantity and Total */}
                  <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {purchase.quantity} x Kz {purchase.totalAmount.toLocaleString()}
                  </div>

                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-transparent to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Base info */}
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {purchase.event.title}
                      </h3>
                      <div className="text-sm text-gray-300 mb-1">
                        📅 {new Date(purchase.event.date).toLocaleDateString('pt-PT')}
                      </div>
                      <div className="text-sm text-gray-300">
                        🕐 {purchase.event.startTime} - {purchase.event.endTime}
                      </div>
                    </div>

                    {/* Hover details */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      <div className="text-sm text-gray-200 mt-3">
                        {purchase.status === 'PENDING' && 'Aguardando comprovante de pagamento.'}
                        {purchase.status === 'CANCELLED' && 'Ingresso cancelado.'}
                      </div>
                      {purchase.status === 'VALIDATED' && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-300 mb-2">Apresente na entrada</div>
                          <div className="font-mono text-sm font-bold text-primary">
                            {purchase.uniqueTicketId}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-primary font-semibold">
                          {purchase.status === 'VALIDATED' ? 'Ver Ticket' : 'Detalhes'}
                        </span>
                        <svg className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-300" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, purchases.length - 2) }, (_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-primary w-8' : 'bg-white/30 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* View all link */}
      <div className="text-center mt-8">
        <Link
          to="/my-purchases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-105"
        >
          Ver Todos os Ingressos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
