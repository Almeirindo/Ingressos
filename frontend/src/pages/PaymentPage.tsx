import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Purchase = {
  id: number;
  eventId: number;
  quantity: number;
  totalAmount: number;
  uniqueTicketId: string;
  status: 'PENDING' | 'VALIDATED' | 'CANCELLED';
};

type Event = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  flyerPath?: string | null;
};

export default function PaymentPage() {
  const nav = useNavigate();
  const location = useLocation() as any;
  const initialPurchase: Purchase | null = location?.state?.purchase || null;
  const [purchase] = useState<Purchase | null>(initialPurchase);
  const [event, setEvent] = useState<Event | null>(null);
  const [iban, setIban] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    fetch('/api/payment-info')
      .then(r => r.json())
      .then(d => { setIban(d.iban || ''); setPhone(d.phone || ''); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!purchase?.eventId) return;
    fetch(`/api/events/${purchase.eventId}`)
      .then(r => r.json())
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [purchase?.eventId]);

  if (!purchase) {
    return (
      <div style={{ padding: 24 }}>
        <p>Nenhuma compra encontrada. Voltar para a página inicial.</p>
        <button onClick={() => nav('/')}>Voltar</button>
      </div>
    );
  }

  const total = Number(purchase.totalAmount);

  function normalizePhoneForWa(p: string) {
    // Remove espaços e símbolos, mantém + se houver
    const cleaned = p.replace(/[^\d+]/g, '');
    return cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
  }

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(iban);
      alert('IBAN copiado para a área de transferência.');
    } catch (e) {
      alert('Não foi possível copiar o IBAN.');
    }
  }

  function openWhatsApp() {
    const waNumber = normalizePhoneForWa(phone);
    const title = event?.title || 'Evento';
    const date = event?.date || '';
    const message = `Olá! Enviei a transferência para o evento ${title} (${date}).\nTicket ID: ${purchase.uniqueTicketId}\nQuantidade: ${purchase.quantity}\nTotal: Kz ${total.toLocaleString()}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>Dados para Pagamento</h2>
      {event && (
        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
          {event.flyerPath && <img src={event.flyerPath} alt={event.title} style={{ width: 200, height: 260, objectFit: 'cover', borderRadius: 8 }} />}
          <div>
            <h3>{event.title}</h3>
            <div>{event.date} • {event.startTime} - {event.endTime}</div>
            <div>Quantidade: {purchase.quantity}</div>
            <div>Total: Kz {total.toLocaleString()}</div>
            <div>Ticket ID: {purchase.uniqueTicketId}</div>
            <div>Status: {purchase.status}</div>
          </div>
        </div>
      )}
      <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 8, marginBottom: 16 }}>
        <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <b>IBAN:</b> {iban || '—'} {iban && <button onClick={copyIban}>Copiar IBAN</button>}
        </p>
        <p><b>WhatsApp:</b> {phone || '—'}</p>
        <p>Faça a transferência via MCX, BAI Directo, ou app do seu banco para o IBAN acima. Em seguida, envie o comprovante por WhatsApp para validação do seu ingresso.</p>
        {phone && <button onClick={openWhatsApp}>Enviar mensagem no WhatsApp</button>}
      </div>
      <div>
        <button onClick={() => nav('/me/purchases')}>Ver minhas compras</button>
        <button onClick={() => nav('/') } style={{ marginLeft: 8 }}>Voltar ao início</button>
      </div>
    </div>
  );
}

