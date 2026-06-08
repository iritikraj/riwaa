/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { MapPin, LayoutGrid, Share2, ArrowRight, Bed, Bath, Maximize } from "lucide-react";
import { brokerageRegistry } from "@/app/config/brokerage";
import ListingsMap from "../_map";

const DUBAI_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Jumeirah Bay Island": { lat: 25.2104, lng: 55.2427 },
  "La Mer": { lat: 25.2285, lng: 55.2580 },
  "Zabeel 1": { lat: 25.2260, lng: 55.2950 },
};

export function AgentListings({ data, brokerName }: { data: any[], brokerName: string }) {
  const [view, setView] = useState<"grid" | "map">("grid");

  if (!data || data.length === 0) return null;

  const rawBrokerName = brokerName?.toLowerCase() || "";
  const matchedKey = Object.keys(brokerageRegistry).find(key => rawBrokerName.includes(key)) || "";
  const brokerInfo = matchedKey ? brokerageRegistry[matchedKey] : null;

  const baseDomain = brokerInfo?.website
    ? brokerInfo.website.replace(/\/$/, '')
    : "https://www.drivenproperties.com";

  const parsedListings = data.map(item => {
    const imageArray = item.images ? item.images.split('|') : [];
    const firstImage = imageArray[0] || "";

    // Safely grab coordinates. Add slight random offsets so multiple listings in same sub_community don't overlap exactly
    const baseCoords = item.sub_community && DUBAI_COORDINATES[item.sub_community]
      ? DUBAI_COORDINATES[item.sub_community]
      : { lat: 25.2048, lng: 55.2708 };

    const coords = {
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.005,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.005
    };

    let directUrl = baseDomain;
    if (item.reference_no) {
      directUrl = `${baseDomain}/${item.reference_no.toLowerCase()}`;
    } else if (item.friendly_url) {
      directUrl = `${baseDomain}/${item.friendly_url}`;
    }

    const isAskForPrice = item.price === "Ask For Price" || !item.price || item.price === 0;
    const formattedPrice = isAskForPrice
      ? "Price on Request"
      : `${item.currency || "AED"} ${Number(item.price).toLocaleString()}`;

    // Short price for map pin (e.g. "AED 17M")
    let mapPinPrice = formattedPrice;
    if (!isAskForPrice && item.price) {
      const priceNum = Number(item.price);
      if (priceNum >= 1000000) mapPinPrice = `${(priceNum / 1000000).toFixed(1)}M`;
      else if (priceNum >= 1000) mapPinPrice = `${(priceNum / 1000).toFixed(0)}K`;
    }

    return {
      title: `${item.unit_type} in ${item.building_name || item.sub_community}`,
      price: formattedPrice,
      mapPinPrice: mapPinPrice === "Price on Request" ? "POR" : `${item.currency || "AED"} ${mapPinPrice}`,
      reference: item.reference_no,
      beds: item.no_of_bedrooms,
      baths: item.no_of_bathrooms,
      sqft: item.built_up_area,
      imageUrl: firstImage,
      directUrl: directUrl,
      coords
    };
  });

  const handleWhatsAppShare = (listing: any) => {
    const text = `Take a look at this ${listing.title}.\nPrice: ${listing.price}\nRef: ${listing.reference}\n\nView details: ${listing.directUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="py-24 bg-[#111111] text-white font-jost">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-semibold tracking-[0.35em] uppercase text-[#b8924a] mb-4">Exclusive Portfolio</div>
            <h2 className="font-cormorant font-light text-4xl md:text-5xl tracking-tight">Active Listings</h2>
          </div>

          <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10">
            <button onClick={() => setView("grid")} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all ${view === "grid" ? "bg-[#b8924a] text-white" : "text-white/50 hover:text-white"}`}>
              <LayoutGrid size={14} /> Grid
            </button>
            <button onClick={() => setView("map")} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all ${view === "map" ? "bg-[#b8924a] text-white" : "text-white/50 hover:text-white"}`}>
              <MapPin size={14} /> Map
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parsedListings.map((listing, i) => (
              <div key={i} className="group border border-white/10 bg-white/5 rounded-2xl overflow-hidden hover:border-[#b8924a]/50 transition-colors flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest border border-white/10">
                      Ref: {listing.reference}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <p className="text-xl font-cormorant text-white">{listing.price}</p>
                    <button onClick={() => handleWhatsAppShare(listing)} className="p-2 bg-white/20 backdrop-blur hover:bg-[#25D366] text-white rounded-full transition-colors" title="Share via WhatsApp">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-sm font-medium text-white/90 mb-4 line-clamp-2">{listing.title}</h3>

                  <div className="flex items-center gap-4 text-white/50 text-xs mb-6">
                    {listing.beds !== "0" && <span className="flex items-center gap-1.5"><Bed size={14} /> {listing.beds}</span>}
                    {listing.baths !== "0" && <span className="flex items-center gap-1.5"><Bath size={14} /> {listing.baths}</span>}
                    {listing.sqft && <span className="flex items-center gap-1.5"><Maximize size={14} /> {listing.sqft} sqft</span>}
                  </div>

                  <a href={listing.directUrl} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-[10px] tracking-widest uppercase text-[#b8924a] transition-colors rounded-xl">
                    View on {brokerInfo?.name || "Website"} <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-[600px] relative rounded-2xl overflow-hidden border border-white/10">
            {/* --- NEW: INJECT LEAFLET MAP --- */}
            <ListingsMap parsedListings={parsedListings} />
          </div>
        )}
      </div>
    </section>
  );
}