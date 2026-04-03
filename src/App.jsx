import { useEffect, useRef, useState, startTransition } from 'react'
import { toBlob } from 'html-to-image'
import { ArrowDown, Menu, X } from 'lucide-react'
import BackgroundControls from './components/BackgroundControls'
import Canvas from './components/Canvas'
import CardStyleControls from './components/CardStyleControls'
import ElementControls from './components/ElementControls'
import ExportControls from './components/ExportControls'
import Sidebar from './components/Sidebar'
import TemplatesPanel from './components/TemplatesPanel'
import TextControls from './components/TextControls'
import ToastStack from './components/ToastStack'
import ToolbarControls from './components/ToolbarControls'
import {
  defaultDesign,
  defaultUserImage,
  fontOptions,
  randomFrom,
  readFileAsDataUrl,
  reorderElements,
} from './utils'

const STORAGE_KEY = 'business-card-generator-design-v3'
const LEGACY_STORAGE_KEY = 'business-card-generator-design'
const LEGACY_STORAGE_KEY_V2 = 'business-card-generator-design-v2'

function normalizeDesign(design) {
  if (!design || typeof design !== 'object') {
    return defaultDesign
  }

  const merged = {
    ...defaultDesign,
    ...design,
    background: {
      ...defaultDesign.background,
      ...(design.background ?? {}),
    },
    text: {
      ...defaultDesign.text,
      ...(design.text ?? {}),
    },
    card: {
      ...defaultDesign.card,
      ...(design.card ?? {}),
    },
    export: {
      ...defaultDesign.export,
      ...(design.export ?? {}),
    },
    elements: Array.isArray(design.elements) ? design.elements : defaultDesign.elements,
  }

  return {
    ...merged,
    elements: merged.elements.map((element) => {
      if (element?.type !== 'text') {
        return element
      }

      return {
        ...element,
        fontFamily:
          element.fontFamily ?? defaultDesign.text.fontFamily,
        letterSpacing:
          typeof element.letterSpacing === 'number'
            ? element.letterSpacing
            : defaultDesign.text.letterSpacing,
        lineHeight:
          typeof element.lineHeight === 'number'
            ? element.lineHeight
            : defaultDesign.text.lineHeight,
      }
    }),
  }
}

const randomPalettes = [
  {
    type: 'gradient',
    solidColor: '#f3efe7',
    gradientColors: ['#12213f', '#0f766e', '#f0ab3d'],
    gradientDirection: '135deg',
    useThirdColor: true,
    noise: 8,
    overlay: 'dark',
  },
  {
    type: 'solid',
    solidColor: '#f8f2ec',
    gradientColors: ['#0f172a', '#2563eb', '#e2e8f0'],
    gradientDirection: 'to right',
    useThirdColor: false,
    noise: 4,
    overlay: 'light',
  },
  {
    type: 'gradient',
    solidColor: '#0b1120',
    gradientColors: ['#3f1d38', '#bc4749', '#f2e8cf'],
    gradientDirection: '45deg',
    useThirdColor: true,
    noise: 10,
    overlay: 'none',
  },
]

function isLegacyStarterDesign(design) {
  const texts = Array.isArray(design?.elements)
    ? design.elements
        .filter((element) => element?.type === 'text')
        .map((element) => String(element.text || ''))
    : []

  return texts.some(
    (text) =>
      text.includes('Ava Brooks') ||
      text.includes('ava@studio.com') ||
      text.includes('Creative Director'),
  )
}

