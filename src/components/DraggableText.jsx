import { useEffect, useLayoutEffect, useRef, useState } from 'react'

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
  const caretRef = useRef({ start: null, end: null })
  const holdTimerRef = useRef(null)
  const [boxSize, setBoxSize] = useState({ width: 32, height: 32 })

  useEffect(() => {
    if (!selected || !isEditing || !textareaRef.current) {
      return
    }

    textareaRef.current.focus()
  }, [selected, isEditing])

  useLayoutEffect(() => {
    if (!selected || !isEditing || !textareaRef.current) {
      return
    }

    const textarea = textareaRef.current
    const { start, end } = caretRef.current

    if (
      document.activeElement === textarea &&
      start !== null &&
      end !== null &&
      start <= textarea.value.length &&
      end <= textarea.value.length
    ) {
      textarea.setSelectionRange(start, end)
    }
  }, [selected, isEditing, element.text])

  useLayoutEffect(() => {
    if (!measureRef.current) {
      return
    }

    const measureRect = measureRef.current.getBoundingClientRect()
    const nextWidth = Math.max(Math.ceil(measureRect.width), 8)
    const nextHeight = Math.max(
      Math.ceil(measureRect.height),
      Math.ceil(element.fontSize * element.lineHeight),
    )

    setBoxSize((current) =>
      current.width === nextWidth && current.height === nextHeight
        ? current
        : { width: nextWidth, height: nextHeight },
    )
  }, [
    element.text,
    element.fontFamily,
    element.fontSize,
    element.fontWeight,
    element.letterSpacing,
    element.lineHeight,
  ])

  function getElementBounds() {
    const canvasRect = canvasRef.current?.getBoundingClientRect()

    if (!canvasRect) {
      return null
    }

    return { canvasRect }
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current)
      }
    }
  }, [])

  function startMove(event) {
    if (isEditing) {
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
    const isTouchPointer = event.pointerType === 'touch'
    let hasDragged = false
    let dragArmed = !isTouchPointer

    function clearHoldTimer() {
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current)
        holdTimerRef.current = null
      }
    }

    if (isTouchPointer) {
      holdTimerRef.current = window.setTimeout(() => {
        dragArmed = true
      }, 240)
    }

    function handleMove(moveEvent) {
      const movedEnough =
        Math.abs(moveEvent.clientX - startX) > 6 || Math.abs(moveEvent.clientY - startY) > 6

      if (isTouchPointer && !dragArmed) {
        if (movedEnough) {
          clearHoldTimer()
        }
        return
      }

      const deltaX = ((moveEvent.clientX - startX) / bounds.canvasRect.width) * 100
      const deltaY = ((moveEvent.clientY - startY) / bounds.canvasRect.height) * 100

      if (!movedEnough && !hasDragged) {
        return
      }

      moveEvent.preventDefault()
      hasDragged = true

      onPreviewChange(element.id, {
        x: initial.x + deltaX,
        y: initial.y + deltaY,
      })
    }

    function handleUp() {
      clearHoldTimer()

      if (!hasDragged && (!isTouchPointer || !dragArmed)) {
        onStartEditing(element.id)
      } else if (hasDragged) {
        onCommitChange()
      }
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  return (
    <div
      ref={elementRef}
      data-layer-root="true"
      role="presentation"
      onPointerDown={startMove}
      onClick={(event) => {
        event.stopPropagation()
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onContextMenu?.(element.id, event.clientX, event.clientY)
      }}
      className="absolute"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${boxSize.width}px`,
        height: `${boxSize.height}px`,
        color: element.color,
        fontFamily: element.fontFamily,
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight,
        letterSpacing: `${element.letterSpacing}px`,
        lineHeight: element.lineHeight,
        whiteSpace: 'pre',
        fontKerning: 'none',
        fontVariantLigatures: 'none',
        textRendering: 'geometricPrecision',
        overflow: 'visible',
      }}
    >
      {selected ? (
        <div className="pointer-events-none absolute inset-0 border-2 border-white/85" />
      ) : null}

      {selected && isEditing ? (
        <textarea
          ref={textareaRef}
          value={element.text}
          wrap="off"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          onPointerDown={(event) => {
            event.stopPropagation()
            onSelect(element.id)
          }}
          onClick={(event) => {
            event.stopPropagation()
            const target = event.currentTarget
            caretRef.current = {
              start: target.selectionStart,
              end: target.selectionEnd,
            }
          }}
          onKeyUp={(event) => {
            const target = event.currentTarget
            caretRef.current = {
              start: target.selectionStart,
              end: target.selectionEnd,
            }
          }}
          onSelect={(event) => {
            const target = event.currentTarget
            caretRef.current = {
              start: target.selectionStart,
              end: target.selectionEnd,
            }
          }}
          onChange={(event) => {
            const target = event.currentTarget
            caretRef.current = {
              start: target.selectionStart,
              end: target.selectionEnd,
            }
            onTextInput(element.id, target.value)
          }}
          onBlur={() => {
            caretRef.current = { start: null, end: null }
            onStopEditing()
            onCommitChange()
          }}
          className="resize-none overflow-hidden bg-transparent p-0 outline-none"
          style={{
            width: '100%',
            height: '100%',
            color: element.color,
            caretColor: element.color,
            cursor: 'text',
            fontFamily: element.fontFamily,
            fontSize: `${element.fontSize}px`,
            fontWeight: element.fontWeight,
            letterSpacing: `${element.letterSpacing}px`,
            lineHeight: element.lineHeight,
            whiteSpace: 'pre',
            display: 'block',
            fontKerning: 'none',
            fontVariantLigatures: 'none',
            textRendering: 'geometricPrecision',
          }}
        />
      ) : (
        <div
          className="h-full w-full cursor-move whitespace-pre"
          style={{
            color: element.color,
            fontFamily: element.fontFamily,
            fontSize: `${element.fontSize}px`,
            fontWeight: element.fontWeight,
            letterSpacing: `${element.letterSpacing}px`,
            lineHeight: element.lineHeight,
            fontKerning: 'none',
            fontVariantLigatures: 'none',
            textRendering: 'geometricPrecision',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'none',
          }}
        >
          {element.text}
        </div>
      )}

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
          display: 'inline-block',
          width: 'max-content',
          fontKerning: 'none',
          fontVariantLigatures: 'none',
          textRendering: 'geometricPrecision',
        }}
      >
        {element.text || ' '}
      </div>
    </div>
  )
}
