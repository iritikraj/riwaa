export interface DeveloperProject {
  id: string;
  title: string;
  community: string;
  propertyTypes: string[];
  bedroomOptions: string[];
  startingPriceAED: string;
  paymentPlan: string;
  handoverDate?: string; // NEW FIELD
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
        coordinates: { lat: 25.1972, lng: 55.3524 },
        handoverDate: "Q3 2029"
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
        coordinates: { lat: 25.0450, lng: 55.2890 },
        handoverDate: "Q1 2027"
      },
      {
        id: "address-zabeel",
        title: "Address Residences Zabeel",
        community: "Za'abeel, Dubai",
        propertyTypes: ["Apartments", "Penthouses"],
        bedroomOptions: ["1 BR", "2 BR", "3 BR", "Penthouse"],
        startingPriceAED: "1,800,000",
        paymentPlan: "80/20",
        images: [
          "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753086-00f18efc2294?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.2341, lng: 55.2954 },
        handoverDate: "Q4 2027"
      },
      {
        id: "elvira-hills",
        title: "Elvira",
        community: "Dubai Hills Estate",
        propertyTypes: ["Apartments", "Townhouses"],
        bedroomOptions: ["1 BR", "2 BR", "3 BR"],
        startingPriceAED: "1,450,000",
        paymentPlan: "80/20",
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.1090, lng: 55.2638 },
        handoverDate: "Q2 2028"
      },
      {
        id: "anya-ranches",
        title: "Anya",
        community: "Arabian Ranches III",
        propertyTypes: ["Townhouses"],
        bedroomOptions: ["3 BR", "4 BR"],
        startingPriceAED: "2,200,000",
        paymentPlan: "80/20",
        images: [
          "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.0600, lng: 55.3200 },
        handoverDate: "Q1 2029"
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
          "https://off-planproperties.ae/wp-content/uploads/2021/09/Marina-Sands-Project.jpg",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 24.5363, lng: 54.4332 },
        handoverDate: "Q3 2027"
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
        coordinates: { lat: 25.0750, lng: 55.3340 },
        handoverDate: "Q1 2029"
      },
      {
        id: "yas-golf-collection",
        title: "Yas Golf Collection",
        community: "Yas Island, Abu Dhabi",
        propertyTypes: ["Apartments"],
        bedroomOptions: ["Studio", "1 BR", "2 BR", "3 BR"],
        startingPriceAED: "740,000",
        paymentPlan: "40/60",
        images: [
          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 24.4697, lng: 54.6033 },
        handoverDate: "Q2 2027"
      },
      {
        id: "louvre-residences",
        title: "Louvre Abu Dhabi Residences",
        community: "Saadiyat Grove, Abu Dhabi",
        propertyTypes: ["Apartments"],
        bedroomOptions: ["1 BR", "2 BR", "3 BR"],
        startingPriceAED: "1,300,000",
        paymentPlan: "60/40",
        images: [
          "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 24.5323, lng: 54.4005 },
        handoverDate: "Q4 2030"
      },
      {
        id: "athlon-dubai",
        title: "Athlon by Aldar",
        community: "Dubailand",
        propertyTypes: ["Townhouses", "Villas"],
        bedroomOptions: ["3 BR", "4 BR", "5 BR", "6 BR"],
        startingPriceAED: "2,800,000",
        paymentPlan: "60/40",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ],
        coordinates: { lat: 25.0440, lng: 55.3000 },
        handoverDate: "Q1 2028"
      }
    ]
  }
};