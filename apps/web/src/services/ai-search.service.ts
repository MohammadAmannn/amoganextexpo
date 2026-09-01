/**
 * AI Search Service
 * Provides web search through Tavily API and LLM analysis through Gemini.
 */

import axios from 'axios'

export interface SearchSource {
  title: string
  url: string
  content: string
}

export interface SearchResponse {
  answer: string
  sources: SearchSource[]
  images: string[]
}

export class AiSearchService {
  /**
   * Executes web search through Tavily API.
   */
  static async searchWeb(query: string, apiKey: string): Promise<{ results: SearchSource[]; images: string[] }> {
    if (!apiKey) {
      throw new Error('Tavily API key is not configured.')
    }

    const res = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        max_results: 10,
        include_images: true,
      },
      { timeout: 15000 }
    )

    return {
      results: res.data?.results || [],
      images: res.data?.images || [],
    }
  }

  /**
   * Generates answer analysis using Gemini API.
   */
  static async generateAnswer(prompt: string, apiKey: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured.')
    }

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      { timeout: 30000 }
    )

    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
}
