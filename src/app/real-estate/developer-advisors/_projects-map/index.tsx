"use client";

import React, { useState } from 'react';
import { MapPin, Navigation, Building, Compass } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map so it only loads in the browser (avoids SSR errors)
const MapClient = dynamic(() => import('../_map-client'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-neutral-100"><p className="text-xs tracking-widest uppercase text-neutral-400 animate-pulse">Loading Map...</p></div>
});

interface Project {
  id: string;
  title: string;
  community: string;
  coordinates?: { lat: number; lng: number };
}

interface ProjectsMapProps {
  developerName: string;
  projects: Project[];
}

export function ProjectsMap({ developerName, projects }: ProjectsMapProps) {
  const [activeLocation, setActiveLocation] = useState(projects[0]?.id);

  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full bg-white pb-24 font-jost">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-150 md:h-150 bg-white rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-neutral-100 relative z-10">

          {/* LEFT: Interactive Locations List */}
          <div className="lg:col-span-4 hidden md:flex flex-col bg-neutral-50 rounded-2xl border border-neutral-100 p-6 overflow-y-auto no-scrollbar z-20">
            <div className="flex items-center gap-2 mb-6 text-neutral-900">
              <Compass size={18} className="text-[#b8924a]" />
              <h3 className="font-medium tracking-wide uppercase text-sm">Explore {developerName}</h3>
            </div>

            <div className="space-y-3 flex-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveLocation(project.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${activeLocation === project.id
                    ? 'bg-white border-[#b8924a]/30 shadow-md ring-1 ring-[#b8924a]/10'
                    : 'bg-transparent border-transparent hover:bg-neutral-100/50'
                    }`}
                >
                  <h4 className={`text-sm font-medium mb-1 ${activeLocation === project.id ? 'text-[#b8924a]' : 'text-neutral-900'}`}>
                    {project.title}
                  </h4>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <MapPin size={12} className={activeLocation === project.id ? 'text-[#b8924a]' : ''} />
                    {project.community}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200">
              <button className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm">
                <Navigation size={14} /> Get Directions
              </button>
            </div>
          </div>

          {/* RIGHT: The Map Area */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/60 group z-10">

            {/* Our new client-side multi-marker map */}
            <MapClient projects={projects} activeLocation={activeLocation} />

            {/* Map Overlay Stats UI */}
            <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-none z-30">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
                <Building size={14} className="text-[#b8924a]" />
                <span className="text-xs font-semibold text-neutral-800 uppercase tracking-widest">{projects.length} Sites</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}