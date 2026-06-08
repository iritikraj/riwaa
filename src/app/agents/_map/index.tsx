/* eslint-disable @typescript-eslint/no-explicit-any */
// app/agents/_listings-map.tsx
"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";
import { useState } from "react";

// Create custom HTML marker for Leaflet
const createGoldPin = (price: string) => {
  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="background-color: #1A1A1A; color: #b8924a; font-size: 10px; font-weight: bold; padding: 6px 12px; border-radius: 6px; box-shadow: 0 6px 12px rgba(0,0,0,0.4); white-space: nowrap; border: 1px solid #b8924a;">
          ${price}
        </div>
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #b8924a;"></div>
      </div>
    `,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
    popupAnchor: [0, -40]
  });
};

export default function ListingsMap({ parsedListings }: { parsedListings: any[] }) {
  const [selectedPin, setSelectedPin] = useState<any>(null);

  // Dubai center coordinates
  const centerPosition: [number, number] = [25.21, 55.25];

  return (
    <>
      <style>{`
        /* Strip Leaflet's ugly default white popup styles */
        .leaflet-popup-content-wrapper { background: transparent !important; padding: 0 !important; box-shadow: none !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button { display: none !important; }
      `}</style>

      <MapContainer
        center={centerPosition}
        zoom={12}
        style={{ width: "100%", height: "100%", background: "#e5e3df" }}
        zoomControl={false}
      >
        {/* Colorful Google Maps Base Layer */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Riwaa"
        />

        {/* 1. RENDER ONLY THE MARKERS HERE */}
        {parsedListings.map((listing, i) => (
          <Marker
            key={i}
            position={[listing.coords.lat, listing.coords.lng]}
            icon={createGoldPin(listing.mapPinPrice)}
            eventHandlers={{
              click: () => {
                setSelectedPin(listing);
              },
            }}
          />
        ))}

        {/* 2. RENDER THE DETACHED POPUP HERE */}
        {selectedPin && (
          <Popup
            position={[selectedPin.coords.lat, selectedPin.coords.lng]}
            offset={[0, -40]} // Prevents the card from overlapping the map pin
            onClose={() => setSelectedPin(null)}
          >
            <div className="w-64 bg-[#111111] border border-[#b8924a]/30 rounded-xl overflow-hidden shadow-2xl font-jost">
              <div className="relative h-32">
                <img src={selectedPin.imageUrl} className="w-full h-full object-cover" alt="Property" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors backdrop-blur-md cursor-pointer z-[9999]"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-2 text-left">
                <p className="text-[#b8924a] text-lg font-cormorant leading-none m-0">{selectedPin.price}</p>
                <p className="text-white text-xs font-light line-clamp-2 leading-relaxed m-0">{selectedPin.title}</p>
                <a
                  href={selectedPin.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block w-full py-2 bg-white/10 hover:bg-[#b8924a] hover:text-black text-center text-[9px] font-semibold uppercase tracking-widest text-white transition-colors rounded no-underline"
                >
                  View Details
                </a>
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>
    </>
  );
}