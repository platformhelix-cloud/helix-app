"use client"

import { Paperclip, X } from "lucide-react"
import { cn } from "@/lib/utils"

type PdfAttachmentProps = {
  name: string
  pageCount?: number
  onRemove?: () => void
  className?: string
}

export function PdfAttachment({
  name,
  pageCount,
  onRemove,
  className,
}: PdfAttachmentProps) {
  const displayName = name.length > 40 ? name.slice(0, 37) + "…" : name

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs",
        className
      )}
    >
      <Paperclip className="size-3 shrink-0" />
      <span className="truncate">{displayName}</span>
      {pageCount != null && (
        <span className="shrink-0 opacity-60">({pageCount}p)</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-foreground ml-0.5 shrink-0 transition-colors"
          aria-label="Remove attachment"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}
