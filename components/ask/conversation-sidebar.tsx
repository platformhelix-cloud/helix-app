"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Plus, MessageSquare, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ask/sidebar-context"

export function ConversationSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, setConversations } = useSidebar()
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleNewChat() {
    setIsCreating(true)
    try {
      const res = await fetch("/api/conversations", { method: "POST" })
      if (!res.ok) return
      const { conversation } = await res.json()
      setConversations((prev) => [conversation, ...prev])
      router.push(`/ask/${conversation.id}`)
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDelete(convId: string) {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/conversations/${convId}`, { method: "DELETE" })
      if (!res.ok) return
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (pathname === `/ask/${convId}`) router.push("/ask")
    } finally {
      setIsDeleting(false)
      setConfirmDeleteId(null)
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHrs = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffHrs < 1) return "Just now"
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`
    if (diffDays < 7) return `${Math.floor(diffDays)}d ago`
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  return (
    <aside className="border-border/60 flex w-64 shrink-0 flex-col border-r">
      <div className="p-3">
        <Button
          onClick={handleNewChat}
          disabled={isCreating}
          variant="outline"
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Plus className="size-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.filter((c) => c.title !== null).length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-xs">
            No conversations yet
          </p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.filter((c) => c.title !== null).map((conv) => {
              const isActive = pathname === `/ask/${conv.id}`
              const isConfirming = confirmDeleteId === conv.id

              return (
                <li key={conv.id} className="group/item relative">
                  {isConfirming ? (
                    <div className="flex items-center gap-1 rounded-md px-2.5 py-2">
                      <span className="text-muted-foreground flex-1 truncate text-xs">
                        Delete?
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleDelete(conv.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          "Yes"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={isDeleting}
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Link
                        href={`/ask/${conv.id}`}
                        className={cn(
                          "group flex items-start gap-2 rounded-md px-2.5 py-2 pr-7 text-sm transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                      >
                        <MessageSquare className="mt-0.5 size-3.5 shrink-0 opacity-60" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium leading-tight">
                            {conv.title ?? "New conversation"}
                          </p>
                          <p className="mt-0.5 text-xs opacity-50">
                            {formatDate(conv.updated_at)}
                          </p>
                        </div>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive absolute right-1 top-1/2 size-6 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100"
                        onClick={(e) => {
                          e.preventDefault()
                          setConfirmDeleteId(conv.id)
                        }}
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
