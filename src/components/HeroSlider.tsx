"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { buildSlug } from "../lib/slug";

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
    <div 
      className="relative h-[500px] w-full rounded-[40px] overflow-hidden group shadow-[0px_10px_15px_-3px_rgba(139,92,246,0.1),0px_4px_6px_-4px_rgba(139,92,246,0.1)]"
      style={{ background: 'rgba(255, 255, 255, 0.002)' }}
    >
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
                className="w-full h-full object-cover rounded-[40px]"
              />
              <div className="absolute inset-0 bg-black/40 rounded-[40px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[40px]" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-12 px-8 md:px-12">
              <div className="max-w-4xl animate-fadeIn space-y-6">
                {slide.category && (
                  <span className="inline-block px-4 py-1.5 text-[10px] md:text-xs font-bold tracking-widest text-white uppercase bg-[#8B5CF6] rounded-full w-fit">
                    {slide.category}
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-100 font-medium text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-300" />
                    <span>
                      {new Date(slide.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {slide.startTime && ` • ${slide.startTime}`}
                    </span>
                  </div>
                  {slide.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-300" />
                      <span>{slide.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <Link
                      href={`/events/${buildSlug(slide.id, slide.title)}`}
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all bg-brand-600 rounded-full hover:bg-brand-700 shadow-lg shadow-brand-900/20"
                    >
                      View Event
                    </Link>
                    <Link
                      href="/events"
                      className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all bg-white/10 border border-white/20 rounded-full hover:bg-white/20 backdrop-blur-sm"
                    >
                      See All Events
                    </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden for design update */}
      {/* 
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
      */}

      {/* Dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 h-2 bg-[#8B5CF6]" : "w-2 h-2 bg-slate-400/50 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
