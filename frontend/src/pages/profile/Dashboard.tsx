import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Event } from "../../types/events";

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );

  const myTickets = 5; // mock, depois busca do backend
  const totalSpent = 25000; // mock, idem

  return (
    <>
        <div className="min-h-screen p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-gray-400">Ingressos comprados</p>
              <h2 className="text-3xl font-bold text-primary">{myTickets}</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-gray-400">Gasto total</p>
              <h2 className="text-3xl font-bold text-green-400">
                Kz {totalSpent.toLocaleString()}
              </h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <p className="text-gray-400">Eventos disponíveis</p>
              <h2 className="text-3xl font-bold text-yellow-400">
                {upcomingEvents.length}
              </h2>
            </div>
          </div>
          {/* Próximos eventos */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Próximos eventos
            </h2>
            {loading ? (
              <p className="text-gray-400">Carregando...</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-gray-400">Nenhum evento encontrado.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <li
                    key={event.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-gray-400 text-sm">{event.date}</p>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-primary hover:text-primary-light"
                    >
                      Ver
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
    </>
  );
}
