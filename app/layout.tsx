import type { Metadata } from "next"
import { Sora, Roboto, Fira_Code } from "next/font/google";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Sora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Helix",
  description: "Engineering Intelligence for Professionals",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
