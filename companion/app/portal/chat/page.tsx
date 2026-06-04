'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

interface Conversation {
  id: string
  title: string | null
  created_at: string
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [starting, setStarting] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  // Mobile: show the conversation list ('list') or the active chat ('chat')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const firstMessageSent = useRef(false)

  const loadConversations = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .eq('mode', 'text')
      .order('created_at', { ascending: false })
    setConversations(data ?? [])
  }, [])

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true)
    setMessages([])
    const res = await fetch(`/api/portal/messages?conversation_id=${conversationId}`)
    const data = await res.json()
    setMessages(data.messages ?? [])
    setLoadingMessages(false)
  }, [])

  useEffect(() => { loadConversations() }, [loadConversations])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startNewConversation() {
    setStarting(true)
    firstMessageSent.current = false

    const res = await fetch('/api/portal/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New conversation', mode: 'text' }),
    })
    const data = await res.json()

    if (data.conversation?.id) {
      setSelectedId(data.conversation.id)
      setMessages([{
        role: 'assistant',
        content: "Hey, I'm here. What's on your mind today?",
      }])
      await loadConversations()
      setMobileView('chat') // on mobile: switch to chat view
    }
    setStarting(false)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  async function selectConversation(id: string) {
    setSelectedId(id)
    firstMessageSent.current = true // existing convo, skip title update
    await loadMessages(id)
    setMobileView('chat') // on mobile: switch to chat view
  }

  async function updateTitle(conversationId: string, firstMessage: string) {
    const title = firstMessage.slice(0, 60) + (firstMessage.length > 60 ? '...' : '')
    const supabase = createClient()
    await supabase
      .from('conversations')
      .update({ title })
      .eq('id', conversationId)
    await loadConversations()
  }

  async function sendMessage() {
    if (!input.trim() || !selectedId || sending) return
    const userMessage = input.trim()
    setInput('')
    setSending(true)

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    // Update title with first real user message
    if (!firstMessageSent.current) {
      firstMessageSent.current = true
      updateTitle(selectedId, userMessage)
    }

    const res = await fetch('/api/portal/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: selectedId, content: userMessage }),
    })
    const data = await res.json()

    if (data.content) {
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    }
    setSending(false)
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar — hidden on mobile when chat is open */}
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-72 flex-shrink-0 border-r border-line flex-col bg-white`}>
        <div className="p-4 border-b border-line">
          <h1 className="font-poppins font-bold text-plum-dark text-lg mb-3" style={{ letterSpacing: '-0.03em' }}>
            Text chat
          </h1>
          <button
            onClick={startNewConversation}
            disabled={starting}
            className="w-full font-inter font-semibold text-sm text-white px-4 py-2.5 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60"
          >
            {starting ? 'Starting...' : '+ New conversation'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="font-inter text-sm text-muted p-5 text-center">No conversations yet</p>
          )}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`w-full text-left px-4 py-3.5 border-b border-line hover:bg-cloud transition-colors ${selectedId === conv.id ? 'bg-plum/5 border-l-2 border-l-plum' : ''}`}
            >
              <p className="font-inter font-medium text-ink text-sm truncate">
                {conv.title ?? 'New conversation'}
              </p>
              <p className="font-inter text-xs text-muted mt-0.5">
                {new Date(conv.created_at).toLocaleDateString('en-ZA')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area — hidden on mobile when list is shown */}
      <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-h-0`}>
        {!selectedId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <div className="w-16 h-16 rounded-full bg-plum/10 flex items-center justify-center text-3xl">💬</div>
            <div className="text-center">
              <p className="font-poppins font-bold text-plum-dark text-lg mb-1" style={{ letterSpacing: '-0.03em' }}>
                Start a conversation
              </p>
              <p className="font-inter text-muted text-sm">
                Type with your AI companion anytime, anywhere.
              </p>
            </div>
            <button
              onClick={startNewConversation}
              disabled={starting}
              className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-60"
            >
              {starting ? 'Starting...' : 'Start new conversation'}
            </button>
          </div>
        ) : (
          <>
            {/* Mobile back button */}
            <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-line bg-white flex-shrink-0">
              <button
                className="flex items-center gap-1.5 text-plum font-inter font-semibold text-sm min-h-[44px]"
                onClick={() => setMobileView('list')}
              >
                ← Conversations
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {loadingMessages && (
                <p className="font-inter text-sm text-muted text-center mt-8">Loading...</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-plum text-white rounded-br-md'
                      : 'bg-white border border-line shadow-card text-ink rounded-bl-md'
                  }`}>
                    <p className="font-inter text-sm leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-line shadow-card rounded-3xl rounded-bl-md px-4 py-3">
                    <p className="font-inter text-sm text-muted">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-line p-4 bg-white">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  className="flex-1 font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-plum resize-none"
                  style={{ maxHeight: '120px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="font-inter font-semibold text-sm text-white px-5 py-3 rounded-full bg-plum hover:bg-plum-dark transition-colors shadow-soft disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
