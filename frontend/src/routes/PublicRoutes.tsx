// routes/publicRoutes.tsx
import { Route } from "react-router-dom";
import HomePage from "../pages/site/HomePage";
import EventsPage from "../pages/site/EventsPage";
import EventDetailPage from "../pages/site/EventDetailPage";
import HowItWorksPage from "../pages/site/HowItWorksPage";
import ContactPage from "../pages/site/ContactPage";
import FAQPage from "../pages/site/FAQPage";
import TermsPage from "../pages/site/TermsPage";

export const publicRoutes = [
  <Route path="/" element={<HomePage />} key="/" />,
  <Route path="/events" element={<EventsPage />} key="/events" />,
  <Route path="/events/:id" element={<EventDetailPage />} key="/events/:id" />,
  <Route path="/how-it-works" element={<HowItWorksPage />} key="/how-it-works" />,
  <Route path="/contact" element={<ContactPage />} key="/contact" />,
  <Route path="/faq" element={<FAQPage />} key="/faq" />,
  <Route path="/terms" element={<TermsPage />} key="/terms" />,
];
