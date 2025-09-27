import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

import { Event } from '../../types/events';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', totalTickets: 100, normalPrice: 0, vipPrice: 0, flyer: null as File | null });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!form.date) newErrors.date = 'Data é obrigatória';
    if (!form.startTime) newErrors.startTime = 'Hora de início é obrigatória';
    if (!form.endTime) newErrors.endTime = 'Hora de fim é obrigatória';
    if (form.totalTickets <= 0) newErrors.totalTickets = 'Total de ingressos deve ser maior que 0';
    if (form.normalPrice <= 0) newErrors.normalPrice = 'Preço normal deve ser maior que 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors(e => ({ ...e, [field]: '' }));
    }
  };

  async function load() {
    setTableLoading(true);
    try {
      const r = await fetch('/api/events');
      const d = await r.json();
      setEvents(d);
    } catch (error) {
      alert('Erro ao carregar eventos');
    } finally {
      setTableLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      if (form.description) fd.append('description', form.description);
      fd.append('date', form.date);
      fd.append('startTime', form.startTime);
      fd.append('endTime', form.endTime);
      fd.append('totalTickets', String(form.totalTickets));
      fd.append('normalPrice', String(form.normalPrice));
      fd.append('vipPrice', String(form.vipPrice));
      if (form.flyer) fd.append('flyer', form.flyer);

      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Erro ao salvar evento'); return; }
      setForm({ title: '', description: '', date: '', startTime: '', endTime: '', totalTickets: 100, normalPrice: 0, vipPrice: 0, flyer: null });
      setEditingId(null);
      setErrors({});
      await load();
    } catch (error) {
      alert('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  }

  async function del(id: number) {
    if (!confirm('Deseja deletar este evento?')) return;
    setTableLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json(); alert(d.error || 'Erro ao deletar'); return; }
      await load();
    } catch (error) {
      alert('Erro ao deletar');
    } finally {
      setTableLoading(false);
    }
  }

  function edit(ev: Event) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description || '',
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      totalTickets: ev.totalTickets || 0,
      normalPrice: Number(ev.normalPrice || 0),
      vipPrice: Number(ev.vipPrice || 0),
      flyer: null
    });
    setErrors({});
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin - Eventos</h2>
      <form onSubmit={submit} className="space-y-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-200">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField
              label="Título"
              type="text"
              value={form.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="Título do evento"
              error={errors.title}
              required
            />
            <InputField
              label="Data"
              type="date"
              value={form.date}
              onChange={e => handleInputChange('date', e.target.value)}
              placeholder="Data (YYYY-MM-DD)"
              icon="📅"
              error={errors.date}
              required
            />
            <InputField
              label="Início"
              type="time"
              value={form.startTime}
              onChange={e => handleInputChange('startTime', e.target.value)}
              placeholder="Início (HH:mm)"
              icon="⏰"
              error={errors.startTime}
              required
            />
            <InputField
              label="Fim"
              type="time"
              value={form.endTime}
              onChange={e => handleInputChange('endTime', e.target.value)}
              placeholder="Fim (HH:mm)"
              icon="⏰"
              error={errors.endTime}
              required
            />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-200">Ingressos e Preços</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InputField
              label="Total de Ingressos"
              type="number"
              value={String(form.totalTickets)}
              onChange={e => handleInputChange('totalTickets', Number(e.target.value) || 0)}
              placeholder="Total de ingressos disponíveis"
              icon="👥"
              step="1"
              error={errors.totalTickets}
              required
            />
            <InputField
              label="Preço Normal"
              type="number"
              value={String(form.normalPrice)}
              onChange={e => handleInputChange('normalPrice', Number(e.target.value) || 0)}
              placeholder="Preço normal (ex: 1000 Kz)"
              icon="💰"
              step="0.01"
              error={errors.normalPrice}
              required
            />
            <InputField
              label="Preço VIP"
              type="number"
              value={String(form.vipPrice)}
              onChange={e => handleInputChange('vipPrice', Number(e.target.value) || 0)}
              placeholder="Preço VIP (ex: 2000 Kz)"
              icon="💎"
              step="0.01"
              error={errors.vipPrice}
            />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-200">Detalhes Adicionais</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Descrição</label>
              <textarea
                className="w-full rounded px-3 py-2 text-black min-h-[100px] resize-vertical"
                placeholder="Descrição do evento"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Flyer (Imagem)</label>
              <input className="w-full rounded px-3 py-2 text-black" type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, flyer: e.target.files?.[0] || null }))} />
            </div>
          </div>
        </Card>

        <Button className="w-full" type="submit" isLoading={loading}>
          {editingId ? 'Atualizar' : 'Criar'} Evento
        </Button>
      </form>

      <div className="overflow-auto border border-white/10 rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3">Título</th>
              <th className="p-3">Data</th>
              <th className="p-3">Horário</th>
              <th className="p-3">Ingressos</th>
              <th className="p-3">Preços</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tableLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">Nenhum evento encontrado</td>
              </tr>
            ) : (
              events.map(ev => (
                <tr key={ev.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3">{ev.title}</td>
                  <td className="p-3">{ev.date}</td>
                  <td className="p-3">{ev.startTime} - {ev.endTime}</td>
                  <td className="p-3">{ev.totalTickets} (disp: {ev.availableTickets})</td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="text-green-400">Normal: Kz {Number(ev.normalPrice || 0).toLocaleString()}</div>
                      {ev.vipPrice && ev.vipPrice > 0 && (
                        <div className="text-yellow-400">VIP: Kz {Number(ev.vipPrice).toLocaleString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <Button variant="secondary" size="sm" onClick={() => edit(ev)} className="mr-2">Editar</Button>
                    <Button variant="outline" size="sm" onClick={() => del(ev.id)}>Excluir</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

