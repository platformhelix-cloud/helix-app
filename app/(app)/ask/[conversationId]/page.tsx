import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatWindow } from "@/components/ask/chat-window"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Verify conversation belongs to this user
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user!.id)
    .single()

  if (!conversation) notFound()

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  return (
    <ChatWindow
      conversationId={conversationId}
      initialMessages={messages ?? []}
    />
  )
}
