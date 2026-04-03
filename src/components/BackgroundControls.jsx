import { useState } from 'react'
import { gradientDirections } from '../utils'

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      {children}
    </label>
  )
}

const solidPalette = [
  ['Ivory Glow', '#f4efe6'],
  ['Sandstone', '#dfd1bf'],
  ['Clay Dust', '#c8a98d'],
  ['Peach Skin', '#f3cbb5'],
  ['Rose Powder', '#f0c7cf'],
  ['Berry Cream', '#dca4b8'],
  ['Soft Lilac', '#d8c7f3'],
  ['Lavender Mist', '#c5b4e3'],
  ['Sky Milk', '#d7e7f7'],
  ['Powder Blue', '#b5d0eb'],
  ['Ice Mint', '#dff5ef'],
  ['Aqua Glass', '#c7ece6'],
  ['Sage Whisper', '#d8e2c9'],
  ['Olive Haze', '#b7c39a'],
  ['Lemon Wash', '#f5efb8'],
  ['Amber Dust', '#e8c47f'],
  ['Coral Light', '#efb1a3'],
  ['Terracotta Soft', '#c98d78'],
  ['Stone Fog', '#d6d2cf'],
  ['Cloud Silver', '#bcc3cd'],
  ['Midnight Ink', '#192131'],
  ['Deep Ocean', '#132c45'],
  ['Forest Room', '#1b332a'],
  ['Plum Night', '#30203b'],
  ['Cherry Wine', '#4a1f29'],
]

const gradientPalette = [
  ['Aurora Flow', ['#14213d', '#0f766e', '#f59e0b']],
  ['Blue Ember', ['#1e3a8a', '#0ea5e9', '#fb7185']],
  ['Sunset Bloom', ['#5b2c83', '#d946ef', '#f97316']],
  ['Mint Beam', ['#052e2b', '#10b981', '#d9f99d']],
  ['Violet Rush', ['#312e81', '#7c3aed', '#ec4899']],
  ['Electric Tide', ['#082f49', '#2563eb', '#22d3ee']],
  ['Rose Haze', ['#4c1d95', '#db2777', '#fda4af']],
  ['Firelight', ['#451a03', '#ea580c', '#facc15']],
  ['Night Pool', ['#111827', '#1d4ed8', '#38bdf8']],
  ['Pine Glow', ['#052e16', '#15803d', '#bef264']],
  ['Coral Wave', ['#7f1d1d', '#ef4444', '#fdba74']],
  ['Royal Mist', ['#1e1b4b', '#6366f1', '#c4b5fd']],
  ['Lagoon', ['#083344', '#0891b2', '#a5f3fc']],
  ['Velvet Heat', ['#500724', '#be123c', '#fb7185']],
  ['Golden Hour', ['#78350f', '#f59e0b', '#fde68a']],
  ['Arctic Shine', ['#1e293b', '#64748b', '#e2e8f0']],
  ['Cosmic Pop', ['#27272a', '#a21caf', '#22d3ee']],
  ['Copper Fade', ['#431407', '#c2410c', '#fdba74']],
  ['Olive Flame', ['#1a2e05', '#65a30d', '#facc15']],
  ['Frost Byte', ['#0f172a', '#334155', '#93c5fd']],
  ['Neon Plum', ['#3b0764', '#9333ea', '#f472b6']],
  ['Cinder Teal', ['#0f172a', '#155e75', '#5eead4']],
  ['Studio Peach', ['#7c2d12', '#fb7185', '#fed7aa']],
  ['Deep Bloom', ['#172554', '#7c3aed', '#f9a8d4']],
  ['Signal Sky', ['#082f49', '#0284c7', '#f0abfc']],
]

