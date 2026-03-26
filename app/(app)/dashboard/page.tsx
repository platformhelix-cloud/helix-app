import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, PenTool, ClipboardCheck, ArrowRight } from "lucide-react"

const tools = [
  {
    href: "/ask",
    icon: MessageSquare,
    iconClass: "bg-primary/10 text-primary",
    accentClass: "bg-primary",
    title: "ASK",
    description: "Ask questions, generate templates & upload documents",
    comingSoon: false,
  },
  {
    href: "/design-automate",
    icon: PenTool,
    iconClass: "bg-teal-100 text-teal-600",
    accentClass: "bg-teal-500",
    title: "Design Automate",
    description: "AI-assisted drawing automation",
    comingSoon: true,
  },
  {
    href: "/validate",
    icon: ClipboardCheck,
    iconClass: "bg-orange-100 text-orange-500",
    accentClass: "bg-orange-400",
    title: "Validate",
    description: "Review documents for compliance",
    comingSoon: true,
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let firstName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single()
    firstName = profile?.first_name ?? null
  }

  return (
    <div className="px-6 py-10">
      <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
      {user && (
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back, {firstName ?? user.email}
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ href, icon: Icon, iconClass, accentClass, title, description, comingSoon }) => (
          <Link key={href} href={href}>
            <Card className="group h-full overflow-hidden pt-0 transition-shadow hover:shadow-md">
              {/* Thin accent strip */}
              <div className={`h-1 w-full ${accentClass}`} />
              <CardContent className="flex h-full flex-col p-5">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-foreground text-lg font-bold">{title}</h2>
                  {comingSoon && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground flex-1 text-sm">
                  {description}
                </p>
                <div className="mt-4">
                  <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
