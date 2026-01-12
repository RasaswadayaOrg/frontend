"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroEvent {
  id: string | number;
  title: string;
  eventDate: Date | string;
  startTime?: string;
  location?: string;
  imageUrl?: string;
  category?: string;
}

interface HeroSliderProps {
    events?: HeroEvent[];
}

export function HeroSlider({ events = [] }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // If no events, render nothing or placeholder?
  // Let's assume passed events or empty.
  const hasSlides = events && events.length > 0;

  useEffect(() => {
    if (!hasSlides) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hasSlides, events.length]);

  if (!hasSlides) {
      return (
        <div className="relative h-[500px] w-full bg-slate-100 flex items-center justify-center">
             <p className="text-slate-400">No featured events available</p>
        </div>
      );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % events.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);

  return (
    <div className="relative h-[500px] w-full rounded-3xl overflow-hidden group shadow-xl shadow-brand-900/10">
      {/* Slides */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-in-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {events.map((slide) => (
          <div key={slide.id} className="relative min-w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl || 'https://images.unsplash.com/photo-1543946602-a0ce26d9e6e0'}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-20 md:justify-center md:pb-0 px-6 md:px-16 lg:px-24">
              <div className="max-w-4xl animate-fadeIn space-y-4 md:space-y-6">
                {slide.category && (
                  <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-white uppercase bg-brand-600 rounded-sm w-fit">
                    {slide.category}
                  </span>
                )}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-md">
                  {slide.title}
                </h2>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-100 font-medium text-base md:text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-400" />
                    <span>
                      {new Date(slide.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      {slide.startTime && ` • ${slide.startTime}`}
                    </span>
                  </div>
                  {slide.location && (
                     <div className="hidden sm:block text-slate-400">•</div>
                  )}
                  {slide.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-400" />
                      <span>{slide.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                    <Link
                    href={`/events/${slide.id}`}
                    className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all bg-brand-600 rounded-lg hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30 transform hover:-translate-y-1"
                    >
                    Book Tickets
                    </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-brand-600 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-brand-600 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-brand-500" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
