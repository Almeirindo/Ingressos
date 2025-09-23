import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Event = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  flyerPath?: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Eventos</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {events.map(ev => (
          <Link key={ev.id} to={`/events/${ev.id}`} className="no-underline text-white">
            <div className="border border-white/10 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition">
              {ev.flyerPath && <img src={ev.flyerPath} alt={ev.title} className="w-full h-[220px] object-cover" />}
              <div className="p-3">
                <div className="font-semibold">{ev.title}</div>
                <div className="text-xs text-gray-300">{ev.date} • {ev.startTime} - {ev.endTime}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

