import { NextRequest, NextResponse } from 'next/server'
import { AiSearchService } from '../services/ai-search.service'

export async function handleSearchPost(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, toolPrompt, toolId } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const tavilyKey = process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY || ''
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

    if (!tavilyKey) {
      return NextResponse.json({ error: 'Tavily API key is not configured' }, { status: 500 })
    }

    const { results, images } = await AiSearchService.searchWeb(query, tavilyKey)

    if (results.length === 0) {
      return NextResponse.json({
        answer: 'No search results found for your query. Please try a different search term.',
        sources: [],
        images: [],
      })
    }

    const context = results
      .map((item: any) => `Title: ${item.title}\nContent: ${item.content}\nURL: ${item.url}`)
      .join('\n\n')

    const systemPrompt = toolPrompt || 'You are an AI Search Assistant. Give comprehensive answers using the search results provided. Use headings and bullet points when useful, and always cite your sources.'

    const prompt = `
${systemPrompt}

Question:
${query}

Search Results:
${context}

Instructions:
- Give a comprehensive answer based on search results.
- Use headings and bullet points for readability.
- Cite sources accurately.
`

    let answer = ''
    if (geminiKey) {
      answer = await AiSearchService.generateAnswer(prompt, geminiKey)
    }

    return NextResponse.json({
      answer,
      sources: results,
      images,
    })
  } catch (err: any) {
    console.error('Error in handleSearchPost:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to process AI search request' },
      { status: 500 }
    )
  }
}
