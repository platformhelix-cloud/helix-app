"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { Paperclip, Send, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PdfAttachment } from "@/components/ask/pdf-attachment"
import type { PdfContext } from "@/lib/supabase/types"

type ChatInputProps = {
  conversationId: string
  input: string
  isStreaming: boolean
  pendingPdf: PdfContext | null
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent, pdfContext: PdfContext | null) => void
  onPdfAttach: (pdf: PdfContext) => void
  onPdfRemove: () => void
}

export function ChatInput({
  conversationId,
  input,
  isStreaming,
  pendingPdf,
  onChange,
  onSubmit,
  onPdfAttach,
  onPdfRemove,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isStreaming && !isUploading && input.trim()) {
        onSubmit(e as unknown as React.FormEvent, pendingPdf)
      }
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("conversationId", conversationId)

    try {
      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed")
      } else {
        onPdfAttach(data as PdfContext)
      }
    } catch {
      setUploadError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const canSend = !isStreaming && !isUploading && input.trim().length > 0

  return (
    <div className="border-border/60 border-t px-4 py-3">
      {pendingPdf && (
        <div className="mb-2">
          <PdfAttachment
            name={pendingPdf.name}
            pageCount={pendingPdf.pageCount}
            onRemove={onPdfRemove}
          />
        </div>
      )}
      {uploadError && (
        <p className="text-destructive mb-2 text-xs">{uploadError}</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canSend) onSubmit(e, pendingPdf)
        }}
        className="flex items-end gap-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Attach PDF"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground mb-0.5 shrink-0"
          disabled={isUploading || isStreaming}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach PDF"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Paperclip className="size-4" />
          )}
        </Button>
        <Textarea
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about building standards, compliance, or attach a PDF…"
          className="max-h-40 min-h-[2.5rem] flex-1 resize-none"
          rows={1}
          disabled={isStreaming}
        />
        <Button
          type="submit"
          size="icon"
          className="mb-0.5 shrink-0"
          disabled={!canSend}
          aria-label="Send message"
        >
          {isStreaming ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
      <p className="text-muted-foreground mt-1.5 text-center text-xs">
        Helix may make mistakes. Always verify against the relevant standard.
      </p>
    </div>
  )
}
