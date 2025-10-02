import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

import { getImageUrl } from "../../utils/getImageUrl";


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

export default function MyPurchasesPage() {
  const { token } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/purchases/my-purchases', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setPurchases)
      .catch(() => setPurchases([]));
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Minhas Compras</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {purchases.map(p => (
          <div key={p.id} className="border border-white/10 rounded-lg overflow-hidden">

            {p.event.flyerPath ? (
              <img
                src={getImageUrl(p.event.flyerPath)}
                alt={p.event.title}
                className="h-[40%] w-full rounded object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs">Sem flyer</span>
            )}


            <div className="p-4">
              <div className="font-semibold text-lg mb-2">{p.event.title}</div>
              <div className="text-sm text-gray-300 mb-3">{p.event.date} • {p.event.startTime} - {p.event.endTime}</div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantidade:</span>
                  <span>{p.quantity} ingresso{p.quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo:</span>
                  <span className={`px-2 py-1 rounded text-xs ${p.ticketType === 'VIP' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                    {p.ticketType === 'VIP' ? 'vip' : 'normal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-semibold">Kz {Number(p.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'VALIDATED' ? 'bg-green-600 text-white' :
                    p.status === 'PENDING' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                    {p.status === 'VALIDATED' ? 'Validado' :
                      p.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
              </div>


              {/* Ticket único - só aparece se validado */}
              {p.status === 'VALIDATED' && p.uniqueTicketId && (
                <div className="border-t border-white/10 pt-4">
                  <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">TICKET ÚNICO</div>
                      <div className="font-mono text-lg font-bold text-primary mb-2">
                        {p.uniqueTicketId}
                      </div>
                      <div className="text-xs text-gray-300 mb-3">
                        Apresente este código na entrada do evento
                      </div>
                      <a
                        href={`/ticket/${p.id}`}
                        className="inline-block px-3 py-1 bg-primary text-black rounded text-sm font-semibold hover:brightness-110"
                      >
                        Ver Ticket Completo
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Instruções para pendente */}
              {p.status === 'PENDING' && (
                <div className="border-t border-white/10 pt-4 mb-10">
                  <div className="bg-yellow-600/20 rounded-lg p-3">
                    <div className="text-sm text-yellow-200">
                      <div className="font-semibold mb-1">Aguardando validação</div>
                      <div>Envie o comprovante de pagamento via WhatsApp para validação do seu ingresso.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

