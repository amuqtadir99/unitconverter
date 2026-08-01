'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  CATEGORIES,
  convert,
  formatResult,
  type Category,
} from '@/lib/units'

/** Sensible default from/to pair per category (falls back to first two). */
function defaultPair(category: Category): [string, string] {
  const ids = category.units.map((u) => u.id)
  const preferred: Record<string, [string, string]> = {
    length: ['m', 'ft'],
    mass: ['kg', 'lb'],
    volume: ['l', 'gal'],
    temperature: ['c', 'f'],
    area: ['m2', 'ft2'],
    speed: ['kph', 'mph'],
    time: ['h', 'min'],
    digital: ['GB', 'MB'],
    pressure: ['bar', 'psi'],
    energy: ['kj', 'kcal'],
    power: ['kw', 'hp'],
    angle: ['deg', 'rad'],
    'data-rate': ['mbps', 'mBps'],
    fuel: ['l100km', 'mpg_us'],
  }
  const p = preferred[category.id]
  if (p && ids.includes(p[0]) && ids.includes(p[1])) return p
  return [ids[0], ids[1] ?? ids[0]]
}

function UnitSelect({
  category,
  value,
  onChange,
  label,
}: {
  category: Category
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-2xl bg-surface-muted/70 px-4 py-3 pr-10 text-sm font-medium text-ink outline-none ring-1 ring-black/5 transition focus:ring-2 focus:ring-accent"
      >
        {category.units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.symbol})
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
      >
        ▾
      </span>
    </label>
  )
}

