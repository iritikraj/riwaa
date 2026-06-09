// app/config/brokerage.ts

export const brokerageRegistry: Record<string, any> = {
  driven: {
    name: "Driven Properties",
    website: "https://www.drivenproperties.com/",
    searchTemplate: "https://www.drivenproperties.com/dubai-properties?reference={ref}",

    stats: [
      { value: "1000+", label: "Team Members" },
      { value: "500+", label: "Licensed Agents" },
      { value: "25+", label: "Languages Spoken" },
      { value: "40+", label: "Nationalities" }
    ],

    ceo: {
      name: "Abdullah Alajaji",
      title: "Founder and CEO",
      message: "Driven Properties was established to address critical gaps in Dubai’s real estate market. We focus on advanced technology, and data-driven decision-making to ensure a seamless, efficient real estate experience for our clients. As an exclusive UAE member of Forbes Global Properties, Driven Properties is part of a select group of the world’s most elite brokerages."
    },

    // --- NEW SECTIONS ---
    commitments: [
      "Bringing the Dubai Dream to Indian investors.",
      "Providing expert guidance with data-driven market insights.",
      "Offering investment opportunities with high ROI potential and exclusive access to top projects."
    ],

    awards: "Driven Properties has been recognized as an industry leader, receiving numerous awards from major developers such as Emaar, Damac, Sobha, and Nakheel, acknowledging our excellence in sales performance, customer service, and market leadership. Our accolades serve as a testament to our commitment to delivering exceptional real estate solutions.",

    imageries: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", // Sleek office hallway
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop", // Premium meeting room
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop", // Desk/Architecture
    ],

    offices: {
      uae: [
        { name: "Head Office", location: "Emaar Square, Downtown Dubai" },
        { name: "Business Bay", location: "Bay Square, Dubai" },
        { name: "Dubai Hills Estate", location: "Acacia 1 Tower C" },
        { name: "Abu Dhabi", location: "Shining Towers, Al Khalidiyah" }
      ],
      international: [
        { name: "Spain", location: "Madrid" },
        { name: "China", location: "Shenzhen" },
        { name: "Saudi Arabia", location: "Riyadh" },
        { name: "India", location: "Hyderabad" },
        { name: "Egypt", location: "Shaikh Zayed City" }
      ]
    }
  },
};