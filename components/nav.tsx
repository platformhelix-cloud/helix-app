import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/sign-out-button"

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

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-6 px-6">
        <Link href="/dashboard" className="font-serif text-lg font-semibold">
          Helix
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
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {user.email}
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}
