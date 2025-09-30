import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import HowItWorksPage from '../pages/HowItWorksPage'
import ContactPage from '../pages/ContactPage'
import FAQPage from '../pages/FAQPage'
import TermsPage from '../pages/TermsPage'
import EventsPage from '../pages/EventsPage'
import EventDetailPage from '../pages/EventDetailPage'

export default function PublicRoutes() {

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />

            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
        </Routes>
    )

}