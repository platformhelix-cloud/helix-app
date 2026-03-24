export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const MAX_TEXT_LENGTH = 50_000

function sanitiseFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file") as File | null
  const conversationId = formData.get("conversationId") as string | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }
  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId required" },
      { status: 400 }
    )
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 400 }
    )
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 20 MB limit" },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // pdf-parse is a CommonJS module — use require() in Node.js runtime
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (
    buffer: Buffer
  ) => Promise<{ text: string; numpages: number }>

  let pdfData: { text: string; numpages: number }
  try {
    pdfData = await pdfParse(buffer)
  } catch {
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 422 }
    )
  }

  const text =
    pdfData.text.length > MAX_TEXT_LENGTH
      ? pdfData.text.slice(0, MAX_TEXT_LENGTH)
      : pdfData.text

  const safeName = sanitiseFilename(file.name)
  const storagePath = `${user.id}/${conversationId}/${Date.now()}_${safeName}`

  const { error: uploadError } = await supabase.storage
    .from("pdfs")
    .upload(storagePath, buffer, { contentType: "application/pdf" })

  if (uploadError) {
    return NextResponse.json(
      { error: "Storage upload failed: " + uploadError.message },
      { status: 500 }
    )
  }

  const { data: signedData } = await supabase.storage
    .from("pdfs")
    .createSignedUrl(storagePath, 60 * 60)

  return NextResponse.json({
    url: signedData?.signedUrl ?? "",
    name: file.name,
    text,
    pageCount: pdfData.numpages,
  })
}
