/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bed, MapPin } from 'lucide-react';

// 1. Premium SVG Location Marker
const premiumIcon = new L.DivIcon({
  className: 'bg-transparent border-none', // Removes default Leaflet white square
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#b8924a" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
      <div style="position: absolute; top: 12px; width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40], // Ensures the popup opens above the pin, not on top of it
});

// 2. Camera Controller
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, map]);
  return null;
}

export default function MapClient({ projects, activeLocation }: { projects: any[], activeLocation: string }) {
  const defaultCenter: [number, number] = [25.2048, 55.2708];

  const activeProject = projects.find(p => p.id === activeLocation);
  const currentCenter: [number, number] = activeProject?.coordinates
    ? [activeProject.coordinates.lat, activeProject.coordinates.lng]
    : defaultCenter;

  return (
    <div className="w-full h-full contrast-[1.05] opacity-95 relative z-0">

      {/* 3. Global Style Override for Premium Leaflet Popups */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          overflow: hidden;
          border-radius: 20px !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 280px !important;
        }
        .leaflet-popup-tip {
          background: white;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          padding: 8px 8px 0 0;
          z-index: 10;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #f3f4f6;
          background: transparent;
        }
      `}} />

      <MapContainer
        center={currentCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {projects.map((project) => {
          if (!project.coordinates) return null;

          // Safely grab the first image, or use a luxury fallback
          const heroImage = Array.isArray(project.images) && project.images.length > 0
            ? project.images[0]
            : project.heroImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";

          return (
            <Marker
              key={project.id}
              position={[project.coordinates.lat, project.coordinates.lng]}
              icon={premiumIcon}
            >
              <Popup className="font-jost">
                {/* Custom Premium Card Inside Popup */}
                <div className="flex flex-col w-full bg-white">

                  {/* Image Header */}
                  <div className="h-36 w-full relative bg-neutral-100">
                    <img src={heroImage} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {/* Price Overlay */}
                    {project.startingPriceAED && (
                      <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                        <span className="block text-[8px] uppercase tracking-widest text-neutral-500 font-semibold mb-0.5 leading-none">Starting From</span>
                        <span className="block text-xs font-bold text-neutral-900 leading-none">AED {project.startingPriceAED}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h4 className="text-base font-semibold text-neutral-900 mb-1 leading-tight">{project.title}</h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 mb-4">
                      <MapPin size={10} className="text-[#b8924a]" />
                      {project.community}
                    </p>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium text-neutral-600">
                        <Bed size={12} className="text-[#b8924a]" />
                        {project.bedroomOptions?.[0] ? `${project.bedroomOptions[0]} Beds` : 'Multiple Configs'}
                      </div>

                      <button className="text-[10px] text-[#b8924a] font-bold uppercase tracking-widest hover:text-neutral-900 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>

                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController center={currentCenter} />
      </MapContainer>
    </div>
  );
}