const obsidianPalette = [
  ['Obsidian Core', 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 16%), radial-gradient(circle at 74% 28%, rgba(120,132,152,0.18), transparent 18%), radial-gradient(circle at 52% 76%, rgba(63,72,86,0.26), transparent 22%), linear-gradient(140deg, #030507 0%, #0c1016 36%, #171d24 62%, #090b10 100%)'],
  ['Coal Glass', 'radial-gradient(circle at 20% 32%, rgba(173,181,189,0.1), transparent 18%), radial-gradient(circle at 72% 22%, rgba(103,114,129,0.18), transparent 16%), radial-gradient(circle at 64% 74%, rgba(42,47,54,0.3), transparent 20%), linear-gradient(135deg, #05070a 0%, #12161d 42%, #1f242d 68%, #0b0d12 100%)'],
  ['Graphite Veil', 'radial-gradient(circle at 14% 18%, rgba(255,255,255,0.08), transparent 14%), radial-gradient(circle at 70% 34%, rgba(98,109,125,0.16), transparent 19%), radial-gradient(circle at 48% 78%, rgba(54,61,72,0.28), transparent 21%), linear-gradient(145deg, #04070b 0%, #0f141b 40%, #1b222c 66%, #0a0d12 100%)'],
  ['Night Slate', 'radial-gradient(circle at 22% 26%, rgba(255,255,255,0.1), transparent 14%), radial-gradient(circle at 80% 18%, rgba(85,98,118,0.16), transparent 17%), radial-gradient(circle at 56% 72%, rgba(45,50,60,0.26), transparent 22%), linear-gradient(135deg, #03060a 0%, #10161f 44%, #1a212b 70%, #080b10 100%)'],
  ['Ink Alloy', 'radial-gradient(circle at 16% 30%, rgba(205,211,218,0.08), transparent 16%), radial-gradient(circle at 74% 26%, rgba(93,102,116,0.17), transparent 17%), radial-gradient(circle at 44% 70%, rgba(40,46,54,0.28), transparent 20%), linear-gradient(140deg, #020407 0%, #0c1118 38%, #171e28 63%, #090c11 100%)'],
  ['Shadow Steel', 'radial-gradient(circle at 24% 18%, rgba(255,255,255,0.1), transparent 13%), radial-gradient(circle at 68% 24%, rgba(122,130,141,0.16), transparent 18%), radial-gradient(circle at 60% 76%, rgba(50,57,67,0.27), transparent 22%), linear-gradient(132deg, #04070b 0%, #121820 40%, #202834 67%, #0b0f15 100%)'],
  ['Dark Chrome', 'radial-gradient(circle at 18% 24%, rgba(214,220,226,0.08), transparent 14%), radial-gradient(circle at 78% 30%, rgba(109,118,129,0.16), transparent 17%), radial-gradient(circle at 48% 72%, rgba(49,54,62,0.3), transparent 20%), linear-gradient(138deg, #05070a 0%, #10141a 39%, #1d242d 66%, #0a0c10 100%)'],
  ['Black Sapphire', 'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.1), transparent 14%), radial-gradient(circle at 76% 34%, rgba(70,83,104,0.22), transparent 18%), radial-gradient(circle at 52% 74%, rgba(35,43,57,0.28), transparent 21%), linear-gradient(140deg, #03050a 0%, #0b1220 34%, #162033 58%, #070a11 100%)'],
  ['Midnight Moss', 'radial-gradient(circle at 16% 24%, rgba(255,255,255,0.08), transparent 14%), radial-gradient(circle at 72% 26%, rgba(76,98,92,0.17), transparent 18%), radial-gradient(circle at 54% 74%, rgba(34,52,47,0.25), transparent 22%), linear-gradient(138deg, #020507 0%, #0a1212 36%, #12211f 62%, #070b0b 100%)'],
  ['Noir Ember', 'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.08), transparent 13%), radial-gradient(circle at 74% 28%, rgba(96,86,78,0.16), transparent 17%), radial-gradient(circle at 58% 72%, rgba(58,46,41,0.24), transparent 22%), linear-gradient(140deg, #050505 0%, #120f0e 36%, #221b19 60%, #0b0a09 100%)'],
]

const presetGroups = [
  {
    id: 'solid',
    title: 'Solid',
    description: '25 ready-made single-color fills',
    presets: solidPalette.map(([name, color], index) => ({
      id: `solid-${index}`,
      name,
      preview: color,
      values: {
        type: 'solid',
        solidColor: color,
        blur: 0,
        noise: index % 2 === 0 ? 4 : 7,
        overlay: index % 4 === 0 ? 'light' : 'none',
        opacity: 1,
      },
    })),
  },
  {
    id: 'gradient',
    title: 'Gradient',
    description: '25 layered blends for expressive cards',
    presets: gradientPalette.map(([name, colors], index) => ({
      id: `gradient-${index}`,
      name,
      preview: `linear-gradient(135deg, ${colors.join(', ')})`,
      values: {
        type: 'gradient',
        gradientColors: colors,
        gradientDirection: ['135deg', '45deg', 'to right', 'to bottom'][index % 4],
        useThirdColor: true,
        blur: 0,
        noise: 8 + (index % 4) * 2,
        overlay: index % 3 === 0 ? 'dark' : index % 3 === 1 ? 'light' : 'none',
        opacity: 1,
      },
    })),
  },
  {
    id: 'obsidian',
    title: 'Obsidian',
    description: '10 dark glass and noir presets',
    presets: obsidianPalette.map(([name, colors], index) => ({
      id: `obsidian-${index}`,
      name,
      preview: colors,
      values: {
        type: 'gradient',
        gradientColors: ['#050816', '#111827', '#1f2937'],
        gradientDirection: index % 2 === 0 ? '135deg' : 'to right',
        useThirdColor: true,
        customBackground: colors,
        blur: 0,
        noise: 12 + (index % 3) * 4,
        overlay: 'dark',
        opacity: 1,
      },
    })),
  },
]

function PresetGroup({ group, isOpen, onToggle, onApply }) {
  return (
    <section
      className={`overflow-hidden rounded-[1.5rem] border transition ${
        isOpen
          ? 'border-cyan-300/50 bg-cyan-300/[0.06] shadow-[0_0_0_1px_rgba(103,232,249,0.25)]'
          : 'border-white/10 bg-white/[0.04]'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            {group.title}
          </p>
          <p className="mt-1 text-sm text-slate-300">{group.description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white">
          {group.presets.length}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-4 gap-2 border-t border-white/10 px-4 py-4">
            {group.presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApply(preset.values)}
                className="overflow-hidden rounded-[1.15rem] border border-white/10 bg-slate-950/40 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/45"
              >
                <div className="h-12 rounded-[1rem]" style={{ background: preset.preview }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function BackgroundControls({ background, onChange, onImageUpload }) {
  const [openPresetGroup, setOpenPresetGroup] = useState('gradient')

  function applyPreset(values) {
    onChange({
      ...values,
      mode: 'preset',
      image: '',
    })
  }

  function applyCustomize(values) {
    onChange({
      ...values,
      mode: 'custom',
      customBackground: values.customBackground ?? '',
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.06] p-1">
        {[
          { id: 'preset', label: 'Presets' },
          { id: 'custom', label: 'Customize' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange({ mode: tab.id })}
            className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
              (background.mode ?? 'preset') === tab.id
                ? 'bg-cyan-300 text-slate-950 shadow-sm'
                : 'text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(background.mode ?? 'preset') === 'preset' ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Presets</p>
          <div className="space-y-3">
            {presetGroups.map((group) => (
              <PresetGroup
                key={group.id}
                group={group}
                isOpen={openPresetGroup === group.id}
                onToggle={() =>
                  setOpenPresetGroup((current) => (current === group.id ? '' : group.id))
                }
                onApply={applyPreset}
              />
            ))}
          </div>
        </div>
      ) : null}

      {(background.mode ?? 'preset') === 'custom' ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Customize</p>

          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.06] p-1">
            {['solid', 'gradient', 'image'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => applyCustomize({ type, customBackground: '' })}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold capitalize transition ${
                  background.type === type
                    ? 'bg-cyan-300 text-slate-950 shadow-sm'
                    : 'text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {background.type === 'solid' ? (
            <Field label="Solid color">
              <input
                type="color"
                value={background.solidColor}
                onChange={(event) =>
                  applyCustomize({
                    solidColor: event.target.value,
                    customBackground: '',
                  })
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-transparent"
              />
            </Field>
          ) : null}

          {background.type === 'gradient' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Color one">
                  <input
                    type="color"
                    value={background.gradientColors[0]}
                    onChange={(event) =>
                      applyCustomize({
                        customBackground: '',
                        gradientColors: [
                          event.target.value,
                          background.gradientColors[1],
                          background.gradientColors[2],
                        ],
                      })
                    }
                    className="h-12 w-full rounded-2xl border border-white/10 bg-transparent"
                  />
                </Field>
                <Field label="Color two">
                  <input
                    type="color"
                    value={background.gradientColors[1]}
                    onChange={(event) =>
                      applyCustomize({
                        customBackground: '',
                        gradientColors: [
                          background.gradientColors[0],
                          event.target.value,
                          background.gradientColors[2],
                        ],
                      })
                    }
                    className="h-12 w-full rounded-2xl border border-white/10 bg-transparent"
                  />
                </Field>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3 text-sm font-medium text-white">
                <input
                  type="checkbox"
                  checked={background.useThirdColor}
                  onChange={(event) =>
                    applyCustomize({
                      useThirdColor: event.target.checked,
                      customBackground: '',
                    })
                  }
                  className="h-4 w-4 rounded border-white/20 text-cyan-300"
                />
                Add a third gradient color
              </label>

              {background.useThirdColor ? (
                <Field label="Color three">
                  <input
                    type="color"
                    value={background.gradientColors[2]}
                    onChange={(event) =>
                      applyCustomize({
                        customBackground: '',
                        gradientColors: [
                          background.gradientColors[0],
                          background.gradientColors[1],
                          event.target.value,
                        ],
                      })
                    }
                    className="h-12 w-full rounded-2xl border border-white/10 bg-transparent"
                  />
                </Field>
              ) : null}

              <Field label="Direction">
                <select
                  value={background.gradientDirection}
                  onChange={(event) =>
                    applyCustomize({
                      gradientDirection: event.target.value,
                      customBackground: '',
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  {gradientDirections.map((direction) => (
                    <option key={direction.value} value={direction.value}>
                      {direction.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          ) : null}

          {background.type === 'image' ? (
            <Field label="Background image">
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="block w-full rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-4 py-4 text-sm text-white"
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      <Field label={`Blur intensity: ${background.blur}px`}>
        <input
          type="range"
          min="0"
          max="28"
          value={background.blur}
          onChange={(event) => onChange({ blur: Number(event.target.value) })}
          className="w-full accent-cyan-300"
        />
      </Field>

      <Field label={`Noise: ${background.noise ?? 0}%`}>
        <input
          type="range"
          min="0"
          max="30"
          value={background.noise ?? 0}
          onChange={(event) => onChange({ noise: Number(event.target.value) })}
          className="w-full accent-cyan-300"
        />
      </Field>

      <Field label="Overlay">
        <select
          value={background.overlay}
          onChange={(event) => onChange({ overlay: event.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
        >
          <option value="none">None</option>
          <option value="dark">Dark glow</option>
          <option value="light">Light sheen</option>
        </select>
      </Field>

      <Field label={`Opacity: ${Math.round(background.opacity * 100)}%`}>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          value={background.opacity}
          onChange={(event) => onChange({ opacity: Number(event.target.value) })}
          className="w-full accent-cyan-300"
        />
      </Field>
    </div>
  )
}
