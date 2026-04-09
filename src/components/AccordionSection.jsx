export default function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
  subtitle,
  layout = 'vertical',
}) {
  const isResponsiveHorizontal = layout === 'mobile-horizontal'
  const isHorizontal = layout === 'horizontal' || isResponsiveHorizontal

  return (
    <section
      className={`rounded-[1.6rem] border transition-all duration-300 ${
        isOpen
          ? 'border-cyan-300/70 bg-cyan-300/[0.08] shadow-[0_0_0_1px_rgba(103,232,249,0.45),0_0_30px_rgba(34,211,238,0.14)]'
          : 'border-white/10 bg-transparent'
      } ${
        isResponsiveHorizontal
          ? 'w-[min(84vw,24rem)] shrink-0 lg:w-auto lg:shrink lg:pb-4 lg:last:pb-0'
          : isHorizontal
            ? 'w-[min(84vw,24rem)] shrink-0'
            : 'pb-4 last:pb-0'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left ${
          isResponsiveHorizontal ? 'min-h-[6.25rem] lg:min-h-0' : isHorizontal ? 'min-h-[6.25rem]' : ''
        }`}
      >
        <div>
          <p
            className={`font-display text-sm uppercase tracking-[0.24em] ${
              isOpen ? 'text-cyan-100' : 'text-cyan-200'
            }`}
          >
            {title}
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl border text-lg font-semibold text-white transition ${
            isOpen
              ? 'border-cyan-300/60 bg-cyan-300/20 shadow-[0_0_18px_rgba(34,211,238,0.22)]'
              : 'border-white/10 bg-white/[0.06]'
          }`}
        >
          {isOpen ? 'X' : '+'}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-white/10 px-4 py-5 ${
              isResponsiveHorizontal
                ? 'max-h-[calc(50svh-9rem)] overflow-y-auto lg:max-h-none lg:overflow-visible'
                : isHorizontal
                  ? 'max-h-[calc(50svh-9rem)] overflow-y-auto'
                  : ''
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
