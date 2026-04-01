function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
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
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        Press <span className="font-semibold text-slate-900">Delete</span> or{' '}
        <span className="font-semibold text-slate-900">Backspace</span> to remove
        the selected layer. Right-click anywhere on the preview to jump back here.
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onAddText}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Add Text
        </button>
        <label className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
          Add Image
          <input type="file" accept="image/*" className="hidden" onChange={onAddImage} />
        </label>
      </div>

      {selectedElement ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
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
                  className="w-full accent-slate-900"
                />
              </Field>

              <Field label="Resize mode">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1">
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
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500'
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
                    className="w-full accent-slate-900"
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
                      className="w-full accent-slate-900"
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
                      className="w-full accent-slate-900"
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
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600'
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
