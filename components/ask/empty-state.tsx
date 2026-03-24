"use client"

import { useRouter } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  const router = useRouter()

  async function startConversation() {
    const res = await fetch("/api/conversations", { method: "POST" })
    if (!res.ok) return
    const { conversation } = await res.json()
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

      <Button onClick={startConversation} className="w-full">
        New Conversation
      </Button>
    </div>
  )
}
