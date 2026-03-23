"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "@/app/(app)/actions"

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="sm">
        Sign Out
      </Button>
    </form>
  )
}
