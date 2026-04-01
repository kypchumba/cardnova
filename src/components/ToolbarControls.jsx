import { Download, Layers3, Redo2, Shuffle, Undo2 } from 'lucide-react'

function ActionButton({ icon: Icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
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
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
      >
        <Download size={16} />
        Export PNG
      </button>
    </div>
  )
}
