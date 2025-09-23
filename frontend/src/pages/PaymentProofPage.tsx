import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function PaymentProofPage() {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [purchaseId, setPurchaseId] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('paymentProof', file);
    // Backend atual não tem endpoint para upload posterior; manter página como placeholder
    alert('Envio de comprovante deve ser feito na criação da compra (uploadProof).');
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Enviar Comprovante (placeholder)</h2>
      <form onSubmit={submit}>
        <input placeholder="ID da compra" value={purchaseId} onChange={e => setPurchaseId(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

