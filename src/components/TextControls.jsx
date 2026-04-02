import { fontOptions } from '../utils'

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      {children}
    </label>
  )
}

export default function TextControls({
  text,
  selectedElement,
  onGlobalChange,
  onElementChange,
}) {
  const target = selectedElement?.type === 'text' ? selectedElement : text

  return (
    <div className="space-y-5">
      <Field label="Font family">
        <select
          value={target.fontFamily}
          onChange={(event) => {
            const value = event.target.value
            if (selectedElement?.type === 'text') {
              onElementChange({ fontFamily: value })
            } else {
              onGlobalChange({ fontFamily: value })
            }
          }}
          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`Font size: ${Math.round(target.fontSize)}px`}>
        <input
          type="range"
          min="12"
          max="120"
          value={target.fontSize}
          onChange={(event) => {
            const value = Number(event.target.value)
            if (selectedElement?.type === 'text') {
              onElementChange({ fontSize: value })
            } else {
              onGlobalChange({ fontSize: value })
            }
          }}
          className="w-full accent-cyan-300"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.06] p-1">
            {[400, 500, 600, 700, 800].map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => {
                  if (selectedElement?.type === 'text') {
                    onElementChange({ fontWeight: weight })
                  } else {
                    onGlobalChange({ fontWeight: weight })
                  }
                }}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                  target.fontWeight === weight
                    ? 'bg-cyan-300 text-slate-950'
                    : 'text-slate-200'
                }`}
              >
                {weight}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Text color">
          <input
            type="color"
            value={target.color}
            onChange={(event) => {
              const value = event.target.value
              if (selectedElement?.type === 'text') {
                onElementChange({ color: value })
              } else {
                onGlobalChange({ color: value })
              }
            }}
            className="h-12 w-full rounded-2xl border border-white/10 bg-transparent"
          />
        </Field>
      </div>

      <Field label={`Letter spacing: ${target.letterSpacing}px`}>
        <input
          type="range"
          min="-2"
          max="12"
          step="0.5"
          value={target.letterSpacing}
          onChange={(event) => {
            const value = Number(event.target.value)
            if (selectedElement?.type === 'text') {
              onElementChange({ letterSpacing: value })
            } else {
              onGlobalChange({ letterSpacing: value })
            }
          }}
          className="w-full accent-cyan-300"
        />
      </Field>

      <Field label={`Line height: ${target.lineHeight.toFixed(2)}`}>
        <input
          type="range"
          min="0.8"
          max="2"
          step="0.05"
          value={target.lineHeight}
          onChange={(event) => {
            const value = Number(event.target.value)
            if (selectedElement?.type === 'text') {
              onElementChange({ lineHeight: value })
            } else {
              onGlobalChange({ lineHeight: value })
            }
          }}
          className="w-full accent-cyan-300"
        />
      </Field>

      {selectedElement?.type === 'text' ? (
        <Field label="Selected text content">
          <textarea
            rows="4"
            value={selectedElement.text}
            onChange={(event) => onElementChange({ text: event.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white outline-none"
          />
        </Field>
      ) : (
        <p className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-slate-200">
          Select a text layer to edit its content directly. Otherwise, these
          settings become the default for newly added text.
        </p>
      )}
    </div>
  )
}
