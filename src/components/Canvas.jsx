import { useLayoutEffect, useRef, useState } from 'react'
import DraggableImage from './DraggableImage'
import DraggableText from './DraggableText'
import FloatingContextMenu from './FloatingContextMenu'
import { cardRatioOptions, getShadowClass } from '../utils'

function getBackgroundStyle(background) {
  if (background.customBackground) {
    return {
      background: background.customBackground,
      opacity: background.opacity,
    }
  }

  if (background.type === 'gradient') {
    const colors = background.useThirdColor
      ? background.gradientColors
      : background.gradientColors.slice(0, 2)

    return {
      background: `linear-gradient(${background.gradientDirection}, ${colors.join(', ')})`,
      opacity: background.opacity,
    }
  }

  if (background.type === 'image' && background.image) {
    return {
      backgroundImage: `url(${background.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: background.opacity,
      filter: `blur(${background.blur}px)`,
      transform: background.blur ? 'scale(1.06)' : 'scale(1)',
    }
  }

  return {
    backgroundColor: background.solidColor,
    opacity: background.opacity,
  }
}

function getOverlayClass(overlay) {
  if (overlay === 'dark') {
    return 'bg-[linear-gradient(180deg,rgba(2,6,23,0.05),rgba(2,6,23,0.5))]'
  }

  if (overlay === 'light') {
    return 'bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,255,255,0.08))]'
  }

  return ''
}

function getNoiseStyle(intensity = 0) {
  const clampedIntensity = Math.max(0, Math.min(intensity, 100))
  const normalizedIntensity = clampedIntensity / 100
  const contrast = 1.1 + normalizedIntensity * 3.4
  const brightness = 1.01 + normalizedIntensity * 0.12

  return {
    filter: `contrast(${contrast}) brightness(${brightness})`,
  }
}

export default function Canvas({
  design,
  selectedId,
  editingTextId,
  onSelect,
  onStartEditing,
  onStopEditing,
  canvasRef,
  onPreviewElementChange,
  onCommitElementChange,
  onTextInput,
  onContextMenu,
  contextMenu,
  onCloseContextMenu,
  onAddText,
  onAddImage,
  onDeleteSelected,
  onBringForward,
  onSendBackward,
  portraitMode = false,
}) {
  const backgroundStyle = getBackgroundStyle(design.background)
  const selectedRatio =
    cardRatioOptions.find((option) => option.value === design.card.ratio) ??
    cardRatioOptions[0]
  const ratioWidth =
    design.card.layout === 'vertical'
      ? selectedRatio.height
      : selectedRatio.width
  const ratioHeight =
    design.card.layout === 'vertical'
      ? selectedRatio.width
      : selectedRatio.height
  const previewAreaRef = useRef(null)
  const [previewBounds, setPreviewBounds] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const node = previewAreaRef.current

    if (!node) {
      return undefined
    }

    function updateBounds() {
      setPreviewBounds({
        width: node.clientWidth,
        height: node.clientHeight,
      })
    }

    updateBounds()

    const resizeObserver = new ResizeObserver(() => {
      updateBounds()
    })

    resizeObserver.observe(node)
    window.addEventListener('resize', updateBounds)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateBounds)
    }
  }, [])

  const availableWidth = Math.max(previewBounds.width, 1)
  const availableHeight = Math.max(previewBounds.height, 1)
  const scale = Math.min(availableWidth / ratioWidth, availableHeight / ratioHeight)
  const fittedCardWidth = Math.max(1, Math.floor(ratioWidth * scale))
  const fittedCardHeight = Math.max(1, Math.floor(ratioHeight * scale))

  function isBlankCanvasEventTarget(target) {
    return !(target instanceof Element) || !target.closest('[data-layer-root="true"]')
  }

  return (
    <div
      className={`relative flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden ${
        portraitMode
          ? 'bg-transparent p-0'
          : 'rounded-[2rem] border border-white/50 bg-[#f7efe1] p-3 shadow-panel backdrop-blur-xl'
      }`}
    >
        <div
          className={`relative ${
            portraitMode
              ? 'h-full w-full'
              : 'h-full w-full'
          }`}
          ref={previewAreaRef}
          style={{
            maxHeight: '100%',
          }}
        >
        <div
          ref={canvasRef}
          role="presentation"
          onClick={(event) => {
            if (!isBlankCanvasEventTarget(event.target)) {
              return
            }

            onStopEditing?.()
            onSelect(null)
            onCloseContextMenu?.()
          }}
          onContextMenu={(event) => {
            if (!isBlankCanvasEventTarget(event.target)) {
              return
            }

            event.preventDefault()
            onContextMenu?.(null, event.clientX, event.clientY)
          }}
          className={`relative overflow-hidden bg-canvas ${getShadowClass(
            design.card.shadow,
          )}`}
          style={{
            borderRadius: `${design.card.borderRadius}px`,
            width: `${fittedCardWidth}px`,
            height: `${fittedCardHeight}px`,
            position: 'absolute',
            inset: '50% auto auto 50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              ...backgroundStyle,
              filter:
                design.background.type !== 'image'
                  ? `blur(${design.background.blur}px)`
                  : backgroundStyle.filter,
              transform:
                design.background.blur > 0
                  ? 'scale(1.04)'
                  : backgroundStyle.transform,
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: `rgba(255,255,255,${design.card.transparency})`,
            }}
          />

          {design.background.overlay !== 'none' ? (
            <div className={`pointer-events-none absolute inset-0 ${getOverlayClass(design.background.overlay)}`} />
          ) : null}

          <div
            className="absolute inset-0"
            style={{
              padding: `${design.card.padding}px`,
            }}
          >
            {design.elements.map((element) =>
              element.type === 'text' ? (
                <DraggableText
                  key={element.id}
                  element={element}
                  selected={selectedId === element.id}
                  isEditing={editingTextId === element.id}
                  canvasRef={canvasRef}
                  onSelect={onSelect}
                  onStartEditing={onStartEditing}
                  onStopEditing={onStopEditing}
                  onPreviewChange={onPreviewElementChange}
                  onCommitChange={onCommitElementChange}
                  onTextInput={onTextInput}
                  onContextMenu={onContextMenu}
                />
              ) : (
                <DraggableImage
                  key={element.id}
                  element={element}
                  selected={selectedId === element.id}
                  canvasRef={canvasRef}
                  onSelect={onSelect}
                  onPreviewChange={onPreviewElementChange}
                  onCommitChange={onCommitElementChange}
                  onContextMenu={onContextMenu}
                />
              ),
            )}
          </div>

          {design.export.watermark ? (
            <div className="pointer-events-none absolute bottom-4 right-5 rounded-full bg-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
              Crafted in Studio Card
            </div>
          ) : null}

          {(design.background.noise ?? 0) > 0 ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  ...getNoiseStyle(design.background.noise),
                  opacity: 0.05 + design.background.noise / 240,
                  mixBlendMode: 'screen',
                }}
                aria-hidden="true"
              >
                <filter id="card-grain-filter-light">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="1.65"
                    numOctaves="2"
                    seed="7"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncA type="table" tableValues="0 0.3 0.75 1" />
                  </feComponentTransfer>
                </filter>
                <rect
                  width="100%"
                  height="100%"
                  fill="white"
                  filter="url(#card-grain-filter-light)"
                />
              </svg>

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  ...getNoiseStyle(design.background.noise),
                  opacity: 0.04 + design.background.noise / 260,
                  mixBlendMode: 'multiply',
                }}
                aria-hidden="true"
              >
                <filter id="card-grain-filter-dark">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="1.8"
                    numOctaves="2"
                    seed="11"
                    stitchTiles="stitch"
                  />
                  <feColorMatrix type="saturate" values="0" />
                  <feComponentTransfer>
                    <feFuncA type="table" tableValues="0 0.26 0.7 1" />
                  </feComponentTransfer>
                </filter>
                <rect
                  width="100%"
                  height="100%"
                  fill="black"
                  filter="url(#card-grain-filter-dark)"
                />
              </svg>
            </div>
          ) : null}

          <FloatingContextMenu
            visible={contextMenu.visible}
            position={contextMenu.position}
            selectedElement={contextMenu.targetId ? design.elements.find((element) => element.id === contextMenu.targetId) : null}
            onAddText={onAddText}
            onAddImage={onAddImage}
            onDelete={onDeleteSelected}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onClose={onCloseContextMenu}
          />
        </div>
      </div>
    </div>
  )
}
