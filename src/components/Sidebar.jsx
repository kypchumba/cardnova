import AccordionSection from './AccordionSection'

export default function Sidebar({
  sections,
  activeSection,
  onSectionChange,
  layout = 'vertical',
}) {
  const isResponsiveHorizontal = layout === 'mobile-horizontal'
  const isHorizontal = layout === 'horizontal' || isResponsiveHorizontal

  return (
    <aside
      className={`h-full overflow-hidden border border-white/10 bg-slate-900/72 shadow-panel backdrop-blur-xl ${
        isResponsiveHorizontal
          ? 'rounded-[1.75rem] p-4 lg:rounded-[2rem] lg:p-6'
          : isHorizontal
            ? 'rounded-[1.75rem] p-4'
          : 'rounded-[2rem] p-6 lg:flex lg:min-h-0 lg:flex-col'
      }`}
    >
      <div
        className={`${
          isResponsiveHorizontal
            ? 'mb-4 px-1 lg:mb-5 lg:px-2 lg:shrink-0'
            : isHorizontal
              ? 'mb-4 px-1'
              : 'mb-5 px-2 lg:shrink-0'
        }`}
      >
        <p className="font-display text-xs uppercase tracking-[0.36em] text-cyan-300">
          Settings Panel
        </p>
      </div>

      <div
        className={`scrollbar-thin ${
          isResponsiveHorizontal
            ? 'flex h-full items-stretch gap-4 overflow-x-auto overflow-y-hidden pb-2 lg:flex-col lg:gap-5 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2 lg:pb-0 lg:min-h-0 lg:flex-1'
            : isHorizontal
              ? 'flex gap-4 overflow-x-auto overflow-y-hidden pb-2'
            : 'flex flex-col gap-5 overflow-y-auto pr-2 lg:min-h-0 lg:flex-1'
        }`}
      >
        {sections.map((section) => (
          <AccordionSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            isOpen={activeSection === section.id}
            onToggle={() => onSectionChange(section.id)}
            layout={layout}
          >
            {section.content}
          </AccordionSection>
        ))}
      </div>
    </aside>
  )
}
