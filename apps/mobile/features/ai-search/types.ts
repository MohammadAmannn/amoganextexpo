export interface SearchSource {
  title: string
  url: string
  snippet: string
}

export interface SearchResult {
  query: string
  answer: string
  sources: SearchSource[]
  timestamp: string
}
