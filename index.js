/**
 * tafel-plugin-roman — Roman numeral converter for Tafel.
 *
 * Supported inputs:
 *   42 to roman       → XLII
 *   42 in roman       → XLII
 *   roman 42          → XLII
 *   XLII to dec       → 42
 *   XLII to decimal   → 42
 *   XLII in dec       → 42
 *   XLII              → 42  (auto-detect pure roman numeral input)
 *
 * Range: 1–3999 (standard roman numeral range).
 */

// ─── Conversion tables ───────────────────────────────────────

const ROMAN_VALUES = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

const ROMAN_MAP = {
  I: 1, V: 5, X: 10, L: 50,
  C: 100, D: 500, M: 1000,
}

// ─── Helpers ─────────────────────────────────────────────────

function toRoman(num) {
  if (num < 1 || num > 3999) return null
  let result = ''
  for (const [value, numeral] of ROMAN_VALUES) {
    while (num >= value) {
      result += numeral
      num -= value
    }
  }
  return result
}

function fromRoman(str) {
  const upper = str.toUpperCase()
  if (!/^[MDCLXVI]+$/.test(upper)) return null

  let total = 0
  for (let i = 0; i < upper.length; i++) {
    const current = ROMAN_MAP[upper[i]]
    const next = ROMAN_MAP[upper[i + 1]]
    if (current === undefined) return null
    if (next && current < next) {
      total -= current
    } else {
      total += current
    }
  }

  // Validate by round-tripping
  if (total < 1 || total > 3999) return null
  if (toRoman(total) !== upper) return null

  return total
}

function isRomanNumeral(str) {
  return /^[MDCLXVI]+$/i.test(str) && fromRoman(str) !== null
}

// ─── Patterns ────────────────────────────────────────────────

const TO_ROMAN_RE = /^(\d+)\s+(?:to|in)\s+roman$/i
const ROMAN_PREFIX_RE = /^roman\s+(\d+)$/i
const TO_DEC_RE = /^([MDCLXVI]+)\s+(?:to|in)\s+(?:dec|decimal|arabic|number)$/i

// ─── Plugin ──────────────────────────────────────────────────

const plugin = {
  id: 'community:roman-numerals',
  name: 'Roman Numerals',
  version: '1.0.0',
  description: 'Convert between arabic and roman numerals (1–3999)',
  author: 'bsteinig',
  source: 'community',

  examples: [
    { input: '42 to roman', output: 'XLII' },
    { input: 'roman 2025', output: 'MMXXV' },
    { input: 'XLII to dec', output: '42' },
    { input: 'XIV', output: '14' },
  ],

  action: {
    priority: 100,
    resultType: 'string',

    match(ctx) {
      const input = ctx.input

      // "42 to roman" / "42 in roman"
      if (TO_ROMAN_RE.test(input)) return true

      // "roman 42"
      if (ROMAN_PREFIX_RE.test(input)) return true

      // "XLII to dec" / "XLII to decimal"
      if (TO_DEC_RE.test(input)) return true

      // Bare roman numeral: "XIV", "MCMXCIX"
      if (isRomanNumeral(input)) return true

      return false
    },

    evaluate(ctx) {
      const input = ctx.input

      // "42 to roman"
      let m = input.match(TO_ROMAN_RE)
      if (m) {
        const num = parseInt(m[1], 10)
        const roman = toRoman(num)
        return roman ?? `Error: ${num} is out of range (1–3999)`
      }

      // "roman 42"
      m = input.match(ROMAN_PREFIX_RE)
      if (m) {
        const num = parseInt(m[1], 10)
        const roman = toRoman(num)
        return roman ?? `Error: ${num} is out of range (1–3999)`
      }

      // "XLII to dec"
      m = input.match(TO_DEC_RE)
      if (m) {
        const val = fromRoman(m[1])
        return val !== null ? String(val) : `Error: invalid roman numeral "${m[1]}"`
      }

      // Bare roman numeral
      if (isRomanNumeral(input)) {
        const val = fromRoman(input)
        return val !== null ? String(val) : null
      }

      return null
    },
  },
}

export default plugin
