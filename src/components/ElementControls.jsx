function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      {children}
    </label>
  )
}

export default function ElementControls({
  elements,
  selectedElement,
  onSelect,
  onAddText,
  onAddImage,
  onDelete,
  onElementChange,
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onAddText}
          className="rounded-2xl border border-cyan-300/35 bg-cyan-300/18 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:-translate-y-0.5 hover:bg-cyan-300/24"
        >
          Add Text
        </button>
        <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/35">
          Add Image
          <input type="file" accept="image/*" className="hidden" onChange={onAddImage} />
        </label>
      </div>

      {selectedElement ? (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-2xl bg-red-500 hover:bg-red-600 transition px-4 py-3 text-sm font-semibold text-white shadow-md"
          >
            Delete Selected Element
          </button>

          {selectedElement.type === 'image' ? (
            <div className="space-y-4">
              <Field label={`Corner radius: ${selectedElement.radius ?? 0}px`}>
                <input
                  type="range"
                  min="0"
                  max="999"
                  value={selectedElement.radius ?? 0}
                  onChange={(event) =>
                    onElementChange({
                      radius: Number(event.target.value),
                    })
                  }
                  className="w-full accent-cyan-300"
                />
              </Field>

              <Field label="Resize mode">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.06] p-1">
                  {[
                    { label: 'Ratio', value: 'ratio' },
                    { label: 'Side', value: 'side' },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => onElementChange({ resizeMode: mode.value })}
                      className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                        (selectedElement.resizeMode ?? 'ratio') === mode.value
                          ? 'bg-cyan-300 text-slate-950'
                          : 'text-slate-200'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </Field>

              {(selectedElement.resizeMode ?? 'ratio') === 'ratio' ? (
                <Field label={`Scale evenly: ${Math.round(selectedElement.width)}%`}>
                  <input
                    type="range"
                    min="8"
                    max="90"
                    value={selectedElement.width}
                    onChange={(event) => {
                      const next = Number(event.target.value)
                      const ratio =
                        selectedElement.height / Math.max(selectedElement.width, 0.01)

                      onElementChange({
                        width: next,
                        height: Math.max(8, Math.min(90, next * ratio)),
                      })
                    }}
                    className="w-full accent-cyan-300"
                  />
                </Field>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Field label={`Width: ${Math.round(selectedElement.width)}%`}>
                    <input
                      type="range"
                      min="8"
                      max="90"
                      value={selectedElement.width}
                      onChange={(event) =>
                        onElementChange({ width: Number(event.target.value) })
                      }
                      className="w-full accent-cyan-300"
                    />
                  </Field>
                  <Field label={`Height: ${Math.round(selectedElement.height)}%`}>
                    <input
                      type="range"
                      min="8"
                      max="90"
                      value={selectedElement.height}
                      onChange={(event) =>
                        onElementChange({ height: Number(event.target.value) })
                      }
                      className="w-full accent-cyan-300"
                    />
                  </Field>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <Field label="Layers">
        <div className="space-y-2">
          {[...elements].reverse().map((element) => {
            const isActive = selectedElement?.id === element.id

            return (
              <button
                key={element.id}
                type="button"
                onClick={() => onSelect(element.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-cyan-300/45 bg-cyan-300/18 text-white'
                    : 'border-white/10 bg-white/[0.05] text-white'
                }`}
              >
                <span className="font-semibold capitalize">{element.type}</span>
                <span className="max-w-[10rem] truncate text-xs opacity-80">
                  {element.type === 'text' ? element.text : 'Image layer'}
                </span>
              </button>
            )
          })}
        </div>
      </Field>
    </div>
  )
}
