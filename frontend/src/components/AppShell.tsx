import { NavLink, Outlet } from "react-router-dom"
import { Landmark } from "lucide-react"
import { APP_ROUTES } from "../config/routes"

export function AppShell() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-panel focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-md bg-teal text-panel">
              <Landmark className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-ink-muted uppercase">
                SIH26108 · Phase 0
              </p>
              <p className="font-serif text-xl font-semibold text-ink">
                Procurement Standards Intelligence
              </p>
            </div>
          </div>
          <p className="max-w-md text-sm text-ink-muted lg:text-right">
            Foundation only. Search, retrieval, and recommendations are not
            available yet.
          </p>
        </div>
        <nav
          aria-label="Primary"
          className="border-t border-line bg-paper/70"
        >
          <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
            {APP_ROUTES.map((route) => (
              <li key={route.path} className="shrink-0">
                {route.available ? (
                  <NavLink
                    to={route.path}
                    className="inline-flex rounded-md px-3 py-1.5 text-sm font-medium text-teal underline-offset-4 hover:underline"
                  >
                    {route.label}
                  </NavLink>
                ) : (
                  <span
                    className="inline-flex cursor-not-allowed rounded-md px-3 py-1.5 text-sm text-ink-muted"
                    title="Planned for a later phase"
                  >
                    {route.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-ink-muted sm:px-6">
          Evidence-first recommendations. No fabricated BIS metadata. Unknown
          remains unknown.
        </div>
      </footer>
    </div>
  )
}
