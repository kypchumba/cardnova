import AccordionSection from './AccordionSection'

export default function Sidebar({
  sections,
  activeSection,
  onSectionChange,
}) {
  return (
    <aside className="h-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/72 p-6 shadow-panel backdrop-blur-xl lg:flex lg:min-h-0 lg:flex-col">
      <div className="mb-5 px-2 lg:shrink-0">
        <p className="font-display text-xs uppercase tracking-[0.36em] text-cyan-300">
          Settings Panel
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-white">
          Build the workspace your way
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Keep the preview large, move fast between controls, and fine-tune
          every layer without losing sight of the card.
        </p>
      </div>

      <div className="scrollbar-thin flex flex-col gap-5 overflow-y-auto pr-2 lg:min-h-0 lg:flex-1">
        {sections.map((section) => (
          <AccordionSection
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            isOpen={activeSection === section.id}
            onToggle={() => onSectionChange(section.id)}
          >
            {section.content}
          </AccordionSection>
        ))}
      </div>
    </aside>
  )
}
