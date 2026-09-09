export type AppRoute = {
  path: string
  label: string
  available: boolean
}

export const APP_ROUTES: AppRoute[] = [
  { path: "/", label: "Home", available: true },
  { path: "/analyze", label: "Analyze specification", available: false },
  { path: "/standards", label: "Standards directory", available: false },
  { path: "/compare", label: "Compare", available: false },
  { path: "/saved", label: "Saved", available: false },
  { path: "/history", label: "History", available: false },
  { path: "/compliance", label: "Compliance", available: false },
  { path: "/methodology", label: "Methodology", available: false },
]
