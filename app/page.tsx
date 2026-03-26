import Link from "next/link"
import { LandingNav } from "@/components/landing-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageSquare,
  PenTool,
  ClipboardCheck,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    iconClass: "bg-primary/10 text-primary",
    title: "ASK",
    description:
      "Get answers grounded in NCC, HVAC standards with citations and references.",
    badge: null,
  },
  {
    icon: PenTool,
    iconClass: "bg-teal-100 text-teal-600",
    title: "Design Automate",
    description:
      "Upload PDF drawings for automated energy analysis and annotations.",
    badge: "Coming Soon",
  },
  {
    icon: ClipboardCheck,
    iconClass: "bg-orange-100 text-orange-500",
    title: "Validate",
    description:
      "Custom checklists for automated generator, electrical, and compliance notes.",
    badge: "Coming Soon",
  },
  {
    icon: ShieldCheck,
    iconClass: "bg-green-100 text-green-600",
    title: "Compliance",
    description:
      "Ensure your designs meet NCC, HVAC, and country-specific requirements.",
    badge: "Coming Soon",
  },
]

const bullets = [
  "NCC & Australian Standards compliance checking",
  "Automated document generation & templates",
  "Automated engineering drawing analysis",
  "Real-time collaboration tools",
]

const progressBars = [
  { label: "Fire Safety", width: "85%", color: "bg-green-500" },
  { label: "Structural", width: "70%", color: "bg-blue-500" },
  { label: "Electrical", width: "60%", color: "bg-orange-400" },
  { label: "HVAC", width: "90%", color: "bg-teal-500" },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-24 pb-16 text-center">
        {/* Badges */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <div className="border-border flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <div className="flex -space-x-1">
              {["JD", "KL", "MS"].map((init) => (
                <Avatar key={init} className="h-5 w-5 text-[10px]">
                  <AvatarFallback className="bg-primary/20 text-primary text-[9px]">
                    {init}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-muted-foreground">Join 500+ Engineers</span>
          </div>
          <div className="border-border flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <Zap className="text-primary h-3.5 w-3.5" />
            <span className="text-muted-foreground">Powered Platform</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-7xl">
            Engineering Intelligence
          </h1>
          <h1 className="font-serif text-primary mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for Professionals
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg">
          Standards Q&A, document templates, compliance checking, and drawing
          automation — all in one platform for building services engineers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="text-base" asChild>
            <Link href="/auth/sign-up">Start Free →</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base" asChild>
            <Link href="/dashboard">View Demo</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="border-border mx-auto mt-14 grid w-full max-w-2xl grid-cols-3 divide-x border-t pt-8">
          {[
            { value: "50+", label: "Standards Reviewed" },
            { value: "10x", label: "Faster Reviews" },
            { value: "99%", label: "Accuracy Rate" },
          ].map(({ value, label }) => (
            <div key={label} className="px-4 text-center">
              <div className="text-foreground text-3xl font-bold">{value}</div>
              <div className="text-muted-foreground mt-1 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
            Platform
          </p>
          <h2 className="font-serif text-foreground text-3xl font-bold">
            Everything You Need
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
            Powered by state-of-the-art AI for Australian building services
            engineering.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, iconClass, title, description, badge }) => (
            <Card key={title} className="relative">
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-foreground font-semibold">{title}</h3>
                  {badge && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Built by Engineers */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left */}
          <div>
            <p className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
              Why Us
            </p>
            <h2 className="font-serif text-foreground text-3xl font-bold leading-snug">
              Built by Engineers,
              <br />
              for Engineers
            </h2>
            <ul className="mt-8 space-y-4">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Compliance Report mockup */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="mb-1 font-semibold">Compliance Report</div>
              <p className="text-muted-foreground mb-6 text-xs">
                Automated standards analysis
              </p>
              <div className="space-y-4">
                {progressBars.map(({ label, width, color }) => (
                  <div key={label}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-foreground">{label}</span>
                      <span className="text-muted-foreground">{width}</span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-2 rounded-full ${color}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mt-4 text-white/80">
            Join engineers who save hours on compliance checks and documentation
            every week.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-8 border-white text-white hover:bg-white hover:text-primary"
            asChild
          >
            <Link href="/auth/sign-up">Get Started Free →</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center">
        <p className="text-muted-foreground text-sm">
          © 2026 Helix ·{" "}
          <Link href="#" className="hover:text-foreground underline">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="#" className="hover:text-foreground underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="#" className="hover:text-foreground underline">
            About Helix
          </Link>
        </p>
      </footer>
    </div>
  )
}
