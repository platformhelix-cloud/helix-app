"use client"

import { useRouter } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

const SUGGESTED_QUESTIONS = [
  "What are the NCC 2022 fire separation requirements between an open car park and an occupied building?",
  "Summarise AS 1668.2 ventilation requirements for a mechanically ventilated open-plan office.",
  "What Deemed-to-Satisfy provisions apply to Type A construction over 25m effective height?",
  "What are the hydraulic design requirements for fire hydrant systems under AS 2419.1?",
]

export function EmptyState() {
  const router = useRouter()

  async function startConversation(question?: string) {
    const res = await fetch("/api/conversations", { method: "POST" })
    if (!res.ok) return
    const { conversation } = await res.json()
    if (question) {
      sessionStorage.setItem(`prefill:${conversation.id}`, question)
    }
    router.push(`/ask/${conversation.id}`)
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-8 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-primary/10 flex size-14 items-center justify-center rounded-2xl">
          <MessageSquare className="text-primary size-7" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold">Ask Helix</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Ask anything about construction standards, building compliance, or
            engineering regulations. Attach a PDF to query a specific document.
          </p>
        </div>
      </div>

      <div className="w-full space-y-2">
        <p className="text-muted-foreground text-left text-xs font-medium uppercase tracking-wide">
          Suggested questions
        </p>
        <div className="grid gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => startConversation(q)}
              className="border-border hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg border px-4 py-3 text-left text-sm transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={() => startConversation()} className="w-full">
        New Conversation
      </Button>
    </div>
  )
}
