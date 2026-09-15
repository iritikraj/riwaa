export interface DeveloperProject {
  id: string;
  title: string;
  community: string;
  propertyTypes: string[];
  bedroomOptions: string[];
  startingPriceAED: string;
  paymentPlan: string;
  handoverDate?: string;
  images: string[];
  coordinates?: { lat: number; lng: number };
}

export interface DeveloperConfig {
  name: string;
  tagline: string;
  profileText: string;
  logoUrl: string;
  heroBanner?: string;
  projects: DeveloperProject[];
}

export const DEVELOPERS_REGISTRY: Record<string, DeveloperConfig> = {
  "prestige-one": {
    name: "Prestige One Developments",
    tagline: "Crafting experiences where luxury intertwines with lifestyle.",
    profileText:
      "Prestige One Developments stands as a distinguished name in global real estate, redefining modern living through unique, design-based developments. Headquartered in Dubai, Prestige One focuses on crafting high-end residential and mixed-use projects that deliver immersive lifestyle experiences. With a deep understanding of community needs, their projects integrate visionary design, premium finishes, and curated amenities, focusing on prime locations and long-term value.",
    logoUrl: "https://prestigeone.ae/assets/images/v3/prestigeone_logo_oneline_white-hr.svg",
    heroBanner: "https://prestigeone.ae/assets/videos/prestige-one-intro.mp4",
    projects: [
      {
        id: "fauchon-residences",
        title: "FAUCHON Résidences by Prestige One",
        community: "Jumeirah Garden City, Dubai",
        propertyTypes: ["Apartments", "Studios"],
        bedroomOptions: ["Studio", "1 BR", "2 BR", "3 BR"],
        startingPriceAED: "1,990,000",
        paymentPlan: "20/40/40",
        images: [
          "https://prestigeone.ae/assets/project-featured-images/fauchon/fauchon-banner.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/fauchon/v3/gallery/06-exterior-private-pool.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/fauchon/v3/gallery/02-exterior-pool.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/fauchon/v3/01X644LUKSPICJUGHV3ND3QGIYDM4QQEMM.png",
          "https://prestigeone.ae/assets/images/v3/project-amenities/fauchon/v3/gallery/12-amenity-multipurpose-hall.webp",

        ],
        coordinates: { lat: 25.05257507583646, lng: 55.217104357318185 },
        handoverDate: "Completed"
      },
      {
        id: "sanctuary-residences",
        title: "Sanctuary Residences by Prestige One",
        community: "Meydan Horizon",
        propertyTypes: ["Apartments"],
        bedroomOptions: ["1 BR", "2 BR"],
        startingPriceAED: "625,000",
        paymentPlan: "20/45/35",
        images: [
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/Sanctuary%20Facade%20Angle%204.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/10.-Residential-Amenities---Cinema---Level-9.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/1.-Residential-Lobby.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/8.-Residential-Amenities---Gym---Level-9---Option-2.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/RoofTop-Floor-Sitting-Area.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/Rooftop-Pool.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/17.-3-Bedroom-Unit---Master-Bedroom.webp",
        ],
        coordinates: { lat: 25.03762777236335, lng: 55.221972783294284 },
        handoverDate: "Completed"
      },
      {
        id: "sanctuary-hive",
        title: "Sanctuary Hive by Prestige One",
        community: "Meydan Horizon",
        propertyTypes: ["Commercial Offices"],
        bedroomOptions: ["Offices"],
        startingPriceAED: "2,830,000",
        paymentPlan: "20/45/35",
        images: [
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary-Hive/gallery/sanctuary-hive-exterior-evening.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/Sanctuary/gallery/8.-Residential-Amenities---Gym---Level-9---Option-2.webp",
        ],
        coordinates: { lat: 25.03813320560613, lng: 55.22141150427357 },
        handoverDate: "Completed"
      },
      {
        id: "hilton-residences",
        title: "Hilton Residences by Prestige One",
        community: "Meydan Horizon",
        propertyTypes: ["Apartments"],
        bedroomOptions: ["1 BR", "2 BR", "3 BR"],
        startingPriceAED: "1,570,000",
        paymentPlan: "20/40/40",
        images: [
          "https://prestigeone.ae/assets/images/v3/project-amenities/hilton/gallery/1-hilton-1.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/hilton/gallery/2-Pool-View-%20Hilton%20Residences%20DMC.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/hilton/gallery/3-SUNSET-CINEMA-LAWN-%20Hilton%20Residences%20DMC.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/hilton/gallery/6-Facade%208-%20Hilton%20Residences%20DMC.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/hilton/gallery/9-Kids-Area-%20Hilton%20Residences%20DMC.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/hilton/gallery/11-Facade%203-%20Hilton%20Residences%20DMC.webp"
        ],
        coordinates: { lat: 25.18593384969912, lng: 55.28019540050471 },
        handoverDate: "Completed"
      },
      {
        id: "berkeley-square-north",
        title: "Berkeley Square North",
        community: "Jumeirah Village Circle",
        propertyTypes: ["Apartments", "Studios"],
        bedroomOptions: ["Studio", "1 BR", "2 BR", "3 BR"],
        startingPriceAED: "1,200,000",
        paymentPlan: "55/10/35",
        images: [
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/BS_DR_07.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/Berkeley%20Square%20Courtyard%20Pool%20Night.webp",
          "https://prestigeone.ae/assets/project-featured-images/berkeley/Berkeley-Square-North.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/Berkeley%20Square%20Bird's%20Eye%20Night%20View.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/Berkeley%20Square%20Pool%20Retreat%20Night.webp",
        ],
        coordinates: { lat: 25.09899774336412, lng: 55.17688344718675 },
        handoverDate: "Completed"
      },
      {
        id: "berkeley-square-south",
        title: "Berkeley Square South",
        community: "Jumeirah Village Circle",
        propertyTypes: ["Apartments", "Studios"],
        bedroomOptions: ["Studio", "1 BR", "2 BR", "3 BR"],
        startingPriceAED: "1,200,000",
        paymentPlan: "55/10/35",
        images: [
          "https://prestigeone.ae/assets/project-featured-images/berkeley/Berkeley-Square-South.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/BS_DR_07.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/Berkeley%20Square%20Courtyard%20Pool%20Night.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/Berkeley%20Square%20Bird's%20Eye%20Night%20View.webp",
          "https://prestigeone.ae/assets/images/v3/project-amenities/berkeley-square-north/gallery/Berkeley%20Square%20Pool%20Retreat%20Night.webp",
        ],
        coordinates: { lat: 25.07556280248074, lng: 55.140222174476094 },
        handoverDate: "Completed"
      }
    ]
  },
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