"use server"

import { createClient } from "@/lib/supabase/server"
import { profileSchema } from "@/lib/validations"

export type ProfileActionResult =
  | { success: true }
  | { success: false; error: string }

export async function updateProfile(
  values: unknown
): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      enterprise_name: parsed.data.enterprise_name ?? null,
      discipline: parsed.data.discipline,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
