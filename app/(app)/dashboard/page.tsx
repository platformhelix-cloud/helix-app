import { createClient } from "@/lib/supabase/server"

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
      <div className="text-muted-foreground mt-10 text-sm">
        Content In Development
      </div>
    </div>
  )
}
