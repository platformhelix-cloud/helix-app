import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"
import { type Profile } from "@/lib/supabase/types"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: Profile | null = null

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    profile = data
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account details and discipline settings
        </p>
      </div>
      <Separator className="my-6" />
      <ProfileForm initialData={profile} />
    </div>
  )
}
