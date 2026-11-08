const Templates = [
  {
    id: 'template-1',
    name: 'Studio Intro',
    description: 'Warm studio preset.',
    accent: 'from-cyan-300/30 via-blue-400/20 to-transparent',
  },
  {
    id: 'template-2',
    name: 'Minimal Portfolio',
    description: 'Clean monochrome card style.',
    accent: 'from-emerald-300/30 via-teal-400/20 to-transparent',
  },
  {
    id: 'template-3',
    name: 'Bold Campaign',
    description: 'Louder marketing template.',
    accent: 'from-fuchsia-300/30 via-rose-400/20 to-transparent',
  },
]

export default function TemplatesPanel({ onApplyTemplate }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white">
        Hit on "Apply Template" to apply the desired template and fine-tune for personal preference. 
      </div>

      <div className="space-y-3">
        {Templates.map((template, index) => (
          <article
            key={template.id}
            className="overflow-hidden rounded-[1.4rem] border bg-slate-950/60"
          >
            <div className={`h-24 bg-gradient-to-t ${template.accent}`} />
            <div className="space-y-3 px-4 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Template {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">{template.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {template.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onApplyTemplate?.(template.id)}
                className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-300/20"
              >
                Apply Template
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
