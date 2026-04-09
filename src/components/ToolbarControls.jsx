import { Download, Focus, ImagePlus, Layers3, Redo2, Shuffle, Undo2 } from 'lucide-react'

function IconAction({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  active = false,
  accent = 'default',
  tooltipPosition = 'right',
  theme = 'light',
}) {
  const accentClass =
    theme === 'dark'
      ? accent === 'primary'
        ? 'text-white hover:text-slate-200'
        : active
          ? 'text-white hover:text-slate-200'
          : 'text-slate-100 hover:text-white'
      : accent === 'primary'
        ? 'text-slate-950 hover:text-slate-700'
        : active
          ? 'text-slate-950 hover:text-slate-700'
          : 'text-slate-900 hover:text-slate-700'
  const tooltipClass =
    tooltipPosition === 'top'
      ? 'bottom-full left-1/2 mb-3 -translate-x-1/2'
      : 'left-full top-1/2 ml-3 -translate-y-1/2'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-transparent transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 ${accentClass}`}
    >
      <Icon size={19} strokeWidth={2.1} />
      <span
        className={`pointer-events-none absolute z-20 whitespace-nowrap rounded-xl border border-black/10 bg-black px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 ${tooltipClass}`}
      >
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
  theme = 'light',
}) {
  const tooltipPosition = orientation === 'vertical' ? 'right' : 'top'

  return (
    <div
      className={`text-white ${
        orientation === 'vertical'
          ? 'flex flex-col items-center gap-1.5'
          : 'flex flex-wrap items-center gap-1.5'
      }`}
    >
      <IconAction
        icon={ImagePlus}
        label="Add Shot"
        onClick={onAddShot}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Undo2}
        label="Undo"
        onClick={onUndo}
        disabled={!canUndo}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Redo2}
        label="Redo"
        onClick={onRedo}
        disabled={!canRedo}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Shuffle}
        label="Random Style"
        onClick={onRandomize}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Layers3}
        label="Bring Forward"
        onClick={onBringForward}
        disabled={!canLayer}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Layers3}
        label="Send Backward"
        onClick={onSendBackward}
        disabled={!canLayer}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Focus}
        label={isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
        onClick={onToggleFocusMode}
        active={isFocusMode}
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
      <IconAction
        icon={Download}
        label="Export PNG"
        onClick={onExport}
        accent="primary"
        tooltipPosition={tooltipPosition}
        theme={theme}
      />
    </div>
  )
}
