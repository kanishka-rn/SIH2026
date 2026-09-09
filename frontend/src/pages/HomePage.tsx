import { FileText, GitBranch, Languages, Scale, ShieldCheck, Target } from "lucide-react"

const principles = [
  {
    icon: Target,
    title: "Evidence first",
    body: "Recommendations will cite retrieval evidence. The model will not invent standard numbers.",
  },
  {
    icon: GitBranch,
    title: "Relationship intelligence",
    body: "Related, allied, and normative standards will come from authoritative corpus links.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance with provenance",
    body: "Certification and QCO statements appear only when source data supports them.",
  },
  {
    icon: Scale,
    title: "Confidence and abstention",
    body: "If evidence is insufficient, the system will abstain instead of guessing.",
  },
  {
    icon: Languages,
    title: "Multilingual procurement",
    body: "Queries will eventually be accepted in languages supported by the corpus.",
  },
  {
    icon: FileText,
    title: "Specification intake",
    body: "Natural language, tender text, and PDF/DOCX/TXT documents are planned inputs.",
  },
]

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl space-y-4">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Identify applicable Indian Standards for procurement specifications.
        </h1>
        <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
          This application will help procurement officers map requirements to
          Indian Standards using hybrid retrieval, ranking, and explainable
          evidence. The product surface is not a chatbot.
        </p>
        <p className="rounded-md border border-line bg-accent-soft/60 px-4 py-3 text-sm text-ink">
          Phase 0 is complete when this shell builds and the backend health
          check starts. Dataset import, database tables, and retrieval are
          deferred.
        </p>
      </section>

      <section aria-labelledby="principles-heading">
        <h2
          id="principles-heading"
          className="mb-4 font-serif text-2xl font-semibold text-ink"
        >
          Design principles
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {principles.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-line bg-panel p-5"
            >
              <item.icon className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
