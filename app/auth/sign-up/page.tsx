"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { createClient } from "@/lib/supabase/client"
import { signUpSchema, type SignUpValues } from "@/lib/validations"
import { DISCIPLINES } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function SignUpPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      enterprise_name: "",
      discipline: [],
    },
  })

  async function onSubmit(values: SignUpValues) {
    setServerError(null)
    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (signUpError) {
      setServerError(signUpError.message)
      return
    }

    // Update profile fields — the trigger already inserted the row
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: values.first_name,
        last_name: values.last_name,
        enterprise_name: values.enterprise_name ?? null,
        discipline: values.discipline,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")

    if (profileError) {
      setServerError(profileError.message)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Join Helix to access engineering intelligence tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
                                    field.onChange([
                                      ...field.value,
                                      discipline,
                                    ])
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating account…" : "Sign Up"}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
