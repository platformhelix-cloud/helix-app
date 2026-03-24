"use client"

import { createContext, useContext, useCallback, useState } from "react"
import type { Conversation } from "@/lib/supabase/types"

type SidebarContextValue = {
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  refreshConversations: () => Promise<void>
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within ConversationSidebarProvider")
  return ctx
}

export function ConversationSidebarProvider({
  initialConversations,
  children,
}: {
  initialConversations: Conversation[]
  children: React.ReactNode
}) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations)

  const refreshConversations = useCallback(async () => {
    const res = await fetch("/api/conversations")
    if (res.ok) {
      const data = await res.json()
      setConversations(data.conversations ?? [])
    }
  }, [])

  return (
    <SidebarContext.Provider
      value={{ conversations, setConversations, refreshConversations }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
