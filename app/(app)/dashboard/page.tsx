import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
      {user && (
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back, {user.email}
        </p>
      )}
      <div className="text-muted-foreground mt-10 text-sm">
        Content In Development
      </div>
    </div>
  )
}
