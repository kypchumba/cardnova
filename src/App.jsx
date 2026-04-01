import { useEffect, useRef, useState, startTransition } from 'react'
import { toBlob } from 'html-to-image'
import { Menu, X } from 'lucide-react'
import BackgroundControls from './components/BackgroundControls'
import Canvas from './components/Canvas'
import CardStyleControls from './components/CardStyleControls'
import ElementControls from './components/ElementControls'
import ExportControls from './components/ExportControls'
import Sidebar from './components/Sidebar'
import TextControls from './components/TextControls'
import ToastStack from './components/ToastStack'
import ToolbarControls from './components/ToolbarControls'
import {
  defaultDesign,
  fontOptions,
  randomFrom,
  readFileAsDataUrl,
  reorderElements,
} from './utils'

const STORAGE_KEY = 'business-card-generator-design'

const randomPalettes = [
  {
    type: 'gradient',
    solidColor: '#f3efe7',
    gradientColors: ['#12213f', '#0f766e', '#f0ab3d'],
    gradientDirection: '135deg',
    useThirdColor: true,
    overlay: 'dark',
  },
  {
    type: 'solid',
    solidColor: '#f8f2ec',
    gradientColors: ['#0f172a', '#2563eb', '#e2e8f0'],
    gradientDirection: 'to right',
    useThirdColor: false,
    overlay: 'light',
  },
  {
    type: 'gradient',
    solidColor: '#0b1120',
    gradientColors: ['#3f1d38', '#bc4749', '#f2e8cf'],
    gradientDirection: '45deg',
    useThirdColor: true,
    overlay: 'none',
  },
]

function loadInitialDesign() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultDesign
  } catch {
    return defaultDesign
  }
}

function createExportClone(sourceNode, width, height) {
  const exportRoot = document.createElement('div')
  exportRoot.style.position = 'fixed'
  exportRoot.style.left = '-100000px'
  exportRoot.style.top = '0'
  exportRoot.style.pointerEvents = 'none'
  exportRoot.style.opacity = '0'
  exportRoot.style.width = `${width}px`
  exportRoot.style.height = `${height}px`

  const clone = sourceNode.cloneNode(true)
  clone.style.position = 'relative'
  clone.style.inset = 'auto'
  clone.style.transform = 'none'
  clone.style.maxWidth = 'none'
  clone.style.maxHeight = 'none'
  clone.style.width = `${width}px`
  clone.style.height = `${height}px`
  clone.style.margin = '0'

  exportRoot.appendChild(clone)
  document.body.appendChild(exportRoot)

  return {
    clone,
    cleanup() {
      exportRoot.remove()
    },
  }
}

