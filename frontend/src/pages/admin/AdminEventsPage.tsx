import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

type Event = {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  totalTickets: number;
  availableTickets: number;
  price: number;
  flyerPath?: string | null;
};

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', totalTickets: 100, price: 0, flyer: null as File | null });
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const r = await fetch('/api/events');
    const d = await r.json();
    setEvents(d);
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    if (form.description) fd.append('description', form.description);
    fd.append('date', form.date);
    fd.append('startTime', form.startTime);
    fd.append('endTime', form.endTime);
    fd.append('totalTickets', String(form.totalTickets));
    fd.append('price', String(form.price));
    if (form.flyer) fd.append('flyer', form.flyer);

    const url = editingId ? `/api/events/${editingId}` : '/api/events';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Erro ao salvar evento'); return; }
    setForm({ title: '', description: '', date: '', startTime: '', endTime: '', totalTickets: 100, price: 0, flyer: null });
    setEditingId(null);
    await load();
  }

  async function del(id: number) {
    if (!confirm('Deseja deletar este evento?')) return;
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { const d = await res.json(); alert(d.error || 'Erro ao deletar'); }
    await load();
  }

  function edit(ev: Event) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description || '',
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      totalTickets: ev.totalTickets,
      price: Number(ev.price),
      flyer: null
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin - Eventos</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <input className="rounded px-3 py-2 text-black" placeholder="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="rounded px-3 py-2 text-black" placeholder="Data (YYYY-MM-DD)" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        <input className="rounded px-3 py-2 text-black" placeholder="Início (HH:mm)" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
        <input className="rounded px-3 py-2 text-black" placeholder="Fim (HH:mm)" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
        <input className="rounded px-3 py-2 text-black" placeholder="Total ingressos" type="number" value={form.totalTickets} onChange={e => setForm(f => ({ ...f, totalTickets: Number(e.target.value) }))} />
        <input className="rounded px-3 py-2 text-black" placeholder="Preço" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
        <textarea className="rounded px-3 py-2 text-black md:col-span-2" placeholder="Descrição" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <input className="md:col-span-2" type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, flyer: e.target.files?.[0] || null }))} />
        <button className="md:col-span-2 px-4 py-2 bg-primary rounded text-black font-semibold" type="submit">{editingId ? 'Atualizar' : 'Criar'} Evento</button>
      </form>

      <div className="overflow-auto border border-white/10 rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3">Título</th>
              <th className="p-3">Data</th>
              <th className="p-3">Horário</th>
              <th className="p-3">Ingressos</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className="border-b border-white/5">
                <td className="p-3">{ev.title}</td>
                <td className="p-3">{ev.date}</td>
                <td className="p-3">{ev.startTime} - {ev.endTime}</td>
                <td className="p-3">{ev.totalTickets} (disp: {ev.availableTickets})</td>
                <td className="p-3">Kz {Number(ev.price).toLocaleString()}</td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-white/10 rounded" onClick={() => edit(ev)}>Editar</button>
                  <button className="px-3 py-1 bg-red-600 rounded ml-2" onClick={() => del(ev.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

