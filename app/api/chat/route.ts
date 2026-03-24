import { createClient } from "@/lib/supabase/server"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { PdfContext } from "@/lib/supabase/types"

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

function buildSystemPrompt(profile: {
  first_name: string | null
  enterprise_name: string | null
  discipline: string[]
} | null): string {
  const name = profile?.first_name ?? null
  const company = profile?.enterprise_name ?? null
  const disciplines = profile?.discipline ?? []

  const whoLine = [
    name ? `You are assisting ${name}` : "You are assisting a user",
    company ? ` from ${company}` : "",
    ".",
  ].join("")

  const disciplineLine =
    disciplines.length > 0
      ? `Their engineering discipline(s): ${disciplines.join(", ")}.`
      : ""

  return `You are Helix, an expert engineering assistant for building professionals in Australia.

You have deep expertise in:
- National Construction Code (NCC / BCA) including all Volumes and Specifications
- AS/NZS standards series (mechanical, fire, hydraulic, structural, acoustic, civil, electrical)
- State and territory variations and amendments
- ABCB guidelines, deemed-to-satisfy provisions, and performance solutions

${whoLine}
${disciplineLine}

When answering questions:
1. Cite specific clause references (e.g. NCC 2022 Volume One C2D2; AS 1668.1-2015 Clause 4.3.2).
2. Clearly distinguish between mandatory requirements and Deemed-to-Satisfy (DtS) provisions.
3. When a PDF document is attached, treat it as the primary reference and cite it explicitly by name.
4. If you are uncertain about a specific clause number, say so — do not guess or fabricate references.
5. Use clear headings, numbered steps, and tables where they aid comprehension of technical content.
6. When relevant, note whether requirements vary by building class, construction type, or jurisdiction.`
}

function buildAugmentedContent(
  content: string,
  pdfName: string,
  pdfText: string
): string {
  return `${content}

---
Attached document: ${pdfName}

${pdfText}
---`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorised", { status: 401 })
  }

  let body: {
    conversationId: string
    userMessage: string
    pdfContext?: PdfContext
  }

  try {
    body = await request.json()
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  const { conversationId, userMessage, pdfContext } = body

  if (!conversationId || !userMessage?.trim()) {
    return new Response("conversationId and userMessage required", {
      status: 400,
    })
  }

  // Verify conversation belongs to the user
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single()

  if (!conversation) {
    return new Response("Not found", { status: 404 })
  }

  // Fetch user profile for personalisation
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, enterprise_name, discipline")
    .eq("id", user.id)
    .single()

  // Save the user message to DB before streaming
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: userMessage,
    pdf_url: pdfContext?.url ?? null,
    pdf_name: pdfContext?.name ?? null,
    pdf_text: pdfContext?.text ?? null,
  })

  // Fetch full conversation history from DB (source of truth — not from client)
  const { data: history } = await supabase
    .from("messages")
    .select("role, content, pdf_name, pdf_text")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  // Build AI message array, augmenting messages that have an attached PDF
  const aiMessages = (history ?? []).map((msg) => {
    const content =
      msg.pdf_name && msg.pdf_text
        ? buildAugmentedContent(msg.content, msg.pdf_name, msg.pdf_text)
        : msg.content
    return { role: msg.role as "user" | "assistant", content }
  })

  const systemPrompt = buildSystemPrompt(profile)

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: aiMessages,
    onFinish: async ({ text }) => {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: text,
      })
    },
  })

  return result.toTextStreamResponse()
}