export default function Converter() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === categoryId)!,
    [categoryId],
  )

  const [pair, setPair] = useState<[string, string]>(() =>
    defaultPair(CATEGORIES[0]),
  )
  const [fromId, toId] = pair
  const [amount, setAmount] = useState('20')

  const numeric = Number(amount)
  const valid = amount.trim() !== '' && Number.isFinite(numeric)
  const result = valid ? convert(category, fromId, toId, numeric) : NaN

  function selectCategory(id: string) {
    const cat = CATEGORIES.find((c) => c.id === id)!
    setCategoryId(id)
    setPair(defaultPair(cat))
  }

  // Center button: walk the target unit forward through the category list in
  // order and loop back to the start, skipping the source unit so it never
  // lands on an identity conversion. Deterministic, so the "next" unit is
  // always predictable.
  function cycleTarget() {
    const ids = category.units.map((u) => u.id)
    const n = ids.length
    let idx = ids.indexOf(toId)
    for (let step = 0; step < n; step++) {
      idx = (idx + 1) % n
      if (ids[idx] !== fromId) {
        setPair([fromId, ids[idx]])
        return
      }
    }
  }

  const fromUnit = category.units.find((u) => u.id === fromId)!
  const toUnit = category.units.find((u) => u.id === toId)!

  // Pointer-driven 3D tilt for the hero card.
  const cardRef = useRef<HTMLDivElement>(null)
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 })
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(0)
  const rotateX = useTransform(rx, (v) => `${v}deg`)
  const rotateY = useTransform(ry, (v) => `${v}deg`)
  const glare = useMotionTemplate`radial-gradient(600px circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.18), transparent 45%)`

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 10)
    rx.set((0.5 - py) * 10)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }
  function onPointerLeave() {
    rx.set(0)
    ry.set(0)
  }

  // Category strip: on desktop there is no touch-scroll, so expose arrow
  // controls and translate a plain vertical wheel into horizontal scroll.
  const tabsRef = useRef<HTMLDivElement>(null)
  const [tabScroll, setTabScroll] = useState({ left: false, right: false })

  const updateTabArrows = useCallback(() => {
    const el = tabsRef.current
    if (!el) return
    setTabScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    updateTabArrows()
    const el = tabsRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
      updateTabArrows()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', updateTabArrows)
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', updateTabArrows)
    }
  }, [updateTabArrows])

  function scrollTabs(dir: -1 | 1) {
    const el = tabsRef.current
    if (!el) return
    el.scrollBy({
      left: dir * Math.max(el.clientWidth * 0.7, 220),
      behavior: 'smooth',
    })
  }

  return (
    <div className="w-full">
      {/* Category tabs */}
      <div className="relative mb-6">
        {/* Desktop scroll-left control */}
        <button
          type="button"
          onClick={() => scrollTabs(-1)}
          aria-label="Scroll categories left"
          className={`glass absolute left-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink transition-opacity sm:grid ${
            tabScroll.left ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          ref={tabsRef}
          onScroll={updateTabArrows}
          className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:px-11 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Conversion categories"
        >
          {CATEGORIES.map((c) => {
            const active = c.id === categoryId
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={active}
                onClick={() => selectCategory(c.id)}
                className={`relative flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  active ? 'text-white' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-2xl bg-accent shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10" aria-hidden>
                  {c.icon}
                </span>
                <span className="relative z-10 whitespace-nowrap">{c.name}</span>
              </button>
            )
          })}
        </div>

        {/* Desktop scroll-right control */}
        <button
          type="button"
          onClick={() => scrollTabs(1)}
          aria-label="Scroll categories right"
          className={`glass absolute right-0 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink transition-opacity sm:grid ${
            tabScroll.right ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Hero converter card */}
      <motion.div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="glass shadow-glass-lg relative overflow-hidden rounded-4xl p-6 sm:p-8"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glare }}
        />

        <div className="relative grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          {/* FROM */}
          <div className="rounded-3xl bg-surface/60 p-5 ring-1 ring-black/5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                From
              </span>
              <span className="font-mono text-xs text-accent">
                {fromUnit.symbol}
              </span>
            </div>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label={`Value in ${fromUnit.name}`}
              className="mb-4 w-full bg-transparent font-mono text-4xl font-bold text-ink outline-none placeholder:text-ink-muted/40 sm:text-5xl"
              placeholder="0"
            />
            <UnitSelect
              category={category}
              value={fromId}
              onChange={(v) => setPair([v, toId])}
              label="Convert from unit"
            />
          </div>

          {/* CYCLE: advance the target unit to the next one in the list */}
          <div className="flex items-center justify-center md:flex-col">
            <motion.button
              type="button"
              onClick={cycleTarget}
              whileTap={{ scale: 0.85, rotate: 120 }}
              aria-label="Cycle to the next unit"
              title="Next unit"
              className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white shadow-glow transition-colors hover:bg-accent-soft"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </motion.button>
          </div>

          {/* TO */}
          <div className="relative overflow-hidden rounded-3xl bg-accent/10 p-5 ring-1 ring-accent/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                To
              </span>
              <span className="font-mono text-xs text-accent">
                {toUnit.symbol}
              </span>
            </div>
            <div className="mb-4 min-h-[3rem] sm:min-h-[3.75rem]">
              <AnimatePresence mode="popLayout">
                <motion.output
                  key={`${result}-${toId}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="block break-words font-mono text-4xl font-bold text-accent sm:text-5xl"
                >
                  {valid ? formatResult(result) : '·'}
                </motion.output>
              </AnimatePresence>
            </div>
            <UnitSelect
              category={category}
              value={toId}
              onChange={(v) => setPair([fromId, v])}
              label="Convert to unit"
            />
          </div>
        </div>

        {/* Human-readable summary */}
        <p className="relative mt-6 text-center text-sm text-ink-muted">
          {valid ? (
            <>
              <span className="font-semibold text-ink">
                {formatResult(numeric)} {fromUnit.symbol}
              </span>{' '}
              equals{' '}
              <span className="font-semibold text-accent">
                {formatResult(result)} {toUnit.symbol}
              </span>
            </>
          ) : (
            'Enter a valid number to convert'
          )}
        </p>
      </motion.div>

      {/* Live reference grid: current value in every other unit */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          <span aria-hidden>{category.icon}</span>
          {category.name} · all units
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {category.units.map((u, i) => {
            const v = valid ? convert(category, fromId, u.id, numeric) : NaN
            const isSource = u.id === fromId
            return (
              <motion.button
                key={u.id}
                onClick={() => setPair([fromId, u.id])}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.3) }}
                className={`glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-glow ${
                  u.id === toId ? 'ring-2 ring-accent' : ''
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-ink-muted">
                    {u.name}
                  </span>
                  <span className="font-mono text-[11px] text-accent">
                    {u.symbol}
                  </span>
                </div>
                <div className="truncate font-mono text-lg font-bold text-ink">
                  {isSource ? formatResult(numeric) : formatResult(v)}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