function loadInitialDesign() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = normalizeDesign(JSON.parse(saved))
      return isLegacyStarterDesign(parsed) ? defaultDesign : parsed
    }

    const savedV2 = localStorage.getItem(LEGACY_STORAGE_KEY_V2)
    if (savedV2) {
      const parsedV2 = normalizeDesign(JSON.parse(savedV2))
      return isLegacyStarterDesign(parsedV2) ? defaultDesign : parsedV2
    }

    const legacySaved = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacySaved) {
      const parsedLegacy = normalizeDesign(JSON.parse(legacySaved))
      return isLegacyStarterDesign(parsedLegacy) ? defaultDesign : parsedLegacy
    }

    return defaultDesign
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
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    targetId: null,
  })
  const canvasRef = useRef(null)
  const quickImageInputRef = useRef(null)
  const designRef = useRef(design)
  const interactionSnapshotRef = useRef(null)

  const selectedElement =
    design.elements.find((element) => element.id === selectedId) ?? null

  useEffect(() => {
    designRef.current = design
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design))
    localStorage.removeItem(LEGACY_STORAGE_KEY_V2)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
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
      if (!selectedId) {
        return
      }

      const isDeleteKey = event.key === 'Delete' || event.code === 'Delete'

      if (isDeleteKey) {
        event.preventDefault()
        event.stopPropagation()
        deleteSelectedElement()
        setActiveSection('elements')
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
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

  function addShotElement() {
    const id = `image-shot-${Date.now()}`

    commitChange((current) => ({
      ...current,
      elements: [
        ...current.elements,
        {
          id,
          type: 'image',
          src: defaultUserImage,
          alt: 'Shot placeholder',
          x: 58,
          y: 18,
          width: 18,
          height: 24,
          radius: 18,
          resizeMode: 'ratio',
        },
      ],
    }))

    setSelectedId(id)
    setActiveSection('elements')
    pushToast('Shot added', 'A starter shot placeholder is ready on the canvas.')
  }

  function applyPlaceholderTemplate(templateId) {
    const templates = {
      'template-1': {
        background: {
          mode: 'preset',
          type: 'gradient',
          gradientColors: ['#182036', '#164e63', '#f59e0b'],
          gradientDirection: '135deg',
          useThirdColor: true,
          customBackground: '',
          noise: 8,
          opacity: 1,
          overlay: 'dark',
        },
      },
      'template-2': {
        background: {
          mode: 'preset',
          type: 'gradient',
          gradientColors: ['#0f172a', '#334155', '#d6d3d1'],
          gradientDirection: 'to right',
          useThirdColor: true,
          customBackground: '',
          noise: 4,
          opacity: 1,
          overlay: 'light',
        },
      },
      'template-3': {
        background: {
          mode: 'preset',
          type: 'gradient',
          gradientColors: ['#431407', '#9f1239', '#f97316'],
          gradientDirection: '45deg',
          useThirdColor: true,
          customBackground: '',
          noise: 10,
          opacity: 1,
          overlay: 'dark',
        },
      },
    }

    const nextTemplate = templates[templateId]

    if (!nextTemplate) {
      return
    }

    commitChange((current) => ({
      ...current,
      background: {
        ...current.background,
        ...nextTemplate.background,
      },
    }))

    pushToast('Template applied', 'Placeholder template styling is now on the card.')
  }

  function openQuickImagePicker() {
    quickImageInputRef.current?.click()
  }

  async function updateBackgroundImage(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const dataUrl = await readFileAsDataUrl(file)
    updateSection('background', {
      mode: 'custom',
      image: dataUrl,
      type: 'image',
      customBackground: '',
    })
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
      subtitle: 'Solid fills, gradients, imagery and mood',
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
      subtitle: 'Add, select and manage your freeform layers',
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
      subtitle: 'Shape, depth, padding and transparency',
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
    {
      id: 'templates',
      title: 'Templates',
      subtitle: 'Placeholder starter presets you can replace later',
      content: <TemplatesPanel onApplyPlaceholder={applyPlaceholderTemplate} />,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-4 text-white lg:px-6">
      <ToastStack toasts={toasts} />
      <div className="mx-auto flex max-w-[1680px] flex-col gap-6">
        <section className="flex min-h-[calc(100vh-2rem)] flex-col justify-between px-1 pb-4 pt-2">
          <div className="max-w-4xl pt-16 lg:pt-24">
            <p className="font-display text-xs uppercase tracking-[0.36em] text-slate-400">
              Business Card Generator
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
              Design a polished card in real time
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 lg:text-base">
              Drag text and images anywhere inside the canvas, fine-tune every
              layer and export the finished card exactly as it appears.
            </p>
          </div>

          <div className="flex justify-start">
            <a
              href="#workspace"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Scroll to workspace
              <ArrowDown size={16} />
            </a>
          </div>
        </section>

        <section
          id="workspace"
          className={`grid min-h-[calc(100vh-2rem)] items-stretch gap-5 lg:h-[calc(100vh-2rem)] ${
            isFocusMode ? 'lg:grid-cols-[minmax(0,1fr)]' : 'lg:grid-cols-[360px_minmax(0,1fr)]'
          }`}
        >
          <div
            className={`min-h-0 ${
              isFocusMode ? 'hidden' : 'hidden lg:block lg:h-[calc(100%+3.5rem)]'
            }`}
          >
            <Sidebar
              sections={sections}
              activeSection={activeSection}
              onSectionChange={(sectionId) =>
                setActiveSection((current) => (current === sectionId ? null : sectionId))
              }
            />
          </div>

          <section className="flex min-h-0 min-w-0 flex-col gap-4 lg:h-full">
            <div className="sticky left-0 top-6 z-40 flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white text-slate-900 shadow-panel"
                aria-label="Open settings"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1">
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
                onAddImage={openQuickImagePicker}
                onDeleteSelected={deleteSelectedElement}
                onBringForward={() => reorderSelected('forward')}
                onSendBackward={() => reorderSelected('backward')}
                toolbarContent={
                  <ToolbarControls
                    orientation="vertical"
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={history.past.length > 0}
                    canRedo={history.future.length > 0}
                    onRandomize={randomizeDesign}
                    onBringForward={() => reorderSelected('forward')}
                    onSendBackward={() => reorderSelected('backward')}
                    canLayer={Boolean(selectedElement)}
                    onExport={exportCard}
                    onAddShot={addShotElement}
                    onToggleFocusMode={() => setIsFocusMode((current) => !current)}
                    isFocusMode={isFocusMode}
                  />
                }
              />
            </div>
          </section>
        </section>
      </div>

      <input
        ref={quickImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={addImageElement}
      />

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/28 backdrop-blur-[2px] lg:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setMobileSidebarOpen(false)}
            role="presentation"
          />
          <div className="absolute left-4 top-4 w-[min(24rem,calc(100vw-5rem))] max-h-[calc(100vh-2rem)]">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white text-slate-900 shadow-panel"
                aria-label="Close settings"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain">
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
