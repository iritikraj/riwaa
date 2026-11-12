// riwaa/src/lib/meta-agent/ai-agent.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI, Type } from '@google/genai';

export class AiAgent {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // campaign setup
  async draftCampaignStructure(brief: Record<string, any>): Promise<any> {
    const prompt = `You are a senior Meta Ads media planner at a performance marketing agency. 
    Turn client briefs into a sound, conservative campaign structure.
    
    CRITICAL INSTRUCTION: Based on the brief, you MUST create exactly 3 different types of ad-sets for every campaign:
    1. "Interest Targeting": Target specific interests (e.g., Real estate investing, Property finder, Luxury goods) and behaviors (e.g., high-value goods preference). Include an age range (e.g., 30-65+).
    2. "Expats Targeting": Target expats from specific countries (e.g., UK, US, Germany, France, Russia, etc.) who are currently living in the target location, combined with the real estate interests from Ad Set 1.
    3. "Lookalike Targeting": Target a 1% lookalike audience of a "Premium Audience" customer list.
    
    If a target language is mentioned in the brief, apply it to all ad-sets. If no language is mentioned, default to English ('en').
    Location/country targeting is mandatory. If no location is mentioned in the brief, default the target country to the UAE ('AE').
    
    Brief:
    ${JSON.stringify(brief, null, 2)}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            campaign: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                objective: {
                  type: Type.STRING,
                  description: "A valid Meta campaign objective, e.g. OUTCOME_SALES, OUTCOME_LEADS, OUTCOME_TRAFFIC, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT"
                },
                buying_type: { type: Type.STRING },
              },
              required: ['name', 'objective', 'buying_type'],
            },
            ad_sets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    enum: ['interest', 'expats', 'lookalike'],
                    description: "The specific strategy for this ad set."
                  },
                  daily_budget_usd: { type: Type.NUMBER },
                  targeting: {
                    type: Type.OBJECT,
                    description: "Detailed targeting parameters. Translate human logic to exact Meta API structures (e.g., interests, behaviors, custom_audiences, locales).",
                    properties: {
                      countries: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Array of exact 2-letter ISO country codes. MUST be included. Default to ['AE'] if unspecified."
                      },
                      locales: {
                        type: Type.ARRAY,
                        items: { type: Type.NUMBER },
                        description: "Meta locale keys. E.g., [24] for English, [62] for Arabic. Default to [24] (English) if unspecified."
                      },
                      age_min: { type: Type.NUMBER },
                      age_max: { type: Type.NUMBER },
                      flexible_spec: {
                        type: Type.ARRAY,
                        description: "Array of detailed targeting (interests/behaviors). Used for Interest and Expat ad sets.",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            interests: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } },
                            behaviors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }
                          }
                        }
                      },
                      expat_countries: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "For Expat ad sets: Array of country names the user is an expat from (e.g., 'United Kingdom', 'Germany')."
                      },
                      custom_audiences: {
                        type: Type.ARRAY,
                        items: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } },
                        description: "For Lookalike ad sets: Identify the audience name, e.g., 'Lookalike (AE, 1%) - Premium Audience'"
                      }
                    },
                    required: ['countries', 'locales']
                  },
                  optimization_goal: { type: Type.STRING },
                  placements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['name', 'type', 'daily_budget_usd', 'targeting', 'optimization_goal', 'placements'],
              },
            },
            rationale: {
              type: Type.STRING,
              description: "Why this structure fits the brief.",
            },
            open_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['campaign', 'ad_sets', 'rationale'],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  }

  // optimization
  async analyzePerformance(
    insights: any[],
    goals: any,
    guardrails: any
  ): Promise<any[]> {
    const prompt = `You are a senior Meta Ads optimizer at a performance marketing agency reviewing 
    account performance. You recommend actions but never execute them - a human always 
    approves. Be conservative: only recommend a change when the data clearly supports it, 
    prefer 'no_action_but_watch' over a speculative change, and never propose a budget or 
    bid change larger than ${guardrails.max_budget_change_pct || 20}% in one pass. 
    Do not recommend touching anything in the protected list, and do not act on objects 
    with too little spend/impressions to have a reliable signal - flag those as 
    'no_action_but_watch' instead.
    
    Data Context:
    ${JSON.stringify({ insights, goals, guardrails }, null, 2)}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  object_id: { type: Type.STRING },
                  object_name: { type: Type.STRING },
                  level: { type: Type.STRING, enum: ['campaign', 'adset', 'ad'] },
                  action: {
                    type: Type.STRING,
                    enum: [
                      'increase_budget',
                      'decrease_budget',
                      'increase_bid',
                      'decrease_bid',
                      'pause',
                      'no_action_but_watch',
                    ],
                  },
                  change_pct: {
                    type: Type.NUMBER,
                    description: "For budget/bid changes: percent change requested, e.g. 15 for +15%. Omit for pause/no_action.",
                  },
                  rationale: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                  supporting_metrics: {
                    type: Type.OBJECT,
                    description: "The specific numbers that justify this call (e.g. cpa, roas, spend, trend vs prior period).",
                  },
                },
                required: ['object_id', 'level', 'action', 'rationale', 'confidence'],
              },
            },
            summary: {
              type: Type.STRING,
              description: "One paragraph overview of account health this period.",
            },
          },
          required: ['recommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed.recommendations || [];
  }

  // reporting
  async writeReport(
    aggregatedMetrics: any,
    periodLabel: string,
    clientName: string = ''
  ): Promise<string> {
    const prompt = `You are a media strategist writing a client-facing Meta Ads performance report. 
    Write in clear, confident prose - no filler, no over-claiming. Structure it as: 
    headline summary, what worked, what underperformed and why, and recommended next steps. 
    Use the actual numbers provided; do not invent figures. Output valid Markdown only.
    
    Data:
    ${JSON.stringify({ client: clientName, period: periodLabel, metrics: aggregatedMetrics }, null, 2)}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    });

    return response.text || '';
  }
}