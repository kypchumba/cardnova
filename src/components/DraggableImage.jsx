import { clamp } from '../utils'

function ResizeHandle({ direction, onPointerDown, className }) {
  return (
    <button
      type="button"
      data-resize-handle="true"
      data-export-ignore="true"
      onPointerDown={(event) => onPointerDown(event, direction)}
      className={`absolute z-10 bg-transparent ${className}`}
      aria-label={`Resize ${direction}`}
    />
  )
}

export default function DraggableImage({
  element,
  selected,
  canvasRef,
  onSelect,
  onPreviewChange,
  onCommitChange,
  onContextMenu,
}) {
  function startMove(event) {
    if (event.target.closest('[data-resize-handle="true"], [data-move-handle="true"]')) {
      return
    }

    event.stopPropagation()
    onSelect(element.id)

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) {
      return
    }

    const startX = event.clientX
    const startY = event.clientY
    const initial = { x: element.x, y: element.y }

    function handleMove(moveEvent) {
      const deltaX = ((moveEvent.clientX - startX) / canvasRect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / canvasRect.height) * 100

      onPreviewChange(element.id, {
        x: clamp(initial.x + deltaX, 0, 100 - element.width),
        y: clamp(initial.y + deltaY, 0, 100 - element.height),
      })
    }

    function handleUp() {
      onCommitChange()
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  function startResize(event, direction) {
    event.stopPropagation()
    onSelect(element.id)

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) {
      return
    }

    const startX = event.clientX
    const startY = event.clientY
    const initialWidth = element.width
    const initialHeight = element.height
    const initialX = element.x
    const initialY = element.y
    const resizeMode = element.resizeMode ?? 'ratio'
    const aspectRatio = initialWidth / Math.max(initialHeight, 0.01)

    function handleMove(moveEvent) {
      const deltaX = ((moveEvent.clientX - startX) / canvasRect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / canvasRect.height) * 100
      const next = {}

      if (resizeMode === 'ratio') {
        const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY
        const nextWidth = clamp(initialWidth + delta, 8, 90)
        const nextHeight = clamp(nextWidth / aspectRatio, 8, 90)

        next.width = nextWidth
        next.height = nextHeight

        if (direction.includes('left')) {
          next.x = clamp(initialX + (initialWidth - nextWidth), 0, 100 - nextWidth)
        }

        if (direction.includes('top')) {
          next.y = clamp(initialY + (initialHeight - nextHeight), 0, 100 - nextHeight)
        }

        onPreviewChange(element.id, next)
        return
      }

      if (direction.includes('right')) {
        next.width = clamp(initialWidth + deltaX, 8, 90)
      }

      if (direction.includes('left')) {
        next.width = clamp(initialWidth - deltaX, 8, 90)
        next.x = clamp(initialX + deltaX, 0, initialX + initialWidth - 8)
      }

      if (direction.includes('bottom')) {
        next.height = clamp(initialHeight + deltaY, 8, 90)
      }

      if (direction.includes('top')) {
        next.height = clamp(initialHeight - deltaY, 8, 90)
        next.y = clamp(initialY + deltaY, 0, initialY + initialHeight - 8)
      }

      onPreviewChange(element.id, next)
    }

    function handleUp() {
      onCommitChange()
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <div
      role="presentation"
      onPointerDown={startMove}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(element.id)
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onContextMenu?.(element.id, event.clientX, event.clientY)
      }}
      className={`group absolute overflow-hidden transition ${
        selected ? 'ring-2 ring-white/90 ring-offset-2 ring-offset-slate-900/30' : ''
      }`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        borderRadius: `${element.radius ?? 22}px`,
      }}
    >
      <img
        src={element.src}
        alt={element.alt || 'Card element'}
        className="h-full w-full cursor-crosshair object-cover"
        draggable="false"
      />
      {selected ? (
        <>
          <ResizeHandle
            direction="top"
            onPointerDown={startResize}
            className="-top-1 left-2 right-2 h-2 cursor-n-resize"
          />
          <ResizeHandle
            direction="right"
            onPointerDown={startResize}
            className="bottom-2 -right-1 top-2 w-2 cursor-e-resize"
          />
          <ResizeHandle
            direction="bottom"
            onPointerDown={startResize}
            className="-bottom-1 left-2 right-2 h-2 cursor-s-resize"
          />
          <ResizeHandle
            direction="left"
            onPointerDown={startResize}
            className="bottom-2 -left-1 top-2 w-2 cursor-w-resize"
          />
          <ResizeHandle
            direction="top-right"
            onPointerDown={startResize}
            className="-right-1 -top-1 h-3 w-3 cursor-ne-resize"
          />
          <ResizeHandle
            direction="top-left"
            onPointerDown={startResize}
            className="-left-1 -top-1 h-3 w-3 cursor-nw-resize"
          />
          <ResizeHandle
            direction="bottom-right"
            onPointerDown={startResize}
            className="-right-1 -bottom-1 h-3 w-3 cursor-se-resize"
          />
          <ResizeHandle
            direction="bottom-left"
            onPointerDown={startResize}
            className="-left-1 -bottom-1 h-3 w-3 cursor-sw-resize"
          />
          <button
            type="button"
            data-move-handle="true"
            data-export-ignore="true"
            onPointerDown={startMove}
            className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full border-2 border-white bg-slate-900 shadow-lg transition hover:scale-110 active:scale-95"
            aria-label="Move image"
          />
        </>
      ) : null}
    </div>
  )
}
