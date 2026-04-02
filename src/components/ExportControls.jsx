function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      {children}
    </label>
  )
}

export default function ExportControls({ exportOptions, onChange, onExport, isExporting }) {
  return (
    <div className="space-y-5">
      <Field label="Export quality">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
          <input
            type="checkbox"
            checked={exportOptions.highResolution}
            onChange={(event) =>
              onChange({ highResolution: event.target.checked })
            }
            className="h-4 w-4 rounded border-white/20 text-cyan-300"
          />
          Enable high-resolution PNG export
        </label>
      </Field>

      <Field label="Watermark">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white">
          <input
            type="checkbox"
            checked={exportOptions.watermark}
            onChange={(event) => onChange({ watermark: event.target.checked })}
            className="h-4 w-4 rounded border-white/20 text-cyan-300"
          />
          Show subtle product watermark on the card
        </label>
      </Field>

      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        className="w-full rounded-2xl border border-blue-400/40 bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:opacity-60"
      >
        {isExporting ? 'Rendering PNG...' : 'Download as PNG'}
      </button>
    </div>
  )
}
