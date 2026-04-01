import { useEffect, useLayoutEffect, useRef } from 'react'
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

function countLines(text) {
  return Math.max(1, text.split('\n').length)
}

export default function DraggableText({
  element,
  selected,
  isEditing,
  canvasRef,
  onSelect,
  onStartEditing,
  onStopEditing,
  onPreviewChange,
  onCommitChange,
  onTextInput,
  onContextMenu,
}) {
  const textareaRef = useRef(null)
  const measureRef = useRef(null)
  const elementRef = useRef(null)

  useEffect(() => {
    if (!selected || !isEditing || !textareaRef.current) {
      return
    }

    textareaRef.current.focus()
    const length = textareaRef.current.value.length
    textareaRef.current.setSelectionRange(length, length)
  }, [selected, isEditing])

  useLayoutEffect(() => {
    if (!selected || !measureRef.current || !textareaRef.current) {
      return
    }

    const measureRect = measureRef.current.getBoundingClientRect()
    const nextWidth = Math.max(measureRect.width + 8, 24)
    const nextHeight = Math.max(measureRect.height + 6, element.fontSize * element.lineHeight)

    textareaRef.current.style.width = `${nextWidth}px`
    textareaRef.current.style.height = `${nextHeight}px`
  }, [
    selected,
    element.text,
    element.fontFamily,
    element.fontSize,
    element.fontWeight,
    element.letterSpacing,
    element.lineHeight,
  ])

  function getElementBounds() {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    const elementRect = elementRef.current?.getBoundingClientRect()

    if (!canvasRect || !elementRect) {
      return null
    }

    return {
      canvasRect,
      widthPercent: (elementRect.width / canvasRect.width) * 100,
      heightPercent: (elementRect.height / canvasRect.height) * 100,
    }
  }

  function startMove(event) {
    if (isEditing || event.target.closest('[data-resize-handle="true"], [data-move-handle="true"]')) {
      return
    }

    event.stopPropagation()
    onSelect(element.id)

    const bounds = getElementBounds()
    if (!bounds) {
      return
    }

    const startX = event.clientX
    const startY = event.clientY
    const initial = { x: element.x, y: element.y }

    function handleMove(moveEvent) {
      const deltaX = ((moveEvent.clientX - startX) / bounds.canvasRect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / bounds.canvasRect.height) * 100

      onPreviewChange(element.id, {
        x: clamp(initial.x + deltaX, 0, 100 - bounds.widthPercent),
        y: clamp(initial.y + deltaY, 0, 100 - bounds.heightPercent),
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
    const initialX = element.x
    const initialY = element.y
    const initialFontSize = element.fontSize

    function handleMove(moveEvent) {
      const deltaX = ((moveEvent.clientX - startX) / canvasRect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / canvasRect.height) * 100
      const next = {}

      if (direction.includes('right')) {
        next.fontSize = clamp(initialFontSize + deltaX * 0.95, 12, 140)
      }

      if (direction.includes('left')) {
        next.fontSize = clamp(initialFontSize - deltaX * 0.95, 12, 140)
        next.x = clamp(initialX + deltaX, 0, 96)
      }

      if (direction.includes('top')) {
        next.y = clamp(initialY + deltaY, 0, 96)
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
      ref={elementRef}
      role="presentation"
      onPointerDown={startMove}
      onClick={(event) => {
        event.stopPropagation()
        if (!selected) {
          onSelect(element.id)
          return
        }

        if (!isEditing) {
          onStartEditing(element.id)
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onContextMenu?.(element.id, event.clientX, event.clientY)
      }}
      className={`group absolute transition ${
        selected ? 'ring-2 ring-white/85 ring-offset-2 ring-offset-slate-900/30' : ''
      }`}
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        color: element.color,
        fontFamily: element.fontFamily,
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight,
        letterSpacing: `${element.letterSpacing}px`,
        lineHeight: element.lineHeight,
        whiteSpace: 'pre',
      }}
    >
      {selected && isEditing ? (
        <>
          <textarea
            ref={textareaRef}
            value={element.text}
            wrap="off"
            rows={countLines(element.text)}
            onPointerDown={(event) => {
              event.stopPropagation()
              onSelect(element.id)
            }}
            onChange={(event) => onTextInput(element.id, event.target.value)}
            onBlur={() => {
              onStopEditing()
              onCommitChange()
            }}
            className="min-h-[1.2em] min-w-[1ch] resize-none overflow-hidden bg-transparent p-0 outline-none"
            style={{
              color: element.color,
              fontFamily: element.fontFamily,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              letterSpacing: `${element.letterSpacing}px`,
              lineHeight: element.lineHeight,
              whiteSpace: 'pre',
            }}
          />

          <div
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0"
            style={{
              fontFamily: element.fontFamily,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              letterSpacing: `${element.letterSpacing}px`,
              lineHeight: element.lineHeight,
              whiteSpace: 'pre',
            }}
          >
            {element.text || ' '}
          </div>
        </>
      ) : (
        <div className="cursor-crosshair whitespace-pre">{element.text}</div>
      )}

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
            aria-label="Move text"
          />
        </>
      ) : null}
    </div>
  )
}
