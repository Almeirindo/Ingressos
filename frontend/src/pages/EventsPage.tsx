import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Event } from '../types/events';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'available' | 'upcoming'>('all');

  useEffect(() => {
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      setSearchQuery(searchTerm);
      performSearch(searchTerm);
    } else {
      fetchEvents();
    }
  }, [searchParams]);

  const fetchEvents = () => {
    fetch('/api/events')
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      fetchEvents();
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/events/search?query=${encodeURIComponent(query)}`);
      const searchResults = await response.json();
      setEvents(searchResults);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setEvents([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const sortEvents = (events: Event[]) => {
    const sorted = [...events];

    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'price':
        return sorted.sort((a, b) => (a.normalPrice || 0) - (b.normalPrice || 0));
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const filterEvents = (events: Event[]) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (filterBy) {
      case 'available':
        return events.filter(event => (event.availableTickets || 0) > 0);
      case 'upcoming':
        return events.filter(event => event.date >= today);
      default:
        return events;
    }
  };

  const sortedAndFilteredEvents = sortEvents(filterEvents(events));

  const formatPrice = (price: number | null | undefined) => {
    if (!price || price === 0) return 'Grátis';
    return `Kz ${Number(price).toLocaleString()}`;
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const today = now.toISOString().split('T')[0];

    if ((event.availableTickets || 0) <= 0) return { text: 'Esgotado', color: 'text-red-400' };
    if (event.date < today) return { text: 'Finalizado', color: 'text-gray-400' };
    if (event.date === today) return { text: 'Hoje', color: 'text-yellow-400' };
    return { text: 'Disponível', color: 'text-green-400' };
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Próximos <span className="text-primary">Eventos</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Descubra os melhores eventos da cidade e garanta seu lugar
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar eventos por nome..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary-light transition-all duration-300"
                  >
                    {isSearching ? '...' : 'Buscar'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'name')}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  >
                    <option value="date">Ordenar por Data</option>
                    <option value="price">Ordenar por Preço</option>
                    <option value="name">Ordenar por Nome</option>
                  </select>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'available' | 'upcoming')}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  >
                    <option value="all">Todos</option>
                    <option value="available">Disponíveis</option>
                    <option value="upcoming">Próximos</option>
                  </select>
                </div>
              </div>
              {searchQuery && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-300">
                    {isSearching ? 'Buscando...' : `Resultados para: "${searchQuery}"`}
                  </p>
                  <button
                    onClick={clearSearch}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-300">
              {sortedAndFilteredEvents.length} evento{sortedAndFilteredEvents.length !== 1 ? 's' : ''} encontrado{sortedAndFilteredEvents.length !== 1 ? 's' : ''}
            </p>
            {(sortBy !== 'date' || filterBy !== 'all') && (
              <button
                onClick={() => {
                  setSortBy('date');
                  setFilterBy('all');
                }}
                className="text-primary hover:text-primary-light transition-colors duration-300"
              >
                Resetar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto">
          {sortedAndFilteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? 'Nenhum evento encontrado' : 'Nenhum evento disponível'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? 'Tente buscar com outros termos ou verifique a ortografia.'
                  : 'Em breve teremos novos eventos para você!'}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-primary text-black rounded-xl font-semibold hover:bg-primary-light transition-all duration-300"
                >
                  Ver Todos os Eventos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAndFilteredEvents.map((event, index) => {
                const status = getEventStatus(event);
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group no-underline text-white"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="event-card h-full">
                      {/* Event Image */}
                      <div className="relative overflow-hidden">
                        {event.flyerPath ? (
                          <img
                            src={event.flyerPath}
                            alt={event.title}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <div className="text-6xl opacity-20">🎵</div>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color} bg-black/50 backdrop-blur-sm`}>
                            {status.text}
                          </span>
                        </div>

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Ver Detalhes</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {event.title}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-300">
                              <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm">{event.date}</span>
                            </div>

                            <div className="flex items-center text-gray-300">
                              <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm">{event.startTime} - {event.endTime}</span>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-400">Preços a partir de:</span>
                              <span className="text-sm font-semibold text-green-400">
                                {formatPrice(event.normalPrice)}
                              </span>
                            </div>
                            {event.vipPrice && event.vipPrice > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">VIP:</span>
                                <span className="text-sm font-semibold text-yellow-400">
                                  {formatPrice(event.vipPrice)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tickets Info */}
                        <div className="border-t border-white/10 pt-4 mt-auto">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                              </svg>
                              <span className="text-gray-300">
                                {event.availableTickets} disponíveis
                              </span>
                            </div>
                            <span className="text-gray-400">
                              de {event.totalTickets}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

