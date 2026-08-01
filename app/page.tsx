import Converter from '@/components/Converter'
import ThemeToggle from '@/components/ThemeToggle'
import { CATEGORIES } from '@/lib/units'

const features = [
  {
    icon: '⚡',
    title: 'Instant & accurate',
    body: 'Conversions update as you type, computed from precise SI factors, with no rounding surprises.',
  },
  {
    icon: '🧊',
    title: 'Immersive design',
    body: 'A glassmorphic, 3D-tilt interface with an animated aurora backdrop that feels alive.',
  },
  {
    icon: '📱',
    title: 'Mobile-first',
    body: 'Fully responsive, touch-friendly, installable as a PWA, and respectful of reduced motion.',
  },
  {
    icon: '🌗',
    title: 'Light & dark',
    body: 'A theme that follows your system and remembers your choice, with no flash on load.',
  },
]

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Convertly',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    description:
      'A modern, immersive unit converter for length, mass, volume, temperature, data and more.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: CATEGORIES.map((c) => c.name).join(', '),
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-xl shadow-glow">
            <span aria-hidden>🔁</span>
          </div>
          <div>
            <p className="text-lg font-bold leading-none tracking-tight">
              Convertly
            </p>
            <p className="text-xs text-ink-muted">Modern unit converter</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero copy */}
      <section className="mb-10 text-center">
        <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          {CATEGORIES.length} categories · {' '}
          {CATEGORIES.reduce((n, c) => n + c.units.length, 0)} units
        </span>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl">
          Convert anything,{' '}
          <span className="text-shimmer">beautifully</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-ink-muted sm:text-lg">
          A production-grade converter for length, mass, volume, temperature,
          data, energy and more. Precise, immersive and lightning fast.
        </p>
      </section>

      {/* App */}
      <section className="[perspective:1500px]">
        <Converter />
      </section>

      {/* Features */}
      <section className="mt-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-3xl p-5">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-accent/15 text-xl">
                <span aria-hidden>{f.icon}</span>
              </div>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-ink/10 pt-8 text-center text-sm text-ink-muted">
        {/* Support widget */}
        <div className="mb-6">
          <p className="mb-3 text-xs">
            Enjoying Convertly? Help support the project.
          </p>
          <a
            href="https://buymeacoffee.com/amuqtadir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FFDD00] px-5 py-3 font-semibold text-[#17130a] shadow-glass transition hover:-translate-y-0.5 hover:shadow-glass-lg"
          >
            <span aria-hidden>☕</span>
            Buy me a coffee
          </a>
        </div>
        <p>
          Built with Next.js, TypeScript, Tailwind CSS & Framer Motion. All
          conversions run locally in your browser.
        </p>
        <p className="mt-2">
          Made by{' '}
          <a
            href="https://www.amuqtadir.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            abdul muqtadir
          </a>
        </p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} Convertly · Open source
        </p>
      </footer>
    </main>
  )
}
