import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"

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

  return <AppSidebar initials={initials} />
}
