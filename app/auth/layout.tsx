import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="font-serif mb-8 text-2xl font-semibold tracking-tight"
      >
        Helix
      </Link>
      {children}
    </div>
  )
}
