export type Discipline =
  | "Architectural"
  | "Builder"
  | "Contractor"
  | "Mechanical Engineer"
  | "Hydraulic Engineer"
  | "Fire Engineer"
  | "Vertical Transport Engineer"
  | "Acoustic Engineer"
  | "Civil Engineer"
  | "Structural Engineer"
  | "Environmental Engineer"

export const DISCIPLINES: Discipline[] = [
  "Architectural",
  "Builder",
  "Contractor",
  "Mechanical Engineer",
  "Hydraulic Engineer",
  "Fire Engineer",
  "Vertical Transport Engineer",
  "Acoustic Engineer",
  "Civil Engineer",
  "Structural Engineer",
  "Environmental Engineer",
]

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  enterprise_name: string | null
  discipline: Discipline[]
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  pdf_url: string | null
  pdf_name: string | null
  pdf_text: string | null
  created_at: string
}

export type PdfContext = {
  url: string
  name: string
  text: string
  pageCount: number
}
