/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { getUnsplashImage } from "@/lib/images";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const schema: any = {
  type: SchemaType.OBJECT,
  properties: {
    siteTitle: { type: SchemaType.STRING },
    theme: {
      type: SchemaType.STRING,
      description: "Porcelain White, Sage Green, or Champagne Taupe"
    },
    sections: {
      type: SchemaType.ARRAY,
      description: "A list of exactly 5-7 unique page sections following a luxury narrative flow.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: {
            type: SchemaType.STRING,
            description: "MUST BE EXACTLY ONE OF: Hero, Amenities, FloorPlans, Location, Gallery"
          },
          version: {
            type: SchemaType.STRING,
            description: "MUST BE EXACTLY ONE OF: VersionOne, VersionTwo, VersionThree, VersionFour"
          },
          heading: {
            type: SchemaType.STRING,
            description: "A highly engaging, luxury-focused headline for this section."
          },
          subtext: {
            type: SchemaType.STRING,
            description: "1-2 sentences of editorial-style copy describing the section."
          },
          galleryQueries: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
          },
          items: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "An array of 4-6 features. MANDATORY if type is Amenities."
          },
          imageQuery: { type: SchemaType.STRING }
        },
        // ADD THIS: Forces the AI to always generate text for every section
        required: ["type", "version", "heading", "subtext"]
      }
    }
  },
  required: ["siteTitle", "theme", "sections"]
};

