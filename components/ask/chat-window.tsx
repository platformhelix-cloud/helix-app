"use client"

import { useRef, useState } from "react"
import type { Message as DbMessage, PdfContext } from "@/lib/supabase/types"
import { useSidebar } from "@/components/ask/sidebar-context"
import { MessageList } from "@/components/ask/message-list"
import { ChatInput } from "@/components/ask/chat-input"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  pdfName?: string | null
}

type ChatWindowProps = {
  conversationId: string
  initialMessages: DbMessage[]
}

function toLocalMessage(msg: DbMessage): ChatMessage {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    pdfName: msg.pdf_name ?? null,
  }
}

export function ChatWindow({ conversationId, initialMessages }: ChatWindowProps) {
  const { refreshConversations } = useSidebar()
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.map(toLocalMessage)
  )
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [pendingPdf, setPendingPdf] = useState<PdfContext | null>(null)

  const isNewConversation = useRef(initialMessages.length === 0)
  const firstUserMessageRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function sendMessage(text: string, pdf: PdfContext | null) {
    if (!text.trim() || isStreaming) return

    const userMsgId = crypto.randomUUID()
    const assistantMsgId = crypto.randomUUID()

    // Capture for title generation
    if (isNewConversation.current && !firstUserMessageRef.current) {
      firstUserMessageRef.current = text
    }

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: text, pdfName: pdf?.name ?? null },
    ])
    setInput("")
    setPendingPdf(null)

    // Add empty assistant message for streaming
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "" },
    ])

    setIsStreaming(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          userMessage: text,
          pdfContext: pdf ?? undefined,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "Unknown error")
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: `Error: ${errText}` }
              : m
          )
        )
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: accumulated } : m
          )
        )
      }

      // Title generation — fire and forget after first exchange
      if (isNewConversation.current && firstUserMessageRef.current) {
        isNewConversation.current = false
        fetch(`/api/conversations/${conversationId}/title`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstUserMessage: firstUserMessageRef.current }),
        })
          .then(() => refreshConversations())
          .catch(() => {
            // Non-critical — fail silently
          })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: "An error occurred. Please try again." }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  function handleSubmit(e: React.FormEvent, pdf: PdfContext | null) {
    e.preventDefault()
    sendMessage(input, pdf)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput
        conversationId={conversationId}
        input={input}
        isStreaming={isStreaming}
        pendingPdf={pendingPdf}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        onPdfAttach={setPendingPdf}
        onPdfRemove={() => setPendingPdf(null)}
      />
    </div>
  )
}
