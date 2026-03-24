import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  // Verify ownership
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  let firstUserMessage: string
  try {
    const body = await request.json()
    firstUserMessage = String(body.firstUserMessage ?? "").slice(0, 500)
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a concise 5-7 word title for a conversation that starts with this message: "${firstUserMessage}". Respond with only the title, no quotes, no punctuation at the end.`,
    })

    const title = text.trim()

    await supabase
      .from("conversations")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id)

    return NextResponse.json({ title })
  } catch (err) {
    console.error("Title generation failed:", err)
    return NextResponse.json({ error: "Title generation failed" }, { status: 500 })
  }
}
