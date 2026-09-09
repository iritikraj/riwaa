export interface DeveloperProject {
  id: string;
  title: string;
  community: string;
  propertyTypes: string[];       // e.g., ["Apartments", "Villas", "Townhouses"]
  bedroomOptions: string[];      // e.g., ["1 BR", "2 BR", "3 BR"]
  startingPriceAED: string;      // e.g., "1,850,000"
  paymentPlan: string;           // e.g., "80/20"
  images: string[];
  coordinates?: { lat: number; lng: number };
}

export interface DeveloperConfig {
  name: string;
  tagline: string;
  profileText: string;
  logoUrl: string;
  projects: DeveloperProject[];
}

export const DEVELOPERS_REGISTRY: Record<string, DeveloperConfig> = {
  emaar: {
    name: "Emaar Properties",
    tagline: "Pioneering master-planned communities across the UAE.",
    profileText:
      "Emaar Properties is one of the world's most valuable real estate development companies. Known for global icons including the Burj Khalifa and Dubai Mall, Emaar consistently delivers world-class communities focused on architectural excellence, prime locations, and sustained capital appreciation.",
    logoUrl: "/images/developers/emaar-logo.svg",
    projects: [
      {
        id: "creek-waters",
        title: "Creek Waters",
        community: "Dubai Creek Harbour",
        propertyTypes: ["Apartments", "Townhouses"],
        bedroomOptions: ["1 BR", "2 BR", "3 BR", "4 BR"],
        startingPriceAED: "1,900,000",
        paymentPlan: "90/10 On Handover",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.1972, lng: 55.3524 }
      },
      {
        id: "oasis-palms",
        title: "The Oasis",
        community: "Dubailand",
        propertyTypes: ["Villas", "Mansions"],
        bedroomOptions: ["4 BR", "5 BR", "6 BR"],
        startingPriceAED: "8,500,000",
        paymentPlan: "85/15",
        images: [
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.0450, lng: 55.2890 }
      }
    ]
  },
  aldar: {
    name: "Aldar Properties",
    tagline: "The leading real estate developer and manager in Abu Dhabi.",
    profileText:
      "Aldar Properties shapes vibrant communities across Abu Dhabi and Dubai. Renowned for landmark destinations on Yas Island, Saadiyat Cultural District, and Al Reem Island, Aldar represents the benchmark of luxury coastal and urban living in the UAE.",
    logoUrl: "/images/developers/aldar-logo.svg",
    projects: [
      {
        id: "nobu-residences",
        title: "Nobu Residences",
        community: "Saadiyat Island, Abu Dhabi",
        propertyTypes: ["Apartments", "Penthouses", "Villas"],
        bedroomOptions: ["1 BR", "2 BR", "3 BR", "Penthouse"],
        startingPriceAED: "7,000,000",
        paymentPlan: "65/35",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 24.5363, lng: 54.4332 }
      },
      {
        id: "haven-dubai",
        title: "Haven by Aldar",
        community: "Dubailand",
        propertyTypes: ["Townhouses", "Villas"],
        bedroomOptions: ["3 BR", "4 BR", "5 BR"],
        startingPriceAED: "2,550,000",
        paymentPlan: "70/30",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.0750, lng: 55.3340 }
      }
    ]
  }
};