import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Event, EventCarouselProps, EventWithStats, EventCategory } from '../types/events';

export default function EventCarousel({
  events,
  title = "Próximos Eventos",
  className = "",
  showTicketsInfo = true,
  showCountdown = true,
  showPopularity = true
}: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = window.setInterval(() => {
      if (!isHovered && events.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, events.length - 3));
      }
    }, 4000);
  }, [isHovered, events.length]);

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
    setCurrentIndex(Math.max(0, Math.min(index, events.length - 3)));
    if (carouselRef.current) {
      const cardWidth = 320; // w-80 = 320px
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    if (currentIndex < events.length - 3) {
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

  // Helper functions for event enhancements
  const getEventStats = useCallback((event: Event): EventWithStats => {
    const ticketsSold = event.ticketsSold || 0;
    const totalTickets = event.totalTickets || 100;
    const availableTickets = event.availableTickets || totalTickets;
    const isToday = new Date().toDateString() === new Date(event.date).toDateString();
    const isAlmostSoldOut = availableTickets <= totalTickets * 0.2; // 20% or less available
    const popularityScore = Math.min(100, (ticketsSold / totalTickets) * 100);

    return {
      ...event,
      ticketsSold,
      availableTickets,
      isToday,
      isAlmostSoldOut,
      popularityScore
    };
  }, []);

  const getEventCategory = useCallback((event: Event): EventCategory => {
    const title = event.title.toLowerCase();
    if (title.includes('festa')) return 'Festa';
    if (title.includes('show')) return 'Show';
    if (title.includes('concerto')) return 'Concerto';
    if (title.includes('teatro')) return 'Teatro';
    return 'Evento Especial';
  }, []);

  const getCountdownText = useCallback((event: Event): string => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Evento passado';
    if (diffDays === 0) return 'Hoje!';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays <= 7) return `${diffDays} dias`;
    return `${Math.ceil(diffDays / 7)} semanas`;
  }, []);

  const getTicketsStatus = useCallback((event: EventWithStats): string => {
    if (event.isAlmostSoldOut) return 'Quase lotado!';
    if (event.availableTickets === 0) return 'Lotado';
    return `${event.availableTickets} disponíveis`;
  }, []);

  // Enhanced events with stats
  const enhancedEvents = useMemo(() =>
    events.map(getEventStats),
    [events, getEventStats]
  );

  if (events.length === 0) {
    return (
      <section className={`px-6 py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <div className="flex items-center justify-center h-64 bg-white/5 rounded-xl">
          <p className="text-gray-400">Nenhum evento disponível no momento</p>
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
      aria-label="Carrossel de eventos"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-3">
          {/* Navigation dots */}
          <div className="hidden md:flex gap-2">
            {Array.from({ length: Math.max(1, events.length - 2) }, (_, i) => (
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
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Evento anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= events.length - 3}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Próximo evento"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {enhancedEvents.map((event, index) => (
            <div
              key={event.id}
              className="flex-shrink-0 w-80 snap-start"
              style={{ width: '320px' }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <Link
                to={`/events/${event.id}`}
                className="block group no-underline text-white h-full"
              >
                <div className="relative h-[480px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-black shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-primary/20">
                  {/* Event Image */}
                  {event.flyerPath ? (
                    <img
                      src={event.flyerPath}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-600/20">
                      <div className="text-center p-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <div className="text-lg font-semibold">{event.title}</div>
                      </div>
                    </div>
                  )}

                  {/* Netflix-style badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {event.isToday && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        🔥 HOJE
                      </div>
                    )}
                    {event.isAlmostSoldOut && (
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        🔥 QUASE LOTADO
                      </div>
                    )}
                    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {getEventCategory(event)}
                    </div>
                  </div>

                  {/* Popularity indicator */}
                  {showPopularity && event.popularityScore > 50 && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                      🔥 {Math.round(event.popularityScore)}%
                    </div>
                  )}

                  {/* Countdown badge */}
                  {showCountdown && (
                    <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      ⏰ {getCountdownText(event)}
                    </div>
                  )}

                  {/* Tickets info */}
                  {showTicketsInfo && (
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      🎫 {getTicketsStatus(event)}
                    </div>
                  )}

                  {/* Netflix-style glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Base info */}
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {event.title}
                      </h3>
                      <div className="text-sm text-gray-300 mb-1">
                        📅 {new Date(event.date).toLocaleDateString('pt-PT')}
                      </div>
                      <div className="text-sm text-gray-300">
                        🕐 {event.startTime} - {event.endTime}
                      </div>
                    </div>

                    {/* Hover details */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {event.description && (
                        <p className="text-sm text-gray-200 mt-3 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      {event.price && (
                        <div className="text-lg font-bold text-primary mt-2">
                          €{Number(event.price).toFixed(2)}
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-primary font-semibold">Ver Detalhes</span>
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
          {Array.from({ length: Math.max(1, events.length - 2) }, (_, i) => (
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
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-105"
        >
          Ver Todos os Eventos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
