import AccordionSection from './AccordionSection'

export default function Sidebar({
  sections,
  activeSection,
  onSectionChange,
}) {
  return (
    <aside className="h-full rounded-[2rem] border border-white/60 bg-white/55 p-6 shadow-panel backdrop-blur-xl lg:flex lg:min-h-0 lg:flex-col">
      <div className="mb-5 px-2 lg:shrink-0">
        <p className="font-display text-xs uppercase tracking-[0.36em] text-teal-700">
          Business Card Generator
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          Design a polished card in real time
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Fine-tune every layer, keep the preview visible, and export exactly
          what you see.
        </p>
      </div>

      <div className="scrollbar-thin flex max-h-[calc(100dvh-12rem)] flex-col gap-5 overflow-y-auto pr-2 lg:min-h-0 lg:max-h-none lg:flex-1">
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
