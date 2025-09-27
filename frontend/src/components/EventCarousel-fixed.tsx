import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Event } from '../types/events';

interface EventCarouselProps {
  events: Event[];
  title?: string;
  className?: string;
}

export default function EventCarousel({ events, title = "Próximos Eventos", className = "" }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, events.length - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const nextSlide = () => {
    if (currentIndex < events.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button onClick={prevSlide} disabled={currentIndex === 0} className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={nextSlide} disabled={currentIndex >= events.length - 3} className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        <div ref={carouselRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
          {events.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-80 snap-start">
              <Link to={`/events/${event.id}`} className="block group">
                <div className="relative h-[480px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-black shadow-2xl transform transition-all duration-300 hover:scale-105">
                  {event.flyerPath ? (
                    <img src={event.flyerPath} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-600/20">
                      <div className="text-center p-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <div className="text-lg font-semibold">{event.title}</div>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                    <div className="text-sm text-gray-300 mb-1">
                      📅 {new Date(event.date).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="text-sm text-gray-300 mb-1">
                      🕐 {event.startTime} - {event.endTime}
                    </div>
                    <div className="text-sm text-gray-300">
                      💰 Normal: Kz {Number(event.normalPrice || 0).toLocaleString()}
                      {event.vipPrice && event.vipPrice > 0 && (
                        <span className="ml-2 text-yellow-400">VIP: Kz {Number(event.vipPrice).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300">
          Ver Todos os Eventos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
