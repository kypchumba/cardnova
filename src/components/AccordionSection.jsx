export default function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
  subtitle,
}) {
  return (
    <section className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <div>
          <p className="font-display text-sm uppercase tracking-[0.24em] text-cyan-200">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-lg font-semibold text-white transition">
          {isOpen ? 'X' : '+'}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 py-5">{children}</div>
        </div>
      </div>
    </section>
  )
}
