export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  model?: string
}

export interface AiModelOption {
  id: string
  name: string
  provider: string
}