export async function POST(req: Request) {
  try {
    // 1. Destructure prompt AND the new assets object
    const { prompt, assets } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest", // Use gemini-1.5-flash-latest if this exact string throws an error
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // 2. Build Context: Let the AI know what assets the user actually uploaded
    const assetContext = `
      USER ASSETS PROVIDED:
      - Has custom images: ${assets?.images?.length ? 'YES' : 'NO'}
      - Has floor plan: ${assets?.floorPlan ? 'YES' : 'NO'}
      - Has Google Maps link: ${assets?.maps ? 'YES' : 'NO'}
      - Has Video: ${assets?.video ? 'YES' : 'NO'}
      
      If the user has custom images, design the sections knowing we will inject their images into the Gallery and Hero.
    `;

    const systemPrompt = `
      You are an elite Art Director and Copywriter for a premium real estate platform.
      Your task is to design a high-end, single-page digital experience using a "Conscious Luxury" design language.

      CONTENT RULES & SECTION BLUEPRINTS (CRITICAL COMPLIANCE):
      1. BRANDING: Use the user's provided website name exactly. Do not alter spelling.
      2. LENGTH: Generate exactly 5 to 7 sections.
      3. COMPOSITION: You must include 1 'Hero', at least 1 'Amenities', exactly 1 'Location', and exactly 1 'Gallery'. If the user uploaded floor plans, you MUST include 1 'FloorPlans' section.
      
      4. STRICT FIELD REQUIREMENTS PER SECTION:
         - HERO: 
           * 'heading': A powerful, luxurious title (fallback to siteTitle).
           * 'subtext': 1-2 sentences of editorial vision.
           * 'items': Array of exactly 2-3 short keywords (e.g., ["Sustainability", "Premium Finish"]).
         - AMENITIES:
           * 'heading'
           * 'subtext': 1-2 sentences explaining the lifestyle.
           * 'items': Array of exactly 4-6 feature descriptions (e.g., ["Infinity Pool", "Smart Home Integration"]).
         - FLOORPLANS:
           * 'heading'
           * 'subtext': 1-2 sentences about architectural flow.
         - LOCATION:
           * 'heading'
           * 'subtext': 1-2 sentences about the neighborhood prestige.
         - GALLERY:
           * 'heading'
           * 'subtext': 1-2 sentences about craftsmanship.
           * 'galleryQueries': Array of 3-4 Unsplash search terms (e.g., ["luxury interior", "marble texture"]).

      DESIGN & TONE RULES:
      1. VERSION LIMITS (STRICT):
         - Hero: VersionOne, VersionTwo, VersionThree, VersionFour, or VersionFive (MUST use VersionFive if a video URL is provided).
         - Amenities: VersionOne, VersionTwo, VersionThree, or VersionFour.
         - FloorPlans: MUST be VersionOne.
         - Location: VersionOne or VersionTwo.
         - Gallery: VersionOne or VersionTwo.
      2. VARIETY: Never use the same version number for two consecutive sections.
      3. TONE: The copy must reflect "Mindful Modern Luxury." Focus on wellness, sustainability, intelligent design, and tranquility. Use words like: conscious, sanctuary, bespoke, mindful, crafted.
    `;

    // 3. Generate Content
    const result = await model.generateContent([
      systemPrompt,
      assetContext,
      `User Request: ${prompt || "A luxury property showcase"}`
    ]);

    const response = JSON.parse(result.response.text());

    // Distribute User Images intelligently
    let heroImages: string[] = [];
    let galleryImages: string[] = [];
    let locationImage: string | null = null;

    if (assets?.images?.length > 0) {
      if (assets.images.length >= 5) {
        // Lots of images! First 3 go to Hero Slider, 4th to Location, rest to Gallery
        heroImages = assets.images.slice(0, 3);
        locationImage = assets.images[3];
        galleryImages = assets.images.slice(4);
      } else if (assets.images.length >= 2) {
        // A few images. 1 for Hero, rest for Gallery
        heroImages = [assets.images[0]];
        galleryImages = assets.images.slice(1);
      } else {
        // Just 1 image. Use it for Hero.
        heroImages = [assets.images[0]];
      }
    }

    // 4. Image Enhancement (Fallback to Unsplash if user didn't upload images)
    const sectionsWithImages = await Promise.all(response.sections.map(async (section: any) => {
      // 1. Handle Gallery
      if (section.type === "Gallery") {
        const aiImages = section.galleryQueries
          ? await Promise.all(section.galleryQueries.map((q: string) => getUnsplashImage(q)))
          : [];
        return {
          ...section,
          galleryImages: galleryImages.length > 0 ? galleryImages : aiImages
        };
      }

      // 2. Handle Hero 
      if (section.type === "Hero") {
        const aiHeroImage = section.imageQuery ? await getUnsplashImage(section.imageQuery) : null;
        const finalImageUrls = heroImages.length > 0 ? heroImages : (aiHeroImage ? [aiHeroImage] : []);

        return {
          ...section,
          imageUrls: finalImageUrls, // Used by VersionFour (Slider)
          imageUrl: finalImageUrls[0] || null // Used by VersionOne, Two, Three
        };
      }

      // 3. Handle Location, Amenities, etc.
      let finalImageUrl = null;
      if (section.type === "Location" && locationImage) {
        finalImageUrl = locationImage;
      } else {
        finalImageUrl = section.imageQuery ? await getUnsplashImage(section.imageQuery) : null;
      }

      return { ...section, imageUrl: finalImageUrl };
    }));

    const finalData = {
      ...response,
      sections: sectionsWithImages,
      // Pass the global assets down to the frontend!
      globalAssets: {
        floorPlans: assets?.floorPlan || [],
        mapsLink: assets?.maps || null,
        brochure: assets?.brochure?.[0] || null,
        videoUrl: assets?.video || null,
      }
    };

    // 5. Save EVERYTHING to SQLite
    const [savedSite] = await db.insert(websites).values({
      prompt: prompt || "Visual Onboarding",
      siteTitle: response.siteTitle,
      theme: response.theme,
      // Store Base64 arrays as JSON strings
      userImages: assets?.images?.length ? JSON.stringify(assets.images) : null,
      floorPlan: assets?.floorPlan?.[0] || null, // Keeping for backward compatibility in DB schema
      mapsLink: assets?.maps || null,
      brochure: assets?.brochure?.[0] || null,
      videoUrl: assets?.video || null,
      content: finalData,
    }).returning();

    // Return the saved site so the frontend gets the DB ID too
    return NextResponse.json({ ...finalData, id: savedSite.id });

  } catch (error: any) {
    console.error("Agent Error Details:", error);
    return NextResponse.json({
      error: "Failed to generate site",
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
}