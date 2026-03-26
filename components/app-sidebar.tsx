"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  PenTool,
  ClipboardCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ask", label: "Ask", icon: MessageSquare },
  { href: "/design-automate", label: "Design Automate", icon: PenTool },
  { href: "/validate", label: "Validate", icon: ClipboardCheck },
  { href: "/policy", label: "Policy", icon: FileText },
]

type AppSidebarProps = {
  initials: string
}

export function AppSidebar({ initials }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col border-r bg-background transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* TOP — Logo */}
      <div className="flex h-14 items-center justify-between px-3">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
          <div className="bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
            <span className="text-primary-foreground text-sm font-bold">H</span>
          </div>
          {!collapsed && (
            <span className="font-serif overflow-hidden text-lg font-semibold tracking-tight whitespace-nowrap">
              Helix
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0 rounded-md p-1 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      <Separator />

      {/* MIDDLE — Nav links */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && (
              <span className="overflow-hidden whitespace-nowrap">{label}</span>
            )}
          </Link>
        ))}
      </nav>

      <Separator />

      {/* BOTTOM — User + Theme */}
      <div
        className={`flex items-center p-3 ${
          collapsed ? "flex-col gap-3" : "justify-between"
        }`}
      >
        <UserMenu initials={initials} />
        <ThemeToggle />
      </div>
    </aside>
  )
}
