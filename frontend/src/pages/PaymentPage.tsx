import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Event } from '../types/events';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

type Purchase = {
  id: number;
  eventId: number;
  quantity: number;
  totalAmount: number;
  uniqueTicketId: string;
  status: 'PENDING' | 'VALIDATED' | 'CANCELLED';
  ticketType: 'NORMAL' | 'VIP';
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
      <div className="p-6 max-w-md mx-auto">
        <p className="text-gray-600 mb-4">Nenhuma compra encontrada. Voltar para a página inicial.</p>
        <Button onClick={() => nav('/')} variant="primary" fullWidth>Voltar</Button>
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
    const message = `Olá! Enviei a transferência para o evento ${title} (${date}).\nTicket ID: ${purchase!.uniqueTicketId}\nQuantidade: ${purchase!.quantity}\nTotal: Kz ${total.toLocaleString()}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Dados para Pagamento</h2>
      {event && (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          {event.flyerPath && <img src={event.flyerPath} alt={event.title} className="w-full md:w-48 h-64 md:h-auto object-cover rounded-lg shadow-md" />}
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <div className="text-sm md:text-base">{event.date} • {event.startTime} - {event.endTime}</div>
            <div className="text-sm md:text-base">Quantidade: {purchase!.quantity}</div>
            <div className="text-sm md:text-base">Tipo: {purchase!.ticketType === 'VIP' ? 'VIP' : 'Normal'}</div>
            <div className="text-sm md:text-base font-semibold">Total: Kz {total.toLocaleString()}</div>
            <div className="text-sm md:text-base">Ticket ID: {purchase!.uniqueTicketId}</div>
            <div className="text-sm md:text-base">Status: {purchase!.status}</div>
          </div>
        </div>
      )}
      <Card variant="solid" padding="md" className="mb-6">
        <div className="space-y-3">
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-bold">IBAN:</span> {iban || '—'} {iban && <Button onClick={copyIban} variant="secondary" size="sm">Copiar IBAN</Button>}
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-bold">WhatsApp:</span> {phone || '—'}
          </p>
          <p className="text-sm leading-relaxed">Faça a transferência via MCX, BAI Directo, ou app do seu banco para o IBAN acima. Em seguida, envie o comprovante por WhatsApp para validação do seu ingresso.</p>
          {phone && <Button onClick={openWhatsApp} variant="primary" size="md" fullWidth className="mt-2">Enviar mensagem no WhatsApp</Button>}
        </div>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => nav('/me/purchases')} variant="secondary" fullWidth className="sm:w-auto">Ver minhas compras</Button>
        <Button onClick={() => nav('/')} variant="primary" fullWidth className="sm:w-auto">Voltar ao início</Button>
      </div>
    </div>
  );
}

