// src/lib/seo-agent/content-brief/generator.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai';
import { logger as defaultLogger } from '@/lib/logs/logger';
import type { Logger } from 'pino';

export async function generateContentBrief(
  topic: string,
  urlPattern: string,
  pageTypeRules: any,
  entityData: any[],
  paaQuestions: string[],
  competitorTopicFrequencies: string[],
  competitorData: any[],
  internalBlueprintData: any | null,
  parentLogger: Logger = defaultLogger
) {
  const startTime = Date.now();
  const pageType = pageTypeRules.name || pageTypeRules.page_type_id;

  // Create a localized child logger for this specific brief generation
  const briefLogger = parentLogger.child({
    module: 'content_brief_generator',
    topic,
    pageType
  });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const entityContext = entityData.map(e => `${e.name} (Type: ${e.types?.join(', ') || 'Concept'})`).join(', ');

  try {
    briefLogger.info({
      event: 'brief_generation_started',
      entityCount: entityData.length,
      competitorCount: competitorData.length,
      paaCount: paaQuestions.length,
      matrixCount: competitorTopicFrequencies.length
    });

    // STEP 1: THE ARCHITECT (URL Slug, Meta Title, Meta Description)
    briefLogger.debug({ event: 'architect_agent_started' });

    const architectPrompt = `
      You are an elite Technical SEO Architect.
      TASK: Generate an optimized URL Slug, Meta Title, and Meta Description.
      
      INPUTS:
      - Target Topic: "${topic}"
      - Target URL Pattern: "${urlPattern}"
      - Associated Entities to Target: ${entityContext}

      RULES:
      1. URL Slug: Construct a clean, SEO-friendly slug matching the structure of "${urlPattern}". Replace dynamic tokens cleanly.
      2. Meta Title: Keep concise, catchy, under 60 characters.
      3. Meta Description: Persuasive, user-intent aligned, max 155 characters.

      EXPECTED JSON SCHEMA:
      {
        "url_slug": "String",
        "meta_title": "String",
        "meta_description": "String"
      }
    `;

    const architectResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: architectPrompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      },
    });

    if (!architectResponse.text) throw new Error("Architect Agent returned empty response.");
    const architectOutput = JSON.parse(architectResponse.text);

    briefLogger.info({ event: 'architect_agent_completed', slug: architectOutput.url_slug });

    // STEP 2: THE STRATEGIST (Adaptive Intelligence & SERP Gap Analysis)
    const isAreaGuide = pageTypeRules.requires_internal_blueprint;
    briefLogger.debug({ event: 'strategist_agent_started', isAreaGuide });

    let structuralContext = '';
    if (isAreaGuide && internalBlueprintData) {
      structuralContext = `
        STRATEGY MODE: ADAPTIVE AREA GUIDE
        Client Base Internal Blueprint Headings:
        ${JSON.stringify(internalBlueprintData.headings, null, 2)}

        BLUEPRINT ADAPTATION RULES:
        1. Use the client blueprint as a foundation, not a strict cage.
        2. PRUNING GUARDRAILS: Do NOT remove standard amenity or lifestyle sections (e.g., Healthcare, Schools, Supermarkets, Transport) just because the target area lacks them. If a specific amenity does not exist inside the target area, KEEP the heading but instruct the writer to mention the nearest available options in neighboring communities.
        3. REMOVAL FREEDOM: You have complete authority to REMOVE blueprint sections that do not logically apply to this specific target location.
        4. REORGANIZATION: Reorganize sections for better user flow and logical grouping if necessary.
        5. DE-DUPLICATION: Merge overlapping topics (e.g., if the blueprint has "Clinics" but competitors use "Healthcare", merge them intelligently).
      `;
    } else {
      structuralContext = `
        STRATEGY MODE: BLOG POST (TOPIC-DRIVEN)
        INSTRUCTIONS: Build a unique, comprehensive heading structure from scratch that outperforms competitors using the provided data proof points.
      `;
    }

    const strategistPrompt = `
      You are a Senior SEO Content Strategist.
      TASK: Define an adaptive, highly-intelligent heading flow and FAQ list.

      TOPIC: "${topic}"
      PAGE TYPE: "${pageType}"
      
      ${structuralContext}

      EMPIRICAL DATA PROOF:
      1. COMPETITOR TOPIC FREQUENCIES (All topics found in top-ranking URLs, sorted by popularity):
         ${JSON.stringify(competitorTopicFrequencies, null, 2)}
      
      2. "PEOPLE ALSO ASK" (PAA) REAL USER INTENT:
         ${JSON.stringify(paaQuestions, null, 2)}

      3. SEMANTIC ENTITIES TO COVER:
         ${entityContext}

      INTELLIGENT GAP ANALYSIS & GROUNDING RULES:
      1. COMPETITOR GAPS: You MUST add new H2/H3 sections if competitors cover critical attributes missing from the base blueprint (e.g., if a competitor found a highly valuable unique angle).
      2. LOCATION-SPECIFIC AUTONOMY: Use your native Google Search tool to research the specific attributes of "${topic}". If you discover major location features (e.g., Sea-facing resorts, major landmarks, specific free-zones) that users care about, you MUST generate new H2/H3 sections for them.
      3. FAQs: Build the "faqs" array strictly using the "PEOPLE ALSO ASK" questions. Format each as an H4 object and provide a 1-sentence "answer_direction".

      OUTPUT FORMAT:
      You must return ONLY a raw JSON object. Do not wrap your response in markdown code blocks (e.g., do not use json).

      EXPECTED JSON SCHEMA:
      {
        "strategic_angle": "String explaining how this outline adapts to local search intent",
        "gaps_identified": ["Array of strings describing valuable topics added that were missing from the base blueprint"],
        "recommended_heading_flow": [
          {
            "tag": "h2",
            "heading": "String",
            "data_justification": "String explaining WHY this section was included (e.g., Competitor overlap, Google Search trend, or Blueprint)",
            "subheadings": [
              {
                "tag": "h3",
                "heading": "String"
              }
            ]
          }
        ],
        "faqs": [
          {
            "tag": "h4",
            "question": "String",
            "answer_direction": "Brief outline of what the answer should convey"
          }
        ]
      }
    `;

    const strategistResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: strategistPrompt,
      config: {
        temperature: 0.2, // Slightly higher temp allows for more intelligent adaptability
        // responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }] // Native Google Search Grounding enabled
      },
    });

    if (!strategistResponse.text) throw new Error("Strategist Agent returned empty response.");
    // const strategistOutput = JSON.parse(strategistResponse.text);
    const rawStrategistText = strategistResponse.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const strategistOutput = JSON.parse(rawStrategistText);

    briefLogger.info({
      event: 'strategist_agent_completed',
      sectionsCount: strategistOutput.recommended_heading_flow?.length || 0
    });

    // STEP 3: THE WRITER / SYNTHESIZER
    briefLogger.debug({ event: 'synthesizer_agent_started' });

    const writerPrompt = `
      You are a Master Content Brief Creator.
      TASK: Synthesize the outputs from the Technical Architect and Strategist into a publication-ready Content Strategy Brief.

      METADATA:
      ${JSON.stringify(architectOutput, null, 2)}

      STRATEGY & HEADING FLOW:
      ${JSON.stringify(strategistOutput, null, 2)}

      SEMANTIC ENTITIES:
      ${entityContext}

      RULES FOR INTENT DIRECTIONS:
      1. DO NOT write bloated explanatory paragraphs for standard, self-explanatory headings (e.g., "Malls", "Clinics", "FAQs"). Leave "intent_direction" NULL.
      2. ONLY provide a concise 1-sentence "intent_direction" if a section is a NEW addition, unique local attribute, or requires specific data/tone.
      3. For the FAQ section, retain the exact structured "faqs" array provided by the Strategist.
      4. Do not assign the primary target topic (e.g., the name of the area itself) as an assigned entity to every single heading. Only assign secondary entities (like specific developers, landmarks, or concepts) if they are provided. If no secondary entities fit the heading, leave the array empty.

      EXPECTED JSON SCHEMA:
      {
        "url_slug": "${architectOutput.url_slug}",
        "meta_title": "${architectOutput.meta_title}",
        "meta_description": "${architectOutput.meta_description}",
        "h1": "String",
        "strategic_summary": "${strategistOutput.strategic_angle}",
        "architecture": [
          {
            "tag": "h2",
            "heading": "String",
            "intent_direction": "String or null",
            "assigned_entities": ["Array of relevant semantic entities or empty"],
            "children": [
              {
                "tag": "h3",
                "heading": "String",
                "intent_direction": "String or null",
                "assigned_entities": ["Array of relevant semantic entities or empty"]
              }
            ]
          }
        ],
        "faqs": [
          {
            "tag": "h4",
            "question": "String",
            "answer_direction": "Brief outline of what the answer should convey"
          }
        ]
      }
    `;

    const writerResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: writerPrompt,
      config: {
        temperature: 0.0,
        responseMimeType: 'application/json'
      },
    });

    if (!writerResponse.text) throw new Error("Writer Agent returned empty response.");
    const finalBriefJson = JSON.parse(writerResponse.text);

    briefLogger.info({
      event: 'brief_generation_completed',
      durationMs: Date.now() - startTime
    });

    return finalBriefJson;

  } catch (error: any) {
    briefLogger.error({
      err: error,
      event: 'brief_generation_failed',
      durationMs: Date.now() - startTime
    }, `Failed to generate brief for topic: ${topic}`);

    throw error;
  }
}