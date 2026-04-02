import defaultUserImage from './assets/cardnova-user.png'

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
  { label: '4:3', value: '4:3', width: 4, height: 3 },
  { label: '4:5', value: '4:5', width: 4, height: 5 },
  { label: '3:4', value: '3:4', width: 3, height: 4 },
  { label: '16:9', value: '16:9', width: 16, height: 9 },
  { label: '9:16', value: '9:16', width: 9, height: 16 },
]

export const defaultDesign = {
  background: {
    type: 'gradient',
    solidColor: '#5b4f85',
    gradientColors: ['#484480', '#704a79', '#b74a43'],
    gradientDirection: '115deg',
    useThirdColor: true,
    image: '',
    blur: 0,
    overlay: 'none',
    opacity: 1,
  },
  text: {
    fontFamily: 'Sora, sans-serif',
    fontSize: 32,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  card: {
    layout: 'horizontal',
    ratio: '4:3',
    borderRadius: 40,
    shadow: 'medium',
    padding: 34,
    transparency: 0,
  },
  export: {
    highResolution: true,
    watermark: false,
  },
  elements: [
    {
      id: 'image-hero',
      type: 'image',
      src: defaultUserImage,
      alt: 'Default Cardnova preview avatar',
      x: 3.5,
      y: 4.5,
      width: 26,
      height: 35,
      radius: 999,
      resizeMode: 'ratio',
    },
    {
      id: 'text-brand',
      type: 'text',
      text: 'Cardnova',
      x: 16.5,
      y: 28,
      width: 68,
      fontFamily: 'Sora, sans-serif',
      fontSize: 86,
      fontWeight: 800,
      color: '#fff500',
      letterSpacing: -4,
      lineHeight: 0.92,
      align: 'left',
    },
    {
      id: 'text-headline',
      type: 'text',
      text: 'Welcomes you to digital business card designing',
      x: 7.5,
      y: 56,
      width: 78,
      fontFamily: 'Manrope, sans-serif',
      fontSize: 29,
      fontWeight: 800,
      color: '#fff9fb',
      letterSpacing: -1.2,
      lineHeight: 1.12,
      align: 'left',
    },
    {
      id: 'text-subhead',
      type: 'text',
      text: 'Feel free to design, save and share your card with clients',
      x: 10.6,
      y: 66.5,
      width: 72,
      fontFamily: 'Manrope, sans-serif',
      fontSize: 18,
      fontWeight: 600,
      color: '#fff8fb',
      letterSpacing: 0,
      lineHeight: 1.26,
      align: 'left',
    },
    {
      id: 'text-note',
      type: 'text',
      text: 'This product is still being optimized for smooth user interface. Please\nif you encounter any error while designing report it to\nchumbakenny@gmail.com or visit kypchumba.github.io to report',
      x: 3.8,
      y: 80,
      width: 90,
      fontFamily: 'Manrope, sans-serif',
      fontSize: 17,
      fontWeight: 700,
      color: '#fff9fb',
      letterSpacing: -0.2,
      lineHeight: 1.46,
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
      ? elements.length - 1
      : 0

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
