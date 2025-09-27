import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Event, EventWithStats, EventCategory } from '../types/events';

interface EventGridProps {
  events: Event[];
  title?: string;
  className?: string;
  showTicketsInfo?: boolean;
  showCountdown?: boolean;
  showPopularity?: boolean;
}

export default function EventGrid({
  events,
  title = "Próximos Eventos",
  className = "",
  showTicketsInfo = true,
  showCountdown = true,
  showPopularity = true
}: EventGridProps) {
  // Helper functions for event enhancements
  const getEventStats = (event: Event): EventWithStats => {
    const ticketsSold = event.ticketsSold || 0;
    const totalTickets = event.totalTickets || 100;
    const availableTickets = event.availableTickets || totalTickets;
    const isToday = new Date().toDateString() === new Date(event.date).toDateString();
    const isAlmostSoldOut = availableTickets <= totalTickets * 0.2; // 20% or less available
    const popularityScore: number = Math.min(100, (ticketsSold / totalTickets) * 100);

    return {
      ...event,
      ticketsSold,
      availableTickets,
      isToday,
      isAlmostSoldOut,
      popularityScore
    };
  };

  const getEventCategory = (event: Event): EventCategory => {
    const title = event.title.toLowerCase();
    if (title.includes('festa')) return 'Festa';
    if (title.includes('show')) return 'Show';
    if (title.includes('concerto')) return 'Concerto';
    if (title.includes('teatro')) return 'Teatro';
    return 'Evento Especial';
  };

  const getCountdownText = (event: Event): string => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Evento passado';
    if (diffDays === 0) return 'Hoje!';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays <= 7) return `${diffDays} dias`;
    return `${Math.ceil(diffDays / 7)} semanas`;
  };

  const getTicketsStatus = (event: EventWithStats): string => {
    if (event.isAlmostSoldOut) return 'Quase lotado!';
    if (event.availableTickets === 0) return 'Lotado';
    return `${event.availableTickets} disponíveis`;
  };

  // Enhanced events with stats, sorted by featured first
  const enhancedEvents = useMemo(() =>
    events
      .map(getEventStats)
      .sort((a, b) => {
        // Featured events first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Then by date
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }),
    [events]
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
    <section className={`px-6 py-8 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{title}</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {enhancedEvents.map((event) => (
          <div key={event.id} className="group">
            <Link
              to={`/events/${event.id}`}
              className="block no-underline text-white h-full"
            >
              <div className="relative h-[320px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-black shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-primary/20">
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
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-sm font-semibold">{event.title}</div>
                    </div>
                  </div>
                )}

                {/* Netflix-style badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {event.isFeatured && (
                    <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      ⭐ DESTAQUE
                    </div>
                  )}
                  {event.isToday && (
                    <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      🔥 HOJE
                    </div>
                  )}
                  {event.isAlmostSoldOut && (
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🔥 QUASE LOTADO
                    </div>
                  )}
                  <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {getEventCategory(event)}
                  </div>
                </div>

                {/* Popularity indicator */}
                {showPopularity && event.popularityScore > 50 && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    🔥 {Math.round(event.popularityScore)}%
                  </div>
                )}

                {/* Countdown badge */}
                {showCountdown && (
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    ⏰ {getCountdownText(event)}
                  </div>
                )}

                {/* Tickets info */}
                {showTicketsInfo && (
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    🎫 {getTicketsStatus(event)}
                  </div>
                )}

                {/* Netflix-style glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Content overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </h3>
                    <div className="text-xs text-gray-300 mb-1">
                      📅 {new Date(event.date).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="text-xs text-gray-300">
                      🕐 {event.startTime} - {event.endTime}
                    </div>
                    {event.normalPrice && (
                      <div className="text-sm font-bold text-primary mt-2">
                        Kz {Number(event.normalPrice).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/50 transition-all duration-300" />
              </div>
            </Link>
          </div>
        ))}
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
