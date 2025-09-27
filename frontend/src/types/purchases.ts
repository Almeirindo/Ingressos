export interface Purchase {
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
}
