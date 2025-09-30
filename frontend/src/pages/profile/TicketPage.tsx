import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type Purchase = {
  id: number;
  quantity: number;
  totalAmount: number;
  status: 'PENDING' | 'VALIDATED' | 'CANCELLED';
  uniqueTicketId: string;
  ticketType: 'NORMAL' | 'VIP';
  event: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    flyerPath?: string | null;
  };
};

export default function TicketPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token, user } = useAuth();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      nav('/login');
      return;
    }

    // Buscar compra específica
    fetch('/api/purchases/my-purchases', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(purchases => {
        const found = purchases.find((p: Purchase) => p.id === Number(id));
        if (found) {
          setPurchase(found);
        } else {
          nav('/me/purchases');
        }
      })
      .catch(() => nav('/me/purchases'))
      .finally(() => setLoading(false));
  }, [id, token, nav]);

  function printTicket() {
    window.print();
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400">Carregando ticket...</div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400">Ticket não encontrado</div>
        <button onClick={() => nav('/me/purchases')} className="mt-4 px-4 py-2 bg-primary rounded">
          Voltar para minhas compras
        </button>
      </div>
    );
  }

  if (purchase.status !== 'VALIDATED') {
    return (
      <div className="p-6 text-center">
        <div className="text-yellow-400 mb-4">Este ticket ainda não foi validado</div>
        <div className="text-gray-400 mb-4">Status: {purchase.status}</div>
        <button onClick={() => nav('/me/purchases')} className="px-4 py-2 bg-primary rounded">
          Voltar para minhas compras
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Botões de ação */}
      <div className="mb-6 flex gap-3 justify-between">
        <button onClick={() => nav('/me/purchases')} className="px-4 py-2 bg-white/10 rounded">
          ← Voltar
        </button>
        <button onClick={printTicket} className="px-4 py-2 bg-primary text-black rounded">
          🖨️ Imprimir Ticket
        </button>
      </div>

      {/* Rectangular Ticket Design */}
      <div className="ticket-container bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg print:shadow-none w-full max-w-4xl mx-auto h-auto min-h-[300px] lg:min-h-[400px]">
        <div className="flex flex-col lg:flex-row h-auto lg:h-[400px]">
          {/* Left Side - Event Image */}
          <div className="w-full lg:w-2/5 h-48 lg:h-full flex-shrink-0 bg-gradient-to-br from-purple-900 to-blue-900 p-2">
            {purchase.event.flyerPath ? (
              <img
                src={purchase.event.flyerPath}
                alt={purchase.event.title}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎫</div>
                  <div className="text-sm font-semibold">{purchase.event.title}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Event Details */}
          <div className="w-full lg:w-3/5 p-4 lg:p-6 flex flex-col justify-between">
            {/* Header with Title and Check-in */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-2 lg:mb-4">
              <div className="flex-1 mb-2 lg:mb-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">{purchase.event.title}</h1>
                <div className="text-gray-600 mb-1">
                  <span className="font-semibold">{purchase.ticketType === 'VIP' ? 'VIP' : 'Normal'}</span> | {Number(purchase.totalAmount).toLocaleString()} Kz
                </div>
                <div className="text-gray-600 mb-1">
                  Quantidade: {purchase.quantity} {purchase.quantity > 1 ? 'ingressos' : 'ingresso'}
                </div>
                <div className="text-gray-600 text-sm">
                  {purchase.event.date} {purchase.event.startTime} - {purchase.event.endTime}
                </div>
              </div>

              {/* Check-in Logo */}
              <div className="text-right ml-0 lg:ml-4">
                <div className="flex items-center justify-end mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="text-blue-600 font-bold">Check-in</span>
                </div>
                <div className="text-xs text-gray-500">POWERED BY check-in.ao</div>
              </div>
            </div>

            {/* E-Ticket Section */}
            <div className="bg-gray-100 rounded-lg p-3 lg:p-4 mb-2 lg:mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">E-Ticket</div>
                <div className="font-mono text-base lg:text-lg font-bold text-gray-800">
                  {purchase.uniqueTicketId}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-2 lg:mb-4">
              <div className="text-sm text-gray-600 mb-1">Nome</div>
              <div className="font-semibold text-gray-800">{user?.name || 'N/A'}</div>
            </div>

            {/* Footer Notes */}
            <div className="text-xs text-gray-500 text-center mt-auto">
              <p>• {purchase.quantity > 1 ? `Este ticket equivale a ${purchase.quantity} ingressos válidos para o evento especificado` : 'Este ticket é válido apenas para o evento especificado'}</p>
              <p>• Apresente o código único na entrada</p>
              <p>• Não é transferível</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para impressão */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .ticket-container {
            box-shadow: none !important;
            width: 800px !important;
            height: 400px !important;
            display: flex !important;
            flex-direction: row !important;
          }
          .ticket-container > div:first-child {
            width: 100% !important;
            height: 400px !important;
            flex-direction: row !important;
          }
          .ticket-container .w-full {
            width: 40% !important;
          }
          .ticket-container .lg\\:w-3\\/5 {
            width: 60% !important;
          }
          .ticket-container h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
