import { Download, Layers3, Redo2, Shuffle, Undo2 } from 'lucide-react'

function ActionButton({ icon: Icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.62] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

export default function ToolbarControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRandomize,
  onBringForward,
  onSendBackward,
  canLayer,
  onExport,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ActionButton icon={Undo2} label="Undo" onClick={onUndo} disabled={!canUndo} />
      <ActionButton icon={Redo2} label="Redo" onClick={onRedo} disabled={!canRedo} />
      <ActionButton icon={Shuffle} label="Random Style" onClick={onRandomize} />
      <ActionButton
        icon={Layers3}
        label="Bring Forward"
        onClick={onBringForward}
        disabled={!canLayer}
      />
      <ActionButton
        icon={Layers3}
        label="Send Backward"
        onClick={onSendBackward}
        disabled={!canLayer}
      />
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-500"
      >
        <Download size={16} />
        Export PNG
      </button>
    </div>
  )
}
