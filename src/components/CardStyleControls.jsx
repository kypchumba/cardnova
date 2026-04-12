import { cardLayoutOptions, cardRatioOptions } from '../utils'

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      {children}
    </label>
  )
}

export default function CardStyleControls({ card, onChange }) {
  return (
    <div className="space-y-5">
      <Field label="Card layout">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.06] p-1">
          {cardLayoutOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ layout: option.value })}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                card.layout === option.value
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Aspect ratio">
        <select
          value={card.ratio}
          onChange={(event) => onChange({ ratio: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
        >
          {cardRatioOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`Border radius: ${card.borderRadius}px`}>
        <input
          type="range"
          min="0"
          max="64"
          value={card.borderRadius}
          onChange={(event) => onChange({ borderRadius: Number(event.target.value) })}
          className="w-full accent-cyan-300"
        />
      </Field>

      <Field label={`Glass transparency: ${Math.round(card.transparency * 100)}%`}>
        <input
          type="range"
          min="0"
          max="0.6"
          step="0.02"
          value={card.transparency}
          onChange={(event) => onChange({ transparency: Number(event.target.value) })}
          className="w-full accent-cyan-300"
        />
      </Field>
    </div>
  )
}
