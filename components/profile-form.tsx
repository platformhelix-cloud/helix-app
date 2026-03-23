"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { profileSchema, type ProfileValues } from "@/lib/validations"
import { DISCIPLINES, type Profile } from "@/lib/supabase/types"
import { updateProfile } from "@/app/(app)/profile/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type ProfileFormProps = {
  initialData: Profile | null
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: initialData?.first_name ?? "",
      last_name: initialData?.last_name ?? "",
      enterprise_name: initialData?.enterprise_name ?? "",
      discipline: initialData?.discipline ?? [],
    },
  })

  async function onSubmit(values: ProfileValues) {
    setSuccess(false)
    setServerError(null)
    const result = await updateProfile(values)
    if (result.success) {
      setSuccess(true)
    } else {
      setServerError(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="enterprise_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Company / Enterprise{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Acme Engineering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discipline"
          render={() => (
            <FormItem>
              <FormLabel>Discipline</FormLabel>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DISCIPLINES.map((discipline) => (
                  <FormField
                    key={discipline}
                    control={form.control}
                    name="discipline"
                    render={({ field }) => (
                      <FormItem
                        key={discipline}
                        className="flex flex-row items-start space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value.includes(discipline)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, discipline])
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (v: string) => v !== discipline
                                  )
                                )
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {discipline}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Profile updated successfully.
          </p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
