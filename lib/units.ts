/**
 * Unit conversion engine.
 *
 * Every unit declares how to convert to and from a category "base" unit.
 * Most conversions are linear (multiply by a factor); a few (temperature,
 * fuel economy) need custom functions, so the model supports both.
 */

export type Unit = {
  id: string
  name: string
  /** Short symbol, e.g. "km", "°C". */
  symbol: string
  /** Convert a value expressed in this unit into the category base unit. */
  toBase: (value: number) => number
  /** Convert a value expressed in the category base unit into this unit. */
  fromBase: (value: number) => number
}

export type Category = {
  id: string
  name: string
  /** A single emoji/icon glyph used in the UI. */
  icon: string
  /** Short human description of the base unit for tooltips/SEO. */
  baseUnit: string
  units: Unit[]
}

/** Helper for the common linear case: value_in_base = value * factor. */
const linear = (
  id: string,
  name: string,
  symbol: string,
  factor: number,
): Unit => ({
  id,
  name,
  symbol,
  toBase: (v) => v * factor,
  fromBase: (v) => v / factor,
})

/** Helper for offset-based units (temperature). */
const affine = (
  id: string,
  name: string,
  symbol: string,
  toBase: (v: number) => number,
  fromBase: (v: number) => number,
): Unit => ({ id, name, symbol, toBase, fromBase })

