import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import NewsletterPopup from "./components/NewsletterPopup";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickEnquiryForm from "./components/QuickEnquiryForm";
import Services from "./components/Services";
import Packages from "./components/Packages";
import GoaPackage from "./components/GoaPackage";
import HotelsResorts from "./components/HotelsResorts";
import BohraStay from "./components/BohraStay";
import FlightInquiry from "./components/FlightInquiry";
import OffersDeals from "./components/OffersDeals";
import TravelBlogs from "./components/TravelBlogs";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import InstagramFloat from "./components/InstagramFloat";
import AdminPage from "./pages/admin/AdminPage";

function MainSite() {
  return (
    <>
      <NewsletterPopup />
      <Header />
      <main>
        <Hero />
        <QuickEnquiryForm />
        <Services />
        <Packages />
        <GoaPackage />
        <HotelsResorts />
        <BohraStay />
        <FlightInquiry />
        <OffersDeals />
        <TravelBlogs />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <InstagramFloat />
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
