export const fontOptions = [
  { label: 'Sora', value: 'Sora, sans-serif' },
  { label: 'Manrope', value: 'Manrope, sans-serif' },
  { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { label: 'DM Sans', value: '"DM Sans", sans-serif' },
  { label: 'Outfit', value: 'Outfit, sans-serif' },
  { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
  { label: 'Urbanist', value: 'Urbanist, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Archivo', value: 'Archivo, sans-serif' },
  { label: 'Nunito Sans', value: '"Nunito Sans", sans-serif' },
  { label: 'Work Sans', value: '"Work Sans", sans-serif' },
]

export const gradientDirections = [
  { label: 'Top to Bottom', value: 'to bottom' },
  { label: 'Left to Right', value: 'to right' },
  { label: 'Diagonal', value: '135deg' },
  { label: 'Sunrise', value: '45deg' },
]

export const cardLayoutOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
]

export const cardRatioOptions = [
  { label: '1:1', value: '1:1', width: 1, height: 1 },
  { label: '4:5', value: '4:5', width: 4, height: 5 },
  { label: '3:4', value: '3:4', width: 3, height: 4 },
  { label: '16:9', value: '16:9', width: 16, height: 9 },
  { label: '9:16', value: '9:16', width: 9, height: 16 },
]

export const defaultDesign = {
  background: {
    type: 'solid',
    solidColor: '#f7f3ec',
    gradientColors: ['#102542', '#0f766e', '#f59e0b'],
    gradientDirection: '135deg',
    useThirdColor: true,
    image: '',
    blur: 0,
    overlay: 'dark',
    opacity: 1,
  },
  text: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 42,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 0,
    lineHeight: 1.1,
  },
  card: {
    layout: 'horizontal',
    ratio: '1:1',
    borderRadius: 32,
    shadow: 'medium',
    padding: 28,
    transparency: 0.12,
  },
  export: {
    highResolution: true,
    watermark: false,
  },
  elements: [
    {
      id: 'text-1',
      type: 'text',
      text: 'Ava Brooks',
      x: 12,
      y: 68,
      width: 68,
      fontFamily: 'Sora, sans-serif',
      fontSize: 56,
      fontWeight: 700,
      color: '#ffffff',
      letterSpacing: -1,
      lineHeight: 0.98,
      align: 'left',
    },
    {
      id: 'text-2',
      type: 'text',
      text: 'Creative Director\nava@studio.com',
      x: 12,
      y: 82,
      width: 44,
      fontFamily: 'Manrope, sans-serif',
      fontSize: 19,
      fontWeight: 600,
      color: '#e5f4f3',
      letterSpacing: 0.8,
      lineHeight: 1.4,
      align: 'left',
    },
  ],
}

export function getShadowClass(shadow) {
  if (shadow === 'soft') return 'shadow-soft'
  if (shadow === 'strong') return 'shadow-strong'
  return 'shadow-medium'
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function reorderElements(elements, id, direction) {
  const index = elements.findIndex((element) => element.id === id)

  if (index === -1) {
    return elements
  }

  const targetIndex =
    direction === 'forward'
      ? clamp(index + 1, 0, elements.length - 1)
      : clamp(index - 1, 0, elements.length - 1)

  if (targetIndex === index) {
    return elements
  }

  const next = [...elements]
  const [item] = next.splice(index, 1)
  next.splice(targetIndex, 0, item)
  return next
}

export function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)]
}
