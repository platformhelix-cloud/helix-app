import { createClient } from "@/lib/supabase/server"
import { ConversationSidebarProvider } from "@/components/ask/sidebar-context"
import { ConversationSidebar } from "@/components/ask/conversation-sidebar"
import type { Conversation } from "@/lib/supabase/types"

export default async function AskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let conversations: Conversation[] = []
  if (user) {
    const { data } = await supabase
      .from("conversations")
      .select("id, user_id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
    conversations = data ?? []
  }

  return (
    <ConversationSidebarProvider initialConversations={conversations}>
      <div className="flex h-full min-h-0 overflow-hidden">
        <ConversationSidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </ConversationSidebarProvider>
  )
}