export const CATEGORIES: Category[] = [
  {
    id: 'length',
    name: 'Length',
    icon: '📏',
    baseUnit: 'meter',
    units: [
      linear('nm', 'Nanometer', 'nm', 1e-9),
      linear('um', 'Micrometer', 'µm', 1e-6),
      linear('mm', 'Millimeter', 'mm', 1e-3),
      linear('cm', 'Centimeter', 'cm', 1e-2),
      linear('m', 'Meter', 'm', 1),
      linear('km', 'Kilometer', 'km', 1000),
      linear('in', 'Inch', 'in', 0.0254),
      linear('ft', 'Foot', 'ft', 0.3048),
      linear('yd', 'Yard', 'yd', 0.9144),
      linear('mi', 'Mile', 'mi', 1609.344),
      linear('nmi', 'Nautical mile', 'nmi', 1852),
      linear('ly', 'Light-year', 'ly', 9.4607304725808e15),
    ],
  },
  {
    id: 'mass',
    name: 'Mass',
    icon: '⚖️',
    baseUnit: 'kilogram',
    units: [
      linear('mg', 'Milligram', 'mg', 1e-6),
      linear('g', 'Gram', 'g', 1e-3),
      linear('kg', 'Kilogram', 'kg', 1),
      linear('t', 'Metric ton', 't', 1000),
      linear('oz', 'Ounce', 'oz', 0.028349523125),
      linear('lb', 'Pound', 'lb', 0.45359237),
      linear('st', 'Stone', 'st', 6.35029318),
      linear('ton_us', 'US ton', 'ton', 907.18474),
      linear('ton_uk', 'Imperial ton', 'long ton', 1016.0469088),
      linear('ct', 'Carat', 'ct', 0.0002),
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: '🧪',
    baseUnit: 'liter',
    units: [
      linear('ml', 'Milliliter', 'mL', 1e-3),
      linear('l', 'Liter', 'L', 1),
      linear('m3', 'Cubic meter', 'm³', 1000),
      linear('tsp', 'Teaspoon (US)', 'tsp', 0.00492892159375),
      linear('tbsp', 'Tablespoon (US)', 'tbsp', 0.01478676478125),
      linear('floz', 'Fluid ounce (US)', 'fl oz', 0.0295735295625),
      linear('cup', 'Cup (US)', 'cup', 0.2365882365),
      linear('pt', 'Pint (US)', 'pt', 0.473176473),
      linear('qt', 'Quart (US)', 'qt', 0.946352946),
      linear('gal', 'Gallon (US)', 'gal', 3.785411784),
      linear('gal_uk', 'Gallon (UK)', 'gal', 4.54609),
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    baseUnit: 'kelvin',
    units: [
      affine(
        'c',
        'Celsius',
        '°C',
        (v) => v + 273.15,
        (v) => v - 273.15,
      ),
      affine(
        'f',
        'Fahrenheit',
        '°F',
        (v) => (v - 32) * (5 / 9) + 273.15,
        (v) => (v - 273.15) * (9 / 5) + 32,
      ),
      affine(
        'k',
        'Kelvin',
        'K',
        (v) => v,
        (v) => v,
      ),
      affine(
        'r',
        'Rankine',
        '°R',
        (v) => v * (5 / 9),
        (v) => v * (9 / 5),
      ),
    ],
  },
  {
    id: 'area',
    name: 'Area',
    icon: '🗺️',
    baseUnit: 'square meter',
    units: [
      linear('mm2', 'Square millimeter', 'mm²', 1e-6),
      linear('cm2', 'Square centimeter', 'cm²', 1e-4),
      linear('m2', 'Square meter', 'm²', 1),
      linear('ha', 'Hectare', 'ha', 10000),
      linear('km2', 'Square kilometer', 'km²', 1e6),
      linear('in2', 'Square inch', 'in²', 0.00064516),
      linear('ft2', 'Square foot', 'ft²', 0.09290304),
      linear('yd2', 'Square yard', 'yd²', 0.83612736),
      linear('ac', 'Acre', 'ac', 4046.8564224),
      linear('mi2', 'Square mile', 'mi²', 2589988.110336),
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: '🚀',
    baseUnit: 'meter/second',
    units: [
      linear('mps', 'Meter/second', 'm/s', 1),
      linear('kph', 'Kilometer/hour', 'km/h', 1000 / 3600),
      linear('mph', 'Mile/hour', 'mph', 1609.344 / 3600),
      linear('fps', 'Foot/second', 'ft/s', 0.3048),
      linear('kn', 'Knot', 'kn', 1852 / 3600),
      linear('mach', 'Mach (sea level)', 'Ma', 340.29),
    ],
  },
  {
    id: 'time',
    name: 'Time',
    icon: '⏱️',
    baseUnit: 'second',
    units: [
      linear('ns', 'Nanosecond', 'ns', 1e-9),
      linear('ms', 'Millisecond', 'ms', 1e-3),
      linear('s', 'Second', 's', 1),
      linear('min', 'Minute', 'min', 60),
      linear('h', 'Hour', 'h', 3600),
      linear('d', 'Day', 'd', 86400),
      linear('wk', 'Week', 'wk', 604800),
      linear('mo', 'Month (30 d)', 'mo', 2592000),
      linear('yr', 'Year (365 d)', 'yr', 31536000),
    ],
  },
  {
    id: 'digital',
    name: 'Digital storage',
    icon: '💾',
    baseUnit: 'byte',
    units: [
      linear('bit', 'Bit', 'bit', 1 / 8),
      linear('B', 'Byte', 'B', 1),
      linear('kB', 'Kilobyte', 'kB', 1e3),
      linear('MB', 'Megabyte', 'MB', 1e6),
      linear('GB', 'Gigabyte', 'GB', 1e9),
      linear('TB', 'Terabyte', 'TB', 1e12),
      linear('PB', 'Petabyte', 'PB', 1e15),
      linear('KiB', 'Kibibyte', 'KiB', 1024),
      linear('MiB', 'Mebibyte', 'MiB', 1024 ** 2),
      linear('GiB', 'Gibibyte', 'GiB', 1024 ** 3),
      linear('TiB', 'Tebibyte', 'TiB', 1024 ** 4),
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: '🎈',
    baseUnit: 'pascal',
    units: [
      linear('pa', 'Pascal', 'Pa', 1),
      linear('kpa', 'Kilopascal', 'kPa', 1000),
      linear('bar', 'Bar', 'bar', 100000),
      linear('psi', 'Pound/inch²', 'psi', 6894.757293168),
      linear('atm', 'Atmosphere', 'atm', 101325),
      linear('torr', 'Torr', 'Torr', 101325 / 760),
      linear('mmhg', 'mm of mercury', 'mmHg', 133.322387415),
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    baseUnit: 'joule',
    units: [
      linear('j', 'Joule', 'J', 1),
      linear('kj', 'Kilojoule', 'kJ', 1000),
      linear('cal', 'Calorie', 'cal', 4.184),
      linear('kcal', 'Kilocalorie', 'kcal', 4184),
      linear('wh', 'Watt-hour', 'Wh', 3600),
      linear('kwh', 'Kilowatt-hour', 'kWh', 3.6e6),
      linear('ev', 'Electronvolt', 'eV', 1.602176634e-19),
      linear('btu', 'British thermal unit', 'BTU', 1055.05585262),
      linear('ftlb', 'Foot-pound', 'ft·lb', 1.3558179483314004),
    ],
  },
  {
    id: 'power',
    name: 'Power',
    icon: '🔌',
    baseUnit: 'watt',
    units: [
      linear('w', 'Watt', 'W', 1),
      linear('kw', 'Kilowatt', 'kW', 1000),
      linear('mw', 'Megawatt', 'MW', 1e6),
      linear('hp', 'Horsepower (mech)', 'hp', 745.6998715822702),
      linear('hp_m', 'Horsepower (metric)', 'PS', 735.49875),
      linear('btuh', 'BTU/hour', 'BTU/h', 0.29307107017),
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    icon: '📐',
    baseUnit: 'radian',
    units: [
      linear('deg', 'Degree', '°', Math.PI / 180),
      linear('rad', 'Radian', 'rad', 1),
      linear('grad', 'Gradian', 'grad', Math.PI / 200),
      linear('arcmin', 'Arcminute', "'", Math.PI / 10800),
      linear('arcsec', 'Arcsecond', '"', Math.PI / 648000),
      linear('turn', 'Turn', 'turn', 2 * Math.PI),
    ],
  },
  {
    id: 'data-rate',
    name: 'Data rate',
    icon: '📡',
    baseUnit: 'bit/second',
    units: [
      linear('bps', 'Bit/second', 'bps', 1),
      linear('kbps', 'Kilobit/second', 'kbps', 1e3),
      linear('mbps', 'Megabit/second', 'Mbps', 1e6),
      linear('gbps', 'Gigabit/second', 'Gbps', 1e9),
      linear('Bps', 'Byte/second', 'B/s', 8),
      linear('kBps', 'Kilobyte/second', 'kB/s', 8e3),
      linear('mBps', 'Megabyte/second', 'MB/s', 8e6),
    ],
  },
  {
    id: 'fuel',
    name: 'Fuel economy',
    icon: '⛽',
    baseUnit: 'kilometer/liter',
    units: [
      linear('kmpl', 'Kilometer/liter', 'km/L', 1),
      // mpg (US): 1 mpg = 0.425143707 km/L
      linear('mpg_us', 'Miles/gallon (US)', 'mpg', 0.4251437074976825),
      linear('mpg_uk', 'Miles/gallon (UK)', 'mpg', 0.3540061899559737),
      // L/100km is inverse: km/L = 100 / (L/100km)
      affine(
        'l100km',
        'Liters/100 km',
        'L/100km',
        (v) => (v === 0 ? 0 : 100 / v),
        (v) => (v === 0 ? 0 : 100 / v),
      ),
    ],
  },
]

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

/** Convert a value from one unit to another within the same category. */
export function convert(
  category: Category,
  fromId: string,
  toId: string,
  value: number,
): number {
  const from = category.units.find((u) => u.id === fromId)
  const to = category.units.find((u) => u.id === toId)
  if (!from || !to) return NaN
  return to.fromBase(from.toBase(value))
}

/**
 * Format a numeric result for display: trims noise, keeps meaningful
 * precision, and falls back to exponential notation for very large/small
 * magnitudes so the UI never shows an unreadable wall of zeros.
 */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  const abs = Math.abs(value)
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
    return value.toExponential(6).replace(/\.?0+e/, 'e')
  }
  // Up to 8 significant-ish digits, then strip trailing zeros.
  const rounded = Number(value.toPrecision(8))
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 8 })
}
