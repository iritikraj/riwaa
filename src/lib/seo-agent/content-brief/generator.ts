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
      competitorCount: competitorData.length
    });

    // =========================================================================
    // STEP 1: THE ARCHITECT (URL Slug, Meta Title, Meta Description)
    // =========================================================================
    briefLogger.debug({ event: 'architect_agent_started' });

    const architectPrompt = `
      You are an elite Technical SEO Architect.
      TASK: Generate an optimized URL Slug, Meta Title, and Meta Description.
      
      INPUTS:
      - Target Topic: "${topic}"
      - Target URL Pattern: "${urlPattern}"
      - Associated Entities to Target: ${entityContext}

      RULES:
      1. URL Slug: Construct a clean, SEO-friendly slug matching the exact structure of "${urlPattern}". Replace dynamic tokens like {dynamic-url} appropriately.
      2. Meta Title: Must be catchy, under 60 characters, and include the primary target topic.
      3. Meta Description: Must be persuasive, user-intent aligned, integrate core entities, and be between 135-155 characters.

      EXPECTED JSON SCHEMA:
      {
        "url_slug": "String",
        "meta_title": "String",
        "meta_description": "String"
      }
    `;

    const architectResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: architectPrompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      },
    });

    if (!architectResponse.text) throw new Error("Architect Agent returned empty response.");
    const architectOutput = JSON.parse(architectResponse.text);

    briefLogger.info({ event: 'architect_agent_completed', slug: architectOutput.url_slug });

    // =========================================================================
    // STEP 2: THE STRATEGIST (Competitor & Gap Analysis)
    // =========================================================================
    const isAreaGuide = pageTypeRules.requires_internal_blueprint;
    briefLogger.debug({ event: 'strategist_agent_started', isAreaGuide });

    let structuralContext = '';
    if (isAreaGuide && internalBlueprintData) {
      structuralContext = `
        STRATEGY MODE: AREA GUIDE (BLUEPRINT-DRIVEN)
        Client Internal Blueprint Headings:
        ${JSON.stringify(internalBlueprintData.headings, null, 2)}

        INSTRUCTIONS: Preserve the client's base blueprint structure. Review competitor headings to find gaps, and integrate the Semantic Entities into the structure organically.
      `;
    } else {
      structuralContext = `
        STRATEGY MODE: BLOG POST (TOPIC-DRIVEN)
        INSTRUCTIONS: Analyze all competitor skeletons below. Build a unique, comprehensive heading structure (H2s, H3s) from scratch that outperforms competitors and natively covers the provided Semantic Entities.
      `;
    }

    const strategistPrompt = `
      You are a Senior SEO Content Strategist.
      TASK: Perform competitive gap analysis and define the strategic heading flow.

      TOPIC: "${topic}"
      PAGE TYPE: "${pageType}"
      SYSTEM CONTEXT: ${pageTypeRules.system_context}
      
      ${structuralContext}

      COMPETITOR HEADING SKELETONS:
      ${JSON.stringify(competitorData, null, 2)}

      PAGE TYPE RULES:
      ${JSON.stringify(pageTypeRules.rules_payload, null, 2)}

      SEMANTIC ENTITIES TO COVER:
      ${entityContext}

      EXPECTED JSON SCHEMA:
      {
        "strategic_angle": "String explaining how this brief positions content to win search intent",
        "gaps_identified": ["Array of strings describing missed competitor opportunities"],
        "recommended_heading_flow": [
          {
            "tag": "h2",
            "heading": "String",
            "purpose": "String explaining coverage requirements",
            "subheadings": [
              {
                "tag": "h3",
                "heading": "String",
                "purpose": "String"
              }
            ]
          }
        ],
        "faq_questions": ["Array of FAQ questions that match user search intent"]
      }
    `;

    const strategistResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: strategistPrompt,
      config: {
        temperature: 0.0,
        responseMimeType: 'application/json'
      },
    });

    if (!strategistResponse.text) throw new Error("Strategist Agent returned empty response.");
    const strategistOutput = JSON.parse(strategistResponse.text);

    briefLogger.info({
      event: 'strategist_agent_completed',
      sectionsCount: strategistOutput.recommended_heading_flow?.length || 0
    });

    // =========================================================================
    // STEP 3: THE WRITER / SYNTHESIZER (Final Structured Brief Construction)
    // =========================================================================
    briefLogger.debug({ event: 'synthesizer_agent_started' });

    const writerPrompt = `
      You are a Master Content Brief Creator.
      TASK: Synthesize the outputs from the SEO Architect and Strategist into a publication-ready Content Strategy Brief.

      METADATA (From Architect):
      ${JSON.stringify(architectOutput, null, 2)}

      STRATEGY & HEADING FLOW (From Strategist):
      ${JSON.stringify(strategistOutput, null, 2)}

      PAGE TYPE RULES & CONSTRAINTS:
      ${JSON.stringify(pageTypeRules.rules_payload, null, 2)}

      SEMANTIC ENTITIES TO INTEGRATE:
      ${entityContext}

      INSTRUCTIONS:
      1. Define a compelling, high-converting H1 tag.
      2. Build out the complete nested heading hierarchy.
      3. For EVERY heading (H2, H3, H4):
         - Provide clear, actionable "intent_direction" giving copywriters specific instructions on what data, tone, local insights, or amenities to highlight.
         - Assign relevant Semantic Entities (from the provided list) that MUST be naturally mentioned in that section to build topical authority.
      4. Structure the FAQ section with clear "answer_direction" guidance if FAQs are enabled in the rules.

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
            "intent_direction": "Detailed direction for the writer",
            "assigned_entities": ["Array of semantic entities to include in this section"],
            "children": [
              {
                "tag": "h3",
                "heading": "String",
                "intent_direction": "Detailed direction for the writer",
                "assigned_entities": ["Array of semantic entities to include"]
              }
            ]
          }
        ],
        "faqs": [
          {
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