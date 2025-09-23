export interface Event {
  id: number;
  title: string;
  description?: string | null;
  date: string; // formato YYYY-MM-DD
  startTime: string; // formato HH:mm
  endTime: string; // formato HH:mm
  flyerPath?: string | null;
  totalTickets?: number;
  availableTickets?: number;
  price?: number;
  ticketsSold?: number;
}

export interface EventCarouselProps {
  events: Event[];
  title?: string;
  className?: string;
  showTicketsInfo?: boolean;
  showCountdown?: boolean;
  showPopularity?: boolean;
}

export type EventCategory = 'Festa' | 'Evento Especial' | 'Show' | 'Concerto' | 'Teatro';

export interface EventWithStats extends Event {
  ticketsSold: number;
  availableTickets: number;
  isToday?: boolean;
  isAlmostSoldOut?: boolean;
  popularityScore: number;
  category?: EventCategory;
}
