import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types/events';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';

export default function EventDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [qty, setQty] = useState(1);
  const [ticketType, setTicketType] = useState<'NORMAL' | 'VIP'>('NORMAL');
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
        body: JSON.stringify({ eventId: Number(id), quantity: qty, ticketType })
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
    <>
      <NavBar />
      <div className="py-10 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
        <div className="flex gap-6 flex-col md:flex-row">
          {event.flyerPath && (
            <img src={event.flyerPath} alt={event.title} className="w-[360px] h-[480px] object-cover rounded-lg" />
          )}
          <div className="flex-1">
            <p className="text-gray-200 mb-3">{event.description}</p>
            <p><b>Data:</b> {event.date}</p>
            <p><b>Horário:</b> {event.startTime} - {event.endTime}</p>
            {/* Pricing Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Selecione o tipo de ingresso:</h3>
              {/* Normal Ticket Option */}
              <div className={`border-2 rounded-lg p-4 mb-3 cursor-pointer transition-all ${ticketType === 'NORMAL'
                ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`} onClick={() => setTicketType('NORMAL')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="NORMAL"
                      checked={ticketType === 'NORMAL'}
                      onChange={(e) => setTicketType(e.target.value as 'NORMAL' | 'VIP')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-white">Ingresso Normal</h4>
                      <p className="text-gray-300 text-sm">Acesso padrão ao evento</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-400">
                      {Number(event.normalPrice || 0).toLocaleString()} Kz
                    </span>
                  </div>
                </div>
              </div>
              {/* VIP Ticket Option */}
              <div className={`border-2 rounded-lg p-4 mb-3 cursor-pointer transition-all ${ticketType === 'VIP'
                ? 'border-yellow-500 bg-yellow-500/20 shadow-lg'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`} onClick={() => setTicketType('VIP')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      value="VIP"
                      checked={ticketType === 'VIP'}
                      onChange={(e) => setTicketType(e.target.value as 'NORMAL' | 'VIP')}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-white">Ingresso VIP</h4>
                      <p className="text-gray-300 text-sm">Acesso VIP com benefícios exclusivos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-400">
                      {Number(event.vipPrice || 0).toLocaleString()} Kz
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-white">
                  <b>Total selecionado:</b>
                  <span className="text-green-400 text-xl ml-2">
                    {Number((ticketType === 'NORMAL' ? event.normalPrice : event.vipPrice) || 0).toLocaleString()} Kz
                  </span>
                </p>
              </div>
            </div>
            <p className="mb-3"><b>Disponíveis:</b> {event.availableTickets}</p>
            <p className="mb-3"><b>Total de ingressos:</b> {event.totalTickets}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Quantidade de ingressos:</h3>
              <div className="flex items-center gap-3">
                <button
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-lg transition-colors"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                >
                  −
                </button>
                <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 min-w-[60px] text-center">
                  <span className="text-white font-semibold text-lg">{qty}</span>
                </div>
                <button
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-lg transition-colors"
                  onClick={() => setQty(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
            {error && <div className="text-red-400 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">{error}</div>}
            <button
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:hover:scale-100 disabled:cursor-not-allowed"
              onClick={purchase}
              disabled={qty <= 0}
            >
              🛒 Comprar Agora -  {Number((ticketType === 'NORMAL' ? event.normalPrice : event.vipPrice) || 0).toLocaleString()} Kz
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

