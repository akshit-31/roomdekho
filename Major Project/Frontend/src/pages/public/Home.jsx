import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AuthModal from "../../components/auth/AuthModal";
import { useAuth } from "../../hooks/useAuth";
import VendorDashboard from "../vendor/VendorDashboard";
import OwnerDashboard from "../owner/OwnerDashboard";

import img1 from "../../image.png";
import img2 from "../../image copy.png";
import img3 from "../../image copy 2.png";
import img4 from "../../ef0c218f-6a1e-4f6d-b14f-a210f8c46a77.jfif";

const SLIDE_IMAGES = [img1, img2, img3, img4];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // If user is logged in, show the Vendor Dashboard view
  if (isAuthenticated) {
    return <VendorDashboard />;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length);
  };

  // Auto-open Glassmorphism Login modal on initial screen load if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setAuthModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-center bg-slate-50 p-2 sm:p-4 lg:p-6">
      {/* Hero Section Container - Expanded Full Screen Height & Full Width Fit */}
      <section className="relative mx-auto flex min-h-[85vh] w-full max-w-[96vw] flex-col justify-center overflow-hidden rounded-[2.5rem] bg-[#1a293e] text-white shadow-2xl">
        {/* Background Image Carousel */}
        {SLIDE_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-55 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/40 to-[#0f172a]/30" />

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-6 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-slate-900/70 active:scale-95 border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-6 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-slate-900/70 active:scale-95 border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slide Indicators Dots */}
        <div className="absolute top-6 right-8 z-20 flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-md border border-white/10">
          {SLIDE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentSlide ? "w-7 bg-amber-500" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center sm:px-16 lg:px-28">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl drop-shadow-lg">
            Don't roam around!
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-slate-200 sm:text-xl lg:text-2xl leading-relaxed drop-shadow-md">
            Find your desired house within 100 hours with 5 easy steps.
          </p>
        </div>
      </section>

      {/* Auto-Triggered Glassmorphism Login Popup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
      />
    </div>
  );
}
