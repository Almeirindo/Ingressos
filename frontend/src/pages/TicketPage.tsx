import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type Purchase = {
  id: number;
  quantity: number;
  totalAmount: number;
  status: 'PENDING' | 'VALIDATED' | 'CANCELLED';
  uniqueTicketId: string;
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
  const { token } = useAuth();
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
    <div className="p-6 max-w-2xl mx-auto">
      {/* Botões de ação */}
      <div className="mb-6 flex gap-3 justify-between">
        <button onClick={() => nav('/me/purchases')} className="px-4 py-2 bg-white/10 rounded">
          ← Voltar
        </button>
        <button onClick={printTicket} className="px-4 py-2 bg-primary text-black rounded">
          🖨️ Imprimir Ticket
        </button>
      </div>

      {/* Ticket */}
      <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 border-2 border-primary/30 rounded-2xl overflow-hidden print:border-black print:bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 text-black p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">INGRESSOS DA BANDA</h1>
          <div className="text-sm font-semibold">TICKET DE ENTRADA</div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Código do ticket */}
          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-2">CÓDIGO ÚNICO</div>
            <div className="font-mono text-3xl font-bold text-primary bg-black/20 p-4 rounded-lg">
              {purchase.uniqueTicketId}
            </div>
          </div>

          {/* Informações do evento */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">{purchase.event.title}</h2>
            
            {purchase.event.flyerPath && (
              <div className="mb-4">
                <img 
                  src={purchase.event.flyerPath} 
                  alt={purchase.event.title} 
                  className="w-full max-w-xs mx-auto rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Data:</div>
                <div className="font-semibold">{purchase.event.date}</div>
              </div>
              <div>
                <div className="text-gray-400">Horário:</div>
                <div className="font-semibold">{purchase.event.startTime} - {purchase.event.endTime}</div>
              </div>
            </div>
          </div>

          {/* Informações da compra */}
          <div className="border-t border-white/10 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="text-gray-400">Quantidade:</div>
                <div className="font-semibold">{purchase.quantity} ingresso{purchase.quantity > 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-gray-400">Valor Total:</div>
                <div className="font-semibold">Kz {Number(purchase.totalAmount).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3 text-center">
              <div className="text-green-400 font-semibold">✓ TICKET VALIDADO</div>
              <div className="text-sm text-gray-300 mt-1">Apresente este código na entrada do evento</div>
            </div>
          </div>

          {/* Instruções */}
          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>• Este ticket é válido apenas para o evento especificado</p>
            <p>• Apresente o código único na entrada</p>
            <p>• Não é transferível</p>
          </div>
        </div>
      </div>

      {/* Estilos para impressão */}
      <style jsx>{`
        @media print {
          body { background: white !important; }
          .print\\:border-black { border-color: black !important; }
          .print\\:bg-white { background: white !important; }
        }
      `}</style>
    </div>
  );
}
