export default function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
  subtitle,
}) {
  return (
    <section className="border-b border-slate-200/80 pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <div>
          <p className="font-display text-sm uppercase tracking-[0.24em] text-slate-400">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition">
          {isOpen ? 'X' : '+'}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 py-5">{children}</div>
        </div>
      </div>
    </section>
  )
}
