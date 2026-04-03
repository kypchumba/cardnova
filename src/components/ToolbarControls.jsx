import { Download, Focus, ImagePlus, Layers3, Redo2, Shuffle, Undo2 } from 'lucide-react'

function IconAction({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  active = false,
  accent = 'default',
}) {
  const accentClass =
    accent === 'primary'
      ? 'text-slate-950 hover:text-slate-700'
      : active
        ? 'text-slate-950 hover:text-slate-700'
        : 'text-slate-900 hover:text-slate-700'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-transparent transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 ${accentClass}`}
    >
      <Icon size={19} strokeWidth={2.1} />
      <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-xl border border-black/10 bg-white/96 px-3 py-1.5 text-xs font-semibold text-slate-950 opacity-0 shadow-lg transition duration-150 group-hover:opacity-100">
        {label}
      </span>
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
  onAddShot,
  onToggleFocusMode,
  isFocusMode,
  orientation = 'horizontal',
}) {
  return (
    <div
      className={`text-white ${
        orientation === 'vertical'
          ? 'flex flex-col items-center gap-1.5'
          : 'flex flex-wrap items-center gap-1.5'
      }`}
    >
      <IconAction icon={ImagePlus} label="Add Shot" onClick={onAddShot} />
      <IconAction icon={Undo2} label="Undo" onClick={onUndo} disabled={!canUndo} />
      <IconAction icon={Redo2} label="Redo" onClick={onRedo} disabled={!canRedo} />
      <IconAction icon={Shuffle} label="Random Style" onClick={onRandomize} />
      <IconAction
        icon={Layers3}
        label="Bring Forward"
        onClick={onBringForward}
        disabled={!canLayer}
      />
      <IconAction
        icon={Layers3}
        label="Send Backward"
        onClick={onSendBackward}
        disabled={!canLayer}
      />
      <IconAction
        icon={Focus}
        label={isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
        onClick={onToggleFocusMode}
        active={isFocusMode}
      />
      <IconAction
        icon={Download}
        label="Export PNG"
        onClick={onExport}
        accent="primary"
      />
    </div>
  )
}
