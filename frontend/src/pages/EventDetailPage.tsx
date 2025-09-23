import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type Event = {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  flyerPath?: string | null;
  price: number;
  availableTickets: number;
};

export default function EventDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [id]);

  async function purchase() {
    if (!token) {
      nav('/login');
      return;
    }
    setError(null);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: Number(id), quantity: qty })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na compra');
      nav('/payment', { state: { purchase: data.purchase } });
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!event) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
      <div className="flex gap-6 flex-col md:flex-row">
        {event.flyerPath && (
          <img src={event.flyerPath} alt={event.title} className="w-[360px] h-[480px] object-cover rounded-lg" />
        )}
        <div className="flex-1">
          <p className="text-gray-200 mb-3">{event.description}</p>
          <p><b>Data:</b> {event.date}</p>
          <p><b>Horário:</b> {event.startTime} - {event.endTime}</p>
          <p><b>Preço:</b> Kz {Number(event.price).toLocaleString()}</p>
          <p className="mb-3"><b>Disponíveis:</b> {event.availableTickets}</p>

          <div className="flex items-center gap-2 mb-3">
            <button className="px-3 py-1 bg-white/10 rounded" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <input className="w-16 text-black rounded px-2 py-1" type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} />
            <button className="px-3 py-1 bg-white/10 rounded" onClick={() => setQty(q => q + 1)}>+</button>
          </div>

          {error && <div className="text-red-400 mb-2">{error}</div>}
          <button className="px-4 py-2 bg-primary rounded text-black font-semibold" onClick={purchase} disabled={qty <= 0}>Comprar Agora</button>
        </div>
      </div>
    </div>
  );
}

