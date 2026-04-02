export default function FloatingContextMenu({
  visible,
  position,
  selectedElement,
  onAddText,
  onAddImage,
  onDelete,
  onBringForward,
  onSendBackward,
  onClose,
}) {
  if (!visible) {
    return null
  }

  const actions = selectedElement
    ? [
        { label: 'Bring Forward', onClick: onBringForward },
        { label: 'Send Backward', onClick: onSendBackward },
        { label: 'Delete Layer', onClick: onDelete, danger: true },
      ]
    : [
        { label: 'Add Text Layer', onClick: onAddText },
        { label: 'Add Image Layer', onClick: onAddImage },
      ]

  return (
    <div
      data-export-ignore="true"
      className="absolute z-50 w-52 overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-2 shadow-2xl backdrop-blur-xl animate-[fadeIn_.18s_ease-out]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-2 px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        Quick Actions
      </div>
      <div className="space-y-1">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => {
              action.onClick()
              onClose()
            }}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:translate-x-0.5 ${
              action.danger
                ? 'text-rose-600 hover:bg-rose-50'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
