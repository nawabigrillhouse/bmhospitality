import "./App.css";
import { Toaster } from "./components/ui/sonner";
import NewsletterPopup from "./components/NewsletterPopup";
import Header from "./components/Header";
import Hero from "./components/Hero";
import InstagramFollow from "./components/InstagramFollow";
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

function App() {
  return (
    <div className="App">
      <NewsletterPopup />
      <Header />
      <main>
        <Hero />
        <InstagramFollow />
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
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
