/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { MapPin, Bed, CreditCard, ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  community: string;
  propertyTypes: string[];
  bedroomOptions: string[];
  startingPriceAED: string;
  paymentPlan: string;
  images: string[]; // Updated to support multiple images
}

interface ProjectsGridProps {
  developerName: string;
  projects: Project[];
}

export function ProjectsGrid({ developerName, projects }: ProjectsGridProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full bg-white py-24 font-jost">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#b8924a] mb-3 block">
              Curated Portfolio
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 tracking-wide">
              Featured <span className="font-medium text-[#b8924a]">Projects</span>
            </h2>
          </div>
          <p className="text-sm text-neutral-500 font-light max-w-sm leading-relaxed">
            Explore the latest off-plan and ready-to-move investment opportunities directly from {developerName}.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}

// Sub-component for individual project cards with the Carousel
function ProjectCard({ project }: { project: Project }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Fallback if the data comes in with the old 'heroImage' string instead of an array
  const images = Array.isArray(project.images)
    ? project.images
    : [(project as any).heroImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"];

  const nextImage = () => setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="group bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col">

      {/* Image Carousel Area */}
      <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
        <img
          src={images[currentImageIdx]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Carousel Controls (Only show if multiple images exist) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Starting Price Badge Overlay */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20">
          <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-0.5">Starting From</span>
          <span className="block text-sm font-bold text-neutral-900">AED {project.startingPriceAED}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-medium text-neutral-900 mb-2">{project.title}</h3>
          <p className="text-xs text-neutral-500 flex items-center gap-1.5">
            <MapPin size={12} className="text-[#b8924a]" />
            {project.community}
          </p>
        </div>

        {/* Tags (Villas, Apartments, etc.) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.propertyTypes.map((type, idx) => (
            <span key={idx} className="px-3 py-1 bg-neutral-50 border border-neutral-100 text-neutral-600 text-[10px] uppercase tracking-wider rounded-lg font-medium flex items-center gap-1.5">
              <Home size={10} className="text-[#b8924a] opacity-70" />
              {type}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-4 pt-6 border-t border-neutral-100">
          {/* Details Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#b8924a]/10 flex items-center justify-center">
                <Bed size={14} className="text-[#b8924a]" />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Bedrooms</span>
                <span className="block text-xs font-medium text-neutral-900">{project.bedroomOptions.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <CreditCard size={14} className="text-emerald-600" />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-neutral-400">Payment Plan</span>
                <span className="block text-xs font-medium text-neutral-900">{project.paymentPlan}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}