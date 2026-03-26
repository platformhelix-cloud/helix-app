import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ask", label: "Ask" },
  { href: "/design-automate", label: "Design Automate" },
  { href: "/validate", label: "Validate" },
  { href: "/policy", label: "Policy" },
]

export async function Nav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initials = ""
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single()

    initials = [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .map((s) => s![0].toUpperCase())
      .join("")
  }

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-6 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-md">
            <span className="text-primary-foreground text-sm font-bold">H</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">
            Helix
          </span>
        </Link>
        <nav className="flex flex-1 items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <UserMenu initials={initials} />}
        </div>
      </div>
    </header>
  )
}
