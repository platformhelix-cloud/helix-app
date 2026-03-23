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
