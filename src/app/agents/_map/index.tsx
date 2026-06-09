/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Share2, Bed, Bath, Maximize } from "lucide-react";
import { useState } from "react";

const createGoldPin = (price: string) => {
  return L.divIcon({
    className: "custom-pin",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div style="
          background-color:#1A1A1A;
          color:#b8924a;
          font-size:10px;
          font-weight:bold;
          padding:6px 12px;
          border-radius:6px;
          box-shadow:0 6px 12px rgba(0,0,0,0.4);
          white-space:nowrap;
          border:1px solid #b8924a;
        ">
          ${price}
        </div>
        <div style="
          width:0;
          height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:8px solid #b8924a;
        "></div>
      </div>
    `,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
    popupAnchor: [0, -40],
  });
};

export default function ListingsMap({
  parsedListings,
}: {
  parsedListings: any[];
}) {
  const [selectedPin, setSelectedPin] = useState<any>(null);

  const centerPosition: [number, number] = [25.21, 55.25];

  const handleWhatsAppShare = (e: React.MouseEvent, listing: any) => {
    e.stopPropagation();
    const text = `Take a look at this ${listing.title}.\nPrice: ${listing.price}\nRef: ${listing.reference}\n\nView details: ${listing.directUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;

          p {
            margin: 0 !important;
          }
        }

        .leaflet-popup-tip-container {
          display: none !important;
        }

        .leaflet-popup-close-button {
          display: none !important;
        }
      `}</style>

      <MapContainer
        center={centerPosition}
        zoom={12}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
          background: "#e5e3df",
        }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Riwaa"
        />

        {parsedListings.map((listing, i) => (
          <Marker
            key={i}
            position={[listing.coords.lat, listing.coords.lng]}
            icon={createGoldPin(listing.mapPinPrice)}
            eventHandlers={{
              click: () => setSelectedPin(listing),
            }}
          />
        ))}

        {selectedPin && (
          <Popup
            position={[
              selectedPin.coords.lat,
              selectedPin.coords.lng,
            ]}
            offset={[0, -40]}
            closeButton={false}
            closeOnClick={false}
            eventHandlers={{
              remove: () => setSelectedPin(null),
            }}
          >
            <div className="w-64 overflow-hidden rounded-xl border border-[#b8924a]/30 bg-[#111111] shadow-2xl font-jost">
              <div className="relative h-32">
                <img
                  src={selectedPin.imageUrl}
                  alt="Property"
                  className="h-full w-full object-cover"
                />

                {/* Top Right: Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(null);
                  }}
                  className="absolute top-2 right-2 z-50 cursor-pointer rounded-full bg-black/60 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-black"
                >
                  <X size={14} />
                </button>

                {/* Bottom Left: Reference Badge */}
                <div className="absolute bottom-2 left-2 z-50">
                  <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] uppercase tracking-widest border border-white/10 text-white">
                    Ref: {selectedPin.reference}
                  </span>
                </div>

                {/* Bottom Right: WhatsApp Share Button */}
                <button
                  onClick={(e) => handleWhatsAppShare(e, selectedPin)}
                  className="absolute bottom-2 right-2 z-50 p-1.5 bg-black/60 backdrop-blur-md hover:bg-[#25D366] text-white rounded-full transition-colors cursor-pointer"
                  title="Share via WhatsApp"
                >
                  <Share2 size={12} />
                </button>
              </div>

              <div className="flex flex-col gap-3 p-4 text-left">
                <p className="m-0 font-cormorant text-xl leading-none text-[#b8924a]">
                  {selectedPin.price}
                </p>

                <p className="m-0 line-clamp-2 text-xs font-light leading-relaxed text-white my-0">
                  {selectedPin.title}
                </p>

                {/* Property Specs (Beds, Baths, Sqft) */}
                <div className="flex items-center gap-3 text-white/50 text-[10px] mt-1 border-y border-white/10 py-2">
                  {selectedPin.beds !== "0" && <span className="flex items-center gap-1"><Bed size={12} /> {selectedPin.beds}</span>}
                  {selectedPin.baths !== "0" && <span className="flex items-center gap-1"><Bath size={12} /> {selectedPin.baths}</span>}
                  {selectedPin.sqft && <span className="flex items-center gap-1"><Maximize size={12} /> {selectedPin.sqft}</span>}
                </div>

                <a
                  href={selectedPin.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block w-full py-2 bg-white/10 hover:bg-[#b8924a] hover:text-black text-center text-[9px] font-semibold uppercase tracking-widest text-white transition-colors rounded no-underline"
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