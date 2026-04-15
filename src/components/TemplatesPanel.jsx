const placeholderTemplates = [
  {
    id: 'template-1',
    name: 'Studio Intro',
    description: 'Swap this placeholder with your preferred warm studio preset.',
    accent: 'from-cyan-300/30 via-blue-400/20 to-transparent',
  },
  {
    id: 'template-2',
    name: 'Minimal Portfolio',
    description: 'Use this slot for a clean monochrome card style later.',
    accent: 'from-emerald-300/30 via-teal-400/20 to-transparent',
  },
  {
    id: 'template-3',
    name: 'Bold Campaign',
    description: 'Replace this with your own louder marketing template.',
    accent: 'from-fuchsia-300/30 via-rose-400/20 to-transparent',
  },
]

export default function TemplatesPanel({ onApplyPlaceholder }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white">
        Hit on apply template to apply the desired template and fine-tune for personal preference. 
      </div>

      <div className="space-y-3">
        {placeholderTemplates.map((template, index) => (
          <article
            key={template.id}
            className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/60"
          >
            <div className={`h-24 bg-gradient-to-br ${template.accent}`} />
            <div className="space-y-3 px-4 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Placeholder {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-bold text-white">{template.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {template.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onApplyPlaceholder?.(template.id)}
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
