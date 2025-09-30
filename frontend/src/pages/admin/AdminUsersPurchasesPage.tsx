import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type Purchase = {
  id: number;
  status: 'PENDING' | 'VALIDATED' | 'CANCELLED';
  totalAmount: number;
  quantity: number;
  uniqueTicketId: string | null;
  user: { name: string; phone: string; email: string | null };
  event: { title: string; date: string };
};



export default function AdminUsersPurchasesPage() {
  const { token } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  async function load() {
    const res = await fetch('/api/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    // console.log("API result:", data);

    if (Array.isArray(data)) {
      setPurchases(data);
    } else {
      console.error("Erro da API:", data.error);
      setPurchases([]);
    }
  }

  useEffect(() => { if (token) load(); }, [token]);


  async function setStatus(
    id: number,
    status: 'PENDING' | 'VALIDATED' | 'CANCELLED'
  ) {
    const res = await fetch(`/api/purchases/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Erro ao atualizar status');
      return;
    }
    await load();
  }



  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin - Usuários e Compras</h2>
      <div className="overflow-auto border border-white/10 rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3">Usuário</th>
              <th className="p-3">Contato</th>
              <th className="p-3">Evento</th>
              <th className="p-3">Qtd</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="p-3">{p.user.name}</td>
                <td className="p-3">{p.user.phone}{p.user.email ? ` | ${p.user.email}` : ''}</td>
                <td className="p-3">{p.event.title} ({p.event.date})</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">Kz {Number(p.totalAmount).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'VALIDATED' ? 'bg-green-600 text-white' : p.status === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  {p.uniqueTicketId ? (
                    <span className="font-mono text-xs bg-black/20 px-2 py-1 rounded">
                      {p.uniqueTicketId}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="p-3">
                  <select className="bg-white/10 rounded px-2 py-1" value={p.status} onChange={e => setStatus(p.id, e.target.value as any)}>
                    <option value="PENDING">PENDING</option>
                    <option value="VALIDATED">VALIDATED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
