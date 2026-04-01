import { gradientDirections } from '../utils'

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

export default function BackgroundControls({ background, onChange, onImageUpload }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
        {['solid', 'gradient', 'image'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange({ type })}
            className={`rounded-2xl px-3 py-2 text-sm font-semibold capitalize transition ${
              background.type === type
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {background.type === 'solid' ? (
        <Field label="Solid color">
          <input
            type="color"
            value={background.solidColor}
            onChange={(event) => onChange({ solidColor: event.target.value })}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-transparent"
          />
        </Field>
      ) : null}

      {background.type === 'gradient' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Color one">
              <input
                type="color"
                value={background.gradientColors[0]}
                onChange={(event) =>
                  onChange({
                    gradientColors: [
                      event.target.value,
                      background.gradientColors[1],
                      background.gradientColors[2],
                    ],
                  })
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-transparent"
              />
            </Field>
            <Field label="Color two">
              <input
                type="color"
                value={background.gradientColors[1]}
                onChange={(event) =>
                  onChange({
                    gradientColors: [
                      background.gradientColors[0],
                      event.target.value,
                      background.gradientColors[2],
                    ],
                  })
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-transparent"
              />
            </Field>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={background.useThirdColor}
              onChange={(event) => onChange({ useThirdColor: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-slate-900"
            />
            Add a third gradient color
          </label>

          {background.useThirdColor ? (
            <Field label="Color three">
              <input
                type="color"
                value={background.gradientColors[2]}
                onChange={(event) =>
                  onChange({
                    gradientColors: [
                      background.gradientColors[0],
                      background.gradientColors[1],
                      event.target.value,
                    ],
                  })
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-transparent"
              />
            </Field>
          ) : null}

          <Field label="Direction">
            <select
              value={background.gradientDirection}
              onChange={(event) =>
                onChange({ gradientDirection: event.target.value })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              {gradientDirections.map((direction) => (
                <option key={direction.value} value={direction.value}>
                  {direction.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      ) : null}

      {background.type === 'image' ? (
        <Field label="Background image">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500"
          />
        </Field>
      ) : null}

      <Field label={`Blur intensity: ${background.blur}px`}>
        <input
          type="range"
          min="0"
          max="28"
          value={background.blur}
          onChange={(event) => onChange({ blur: Number(event.target.value) })}
          className="w-full accent-slate-900"
        />
      </Field>

      <Field label="Overlay">
        <select
          value={background.overlay}
          onChange={(event) => onChange({ overlay: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
        >
          <option value="none">None</option>
          <option value="dark">Dark glow</option>
          <option value="light">Light sheen</option>
        </select>
      </Field>

      <Field label={`Opacity: ${Math.round(background.opacity * 100)}%`}>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          value={background.opacity}
          onChange={(event) => onChange({ opacity: Number(event.target.value) })}
          className="w-full accent-slate-900"
        />
      </Field>
    </div>
  )
}
