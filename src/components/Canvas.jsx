import DraggableImage from './DraggableImage'
import DraggableText from './DraggableText'
import FloatingContextMenu from './FloatingContextMenu'
import { cardRatioOptions, getShadowClass } from '../utils'

function getBackgroundStyle(background) {
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
  const ratioValue = `${ratioWidth} / ${ratioHeight}`
  const fitCardStyle =
    ratioWidth >= ratioHeight
      ? {
          width: '100%',
          height: 'auto',
          aspectRatio: ratioValue,
        }
      : {
          width: 'auto',
          height: '100%',
          aspectRatio: ratioValue,
        }

  function isBlankCanvasEventTarget(target) {
    return !(target instanceof Element) || !target.closest('[data-layer-root="true"]')
  }

  return (
    <div className="flex min-h-[30rem] flex-1 items-center justify-center overflow-hidden rounded-[2rem] border border-white/60 bg-white/50 p-4 shadow-panel backdrop-blur-xl lg:p-5">
        <div
          className="relative aspect-square"
          style={{
            width: 'min(100%, calc(100dvh - 8rem))',
            maxWidth: '1120px',
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
            ...fitCardStyle,
            borderRadius: `${design.card.borderRadius}px`,
            position: 'absolute',
            inset: '50% auto auto 50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '100%',
            maxHeight: '100%',
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
