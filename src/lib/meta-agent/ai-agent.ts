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
    Turn client briefs into a sound, conservative campaign structure. Split budget 
    across a small number of testable ad sets rather than fragmenting spend too thin. 
    Flag anything ambiguous instead of guessing silently.
    
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
                  daily_budget_usd: { type: Type.NUMBER },
                  targeting_summary: {
                    type: Type.OBJECT,
                    description: "Human-readable targeting parameters (age range, genders, geos, interests) - translate to exact Meta targeting spec fields before calling the API."
                  },
                  meta_countries: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of exact 2-letter ISO country codes for the target locations (e.g., ['AE', 'GB', 'US']) based on the brief."
                  },
                  optimization_goal: { type: Type.STRING },
                  placements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['name', 'daily_budget_usd', 'targeting_summary', 'optimization_goal', 'placements'],
              },
            },
            rationale: {
              type: Type.STRING,
              description: "Why this structure (budget split across ad sets, audience choices, placement choices) fits the brief.",
            },
            open_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Anything ambiguous in the brief that a human should confirm before this goes live.",
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