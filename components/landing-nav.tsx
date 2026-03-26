import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingNav() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-md">
            <span className="text-primary-foreground text-sm font-bold">H</span>
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">
            Helix
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="text-base" asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button className="text-base" asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
