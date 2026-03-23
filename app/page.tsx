import Link from "next/link"
import { LandingNav } from "@/components/landing-nav"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
            Engineering Intelligence for Building Professionals
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-lg">
            Helix is your one stop shop for Standards Q&A, document templates,
            compliance checking, and engineering drawing automation.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
