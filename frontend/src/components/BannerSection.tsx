import { useMemo, useState } from "react";
import { Event } from '../types/events';
import { Link } from "react-router-dom";


const [events, setEvents] = useState<Event[]>([]);

const heroImage = useMemo(() => {
    const firstWithFlyer = events.find(e => !!e.flyerPath);
    return firstWithFlyer?.flyerPath || undefined;
}, [events]);

export default function BannerSection() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-dark overflow-hidden animate-gradient-shift">
            {heroImage && (
                <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-20 animate-fade-in" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="relative z-10 text-center px-6 animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 bg-gradient-to-r from-primary via-white to-purple-300 bg-clip-text text-transparent animate-pulse">Os melhores eventos em um só lugar</h1>
                <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-3xl mx-auto animate-fade-in-delay">Compre ingressos para as maiores festas de forma rápida, simples e segura.</p>
                <Link to="/events" className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-black font-semibold rounded-full hover:from-primary/90 hover:to-purple-500 hover:scale-105 shadow-lg shadow-primary/25 animate-pulse transition-all duration-300">Ver Eventos</Link>
            </div>
        </section>
    )
}