export default function App() {
  const [design, setDesign] = useState(loadInitialDesign)
  const [selectedId, setSelectedId] = useState(defaultDesign.elements[0]?.id ?? null)
  const [editingTextId, setEditingTextId] = useState(null)
  const [activeSection, setActiveSection] = useState('background')
  const [history, setHistory] = useState({ past: [], future: [] })
  const [isExporting, setIsExporting] = useState(false)
  const [toasts, setToasts] = useState([])
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    targetId: null,
  })
  const canvasRef = useRef(null)
  const designRef = useRef(design)
  const interactionSnapshotRef = useRef(null)

  const selectedElement =
    design.elements.find((element) => element.id === selectedId) ?? null

  useEffect(() => {
    designRef.current = design
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design))
  }, [design])

  useEffect(() => {
    if (selectedId && !design.elements.some((element) => element.id === selectedId)) {
      setSelectedId(design.elements[design.elements.length - 1]?.id ?? null)
      if (editingTextId === selectedId) {
        setEditingTextId(null)
      }
    }
  }, [design.elements, selectedId, editingTextId])

  useEffect(() => {
    function handlePointerDown() {
      setContextMenu((current) => ({ ...current, visible: false }))
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      if (isTypingTarget || !selectedId) {
        return
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelectedElement()
        setActiveSection('elements')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, design.elements])

  function commitChange(updater) {
    setDesign((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      setHistory((historyState) => ({
        past: [...historyState.past.slice(-29), current],
        future: [],
      }))
      return next
    })
  }

  function pushToast(title, message = '') {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((current) => [...current, { id, title, message }].slice(-4))
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 1800)
  }

  function beginInteraction() {
    if (!interactionSnapshotRef.current) {
      interactionSnapshotRef.current = JSON.stringify(designRef.current)
    }
  }

  function commitInteraction() {
    const snapshot = interactionSnapshotRef.current

    if (!snapshot) {
      return
    }

    interactionSnapshotRef.current = null

    if (snapshot === JSON.stringify(designRef.current)) {
      return
    }

    setHistory((historyState) => ({
      past: [...historyState.past.slice(-29), JSON.parse(snapshot)],
      future: [],
    }))
  }

  function updateDesignPreview(updater) {
    beginInteraction()
    startTransition(() => {
      setDesign((current) => (typeof updater === 'function' ? updater(current) : updater))
    })
  }

  function updateSection(section, values) {
    commitChange((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...values,
      },
    }))
  }

  function updateSelectedElement(values) {
    if (!selectedId) {
      return
    }

    commitChange((current) => ({
      ...current,
      elements: current.elements.map((element) =>
        element.id === selectedId ? { ...element, ...values } : element,
      ),
    }))
  }

  function selectElement(id) {
    setSelectedId(id)
    const element = designRef.current.elements.find((item) => item.id === id)
    if (element?.type !== 'text') {
      setEditingTextId(null)
    }
  }

  function previewElementChange(id, values) {
    updateDesignPreview((current) => ({
      ...current,
      elements: current.elements.map((element) =>
        element.id === id ? { ...element, ...values } : element,
      ),
    }))
  }

  function previewTextInput(id, textValue) {
    updateDesignPreview((current) => ({
      ...current,
      elements: current.elements.map((element) =>
        element.id === id ? { ...element, text: textValue } : element,
      ),
    }))
  }

  function addTextElement() {
    const id = `text-${Date.now()}`

    commitChange((current) => ({
      ...current,
      elements: [
        ...current.elements,
        {
          id,
          type: 'text',
          text: 'New headline',
          x: 14,
          y: 14,
          width: 42,
          fontFamily: current.text.fontFamily,
          fontSize: current.text.fontSize,
          fontWeight: current.text.fontWeight,
          color: current.text.color,
          letterSpacing: current.text.letterSpacing,
          lineHeight: current.text.lineHeight,
          align: 'left',
        },
      ],
    }))
    setSelectedId(id)
    setEditingTextId(null)
    pushToast('Text layer added', 'Your new text box is ready to edit on the canvas.')
  }

  async function addImageElement(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const dataUrl = await readFileAsDataUrl(file)
    const id = `image-${Date.now()}`

    commitChange((current) => ({
      ...current,
      elements: [
        ...current.elements,
        {
          id,
          type: 'image',
          src: dataUrl,
          x: 58,
          y: 12,
          width: 26,
          height: 26,
          radius: 28,
        },
      ],
    }))
    setSelectedId(id)
    setEditingTextId(null)
    event.target.value = ''
    pushToast('Image layer added', 'The uploaded image is now on the card.')
  }

  async function updateBackgroundImage(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const dataUrl = await readFileAsDataUrl(file)
    updateSection('background', { image: dataUrl, type: 'image' })
    event.target.value = ''
    pushToast('Background updated', 'Your new background image has been applied.')
  }

  function deleteSelectedElement() {
    if (!selectedId) {
      return
    }

    commitChange((current) => ({
      ...current,
      elements: current.elements.filter((element) => element.id !== selectedId),
    }))
    setSelectedId(null)
    setEditingTextId(null)
    pushToast('Layer deleted', 'The selected element has been removed.')
  }

  function handleUndo() {
    if (!history.past.length) {
      return
    }

    const previous = history.past[history.past.length - 1]
    setHistory((current) => ({
      past: current.past.slice(0, -1),
      future: [designRef.current, ...current.future].slice(0, 30),
    }))
    setDesign(previous)
  }

  function handleRedo() {
    if (!history.future.length) {
      return
    }

    const [next, ...rest] = history.future
    setHistory((current) => ({
      past: [...current.past.slice(-29), designRef.current],
      future: rest,
    }))
    setDesign(next)
  }

  function randomizeDesign() {
    const palette = randomFrom(randomPalettes)
    const font = randomFrom(fontOptions).value

    commitChange((current) => ({
      ...current,
      background: {
        ...current.background,
        ...palette,
      },
      text: {
        ...current.text,
        fontFamily: font,
      },
      elements: current.elements.map((element, index) =>
        element.type === 'text'
          ? {
              ...element,
              fontFamily: index === 0 ? font : 'Manrope, sans-serif',
              color: index === 0 ? '#ffffff' : '#e8fff8',
            }
          : element,
        ),
    }))
    pushToast('Style remixed', 'A fresh color and font combination is now active.')
  }

  function reorderSelected(direction) {
    if (!selectedId) {
      return
    }

    commitChange((current) => ({
      ...current,
      elements: reorderElements(current.elements, selectedId, direction),
    }))
    pushToast(
      direction === 'forward' ? 'Layer moved forward' : 'Layer sent backward',
      'The selected layer order has been updated.',
    )
  }

  async function exportCard() {
    if (!canvasRef.current) {
      return
    }

    setIsExporting(true)

    try {
      let fileHandle = null
      let downloadWindow = null

      if ('showSaveFilePicker' in window) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: 'business-card.png',
          types: [
            {
              description: 'PNG Image',
              accept: {
                'image/png': ['.png'],
              },
            },
          ],
        })
      } else {
        downloadWindow = window.open('', '_blank')
      }

      const rect = canvasRef.current.getBoundingClientRect()
      const exportTarget = createExportClone(
        canvasRef.current,
        Math.round(rect.width),
        Math.round(rect.height),
      )

      const blob = await toBlob(exportTarget.clone, {
        cacheBust: true,
        pixelRatio: design.export.highResolution ? 3 : 2,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        filter: (node) => !node.dataset?.exportIgnore,
      })

      exportTarget.cleanup()

      if (!blob) {
        throw new Error('Export returned an empty file.')
      }

      if (fileHandle) {
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
        pushToast('Export ready', 'business-card.png has been saved.')
        return
      }

      const objectUrl = URL.createObjectURL(blob)
      if (downloadWindow && !downloadWindow.closed) {
        downloadWindow.document.title = 'Business Card Export'
        downloadWindow.document.body.innerHTML = `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: white;">
            <p style="margin: 0 0 12px;">Your PNG export is ready.</p>
            <a
              id="download-link"
              href="${objectUrl}"
              download="business-card.png"
              style="display: inline-block; padding: 12px 16px; border-radius: 12px; background: white; color: #0f172a; text-decoration: none; font-weight: 700;"
            >
              Download business-card.png
            </a>
          </div>
        `

        const popupLink = downloadWindow.document.getElementById('download-link')
        popupLink?.click()
      } else {
        const link = document.createElement('a')
        link.download = 'business-card.png'
        link.href = objectUrl
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        link.remove()
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
      }, 4000)
      pushToast('Export ready', 'A download window or save dialog should appear now.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        pushToast('Export canceled', 'No file was saved.')
      } else {
        pushToast(
          'Export failed',
          error instanceof Error ? error.message : 'Please try again.',
        )
      }
    } finally {
      setIsExporting(false)
    }
  }

  function openElementControls(targetId = null, clientX = 0, clientY = 0) {
    const canvasRect = canvasRef.current?.getBoundingClientRect()

      if (targetId) {
        selectElement(targetId)
      }

    setActiveSection('elements')

    if (canvasRect) {
      const nextX = Math.min(clientX - canvasRect.left + 12, canvasRect.width - 220)
      const nextY = Math.min(clientY - canvasRect.top + 12, canvasRect.height - 180)

      setContextMenu({
        visible: true,
        position: {
          x: Math.max(12, nextX),
          y: Math.max(12, nextY),
        },
        targetId,
      })
    }
  }

  const sections = [
    {
      id: 'background',
      title: 'Background Settings',
      subtitle: 'Solid fills, gradients, imagery, and mood',
      content: (
        <BackgroundControls
          background={design.background}
          onChange={(values) => updateSection('background', values)}
          onImageUpload={updateBackgroundImage}
        />
      ),
    },
    {
      id: 'text',
      title: 'Text Settings',
      subtitle: 'Modern type controls for active text layers',
      content: (
        <TextControls
          text={design.text}
          selectedElement={selectedElement}
          onGlobalChange={(values) => updateSection('text', values)}
          onElementChange={updateSelectedElement}
        />
      ),
    },
    {
      id: 'elements',
      title: 'Element Controls',
      subtitle: 'Add, select, and manage your freeform layers',
      content: (
        <ElementControls
          elements={design.elements}
          selectedElement={selectedElement}
          onSelect={selectElement}
          onAddText={addTextElement}
          onAddImage={addImageElement}
          onDelete={deleteSelectedElement}
          onElementChange={updateSelectedElement}
        />
      ),
    },
    {
      id: 'card',
      title: 'Card Styling',
      subtitle: 'Shape, depth, padding, and transparency',
      content: (
        <CardStyleControls
          card={design.card}
          onChange={(values) => updateSection('card', values)}
        />
      ),
    },
    {
      id: 'export',
      title: 'Export',
      subtitle: 'High-resolution PNG output options',
      content: (
        <ExportControls
          exportOptions={design.export}
          onChange={(values) => updateSection('export', values)}
          onExport={exportCard}
          isExporting={isExporting}
        />
      ),
    },
  ]

  return (
    <main className="min-h-screen px-4 py-4 text-ink lg:h-screen lg:overflow-hidden lg:px-6">
      <ToastStack toasts={toasts} />
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1680px] items-stretch gap-5 lg:h-[calc(100vh-2rem)] lg:overflow-hidden lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="hidden h-full min-h-0 lg:block">
          <Sidebar
            sections={sections}
            activeSection={activeSection}
            onSectionChange={(sectionId) =>
              setActiveSection((current) => (current === sectionId ? null : sectionId))
            }
          />
        </div>

        <section className="scrollbar-thin flex h-full min-h-[calc(100vh-2rem)] min-w-0 flex-col gap-5 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
          <div className="fixed left-6 top-6 z-40 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/88 text-slate-900 shadow-panel backdrop-blur-xl"
              aria-label="Open settings"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/60 bg-white/55 p-5 shadow-panel backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="pl-16 lg:pl-0">
                <p className="font-display text-xs uppercase tracking-[0.3em] text-teal-700">
                  Live Preview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Freeform editor with instant feedback
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Drag text and images anywhere inside the square canvas, resize
                  selected layers, and export the finished card without leaving
                  the page.
                </p>
              </div>

              <ToolbarControls
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={history.past.length > 0}
                canRedo={history.future.length > 0}
                onRandomize={randomizeDesign}
                onBringForward={() => reorderSelected('forward')}
                onSendBackward={() => reorderSelected('backward')}
                canLayer={Boolean(selectedElement)}
                onExport={exportCard}
              />
            </div>
          </div>

          <Canvas
            design={design}
            selectedId={selectedId}
            editingTextId={editingTextId}
            onSelect={selectElement}
            onStartEditing={setEditingTextId}
            onStopEditing={() => setEditingTextId(null)}
            canvasRef={canvasRef}
            onPreviewElementChange={previewElementChange}
            onCommitElementChange={commitInteraction}
            onTextInput={previewTextInput}
            onContextMenu={openElementControls}
            contextMenu={contextMenu}
            onCloseContextMenu={() =>
              setContextMenu((current) => ({ ...current, visible: false }))
            }
            onAddText={addTextElement}
            onDeleteSelected={deleteSelectedElement}
            onBringForward={() => reorderSelected('forward')}
            onSendBackward={() => reorderSelected('backward')}
          />
        </section>
      </div>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/28 backdrop-blur-[2px] lg:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setMobileSidebarOpen(false)}
            role="presentation"
          />
          <div className="absolute left-4 top-4 w-[min(24rem,calc(100vw-5rem))] max-h-[calc(100dvh-2rem)]">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/88 text-slate-900 shadow-panel backdrop-blur-xl"
                aria-label="Close settings"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(100dvh-5.5rem)] overflow-hidden">
              <Sidebar
                sections={sections}
                activeSection={activeSection}
                onSectionChange={(sectionId) =>
                  setActiveSection((current) => (current === sectionId ? null : sectionId))
                }
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
