// @ts-check
/**
 * Korvai's Made Easy — Core Algorithm & Mathematical Engine
 * Pure ES Module with zero DOM dependencies (runs in Browser & Node).
 */

/**
 * @typedef {Object} NadaiSpec
 * @property {string} id - Canonical token string (e.g. '4', '10', '3/2', '2/3', '4/3')
 * @property {string} label - Display label on button/chip (e.g. '1½', '2/3', '4/3')
 * @property {number} num - Numerator p of syllables per beat (p/q)
 * @property {number} den - Denominator q of syllables per beat (p/q)
 * @property {number} div - Beat subdivision denominator for entry alignment (1/div of a beat)
 * @property {string} family - Nadai family ID for grouping & color coding
 * @property {string} name - Traditional Carnatic speed name
 */

/**
 * @typedef {Object} NadaiFamily
 * @property {string} id
 * @property {string} label
 * @property {string} subtitle
 * @property {string[]} speeds
 */

/** @type {Record<string, NadaiSpec>} */
export const NADAI_CATALOG = {
  '1': {
    id: '1',
    label: '1',
    num: 1,
    den: 1,
    div: 1,
    family: 'chaturshram',
    name: 'Chaturshra Athi Keez Kaalam',
  },
  '2': {
    id: '2',
    label: '2',
    num: 2,
    den: 1,
    div: 4,
    family: 'chaturshram',
    name: 'Chaturshra Keez Kaalam',
  },
  '4': {
    id: '4',
    label: '4',
    num: 4,
    den: 1,
    div: 4,
    family: 'chaturshram',
    name: 'Chaturshram (Sama Kaalam)',
  },
  '8': {
    id: '8',
    label: '8',
    num: 8,
    den: 1,
    div: 8,
    family: 'chaturshram',
    name: 'Chaturshra Mel Kaalam',
  },
  '3/2': {
    id: '3/2',
    label: '1½',
    num: 3,
    den: 2,
    div: 3,
    family: 'trishram',
    name: 'Trishra Keez Kaalam',
  },
  '3': {
    id: '3',
    label: '3',
    num: 3,
    den: 1,
    div: 3,
    family: 'trishram',
    name: 'Trishram',
  },
  '6': {
    id: '6',
    label: '6',
    num: 6,
    den: 1,
    div: 6,
    family: 'trishram',
    name: 'Trishra Mel Kaalam',
  },
  '2/3': {
    id: '2/3',
    label: '2/3',
    num: 2,
    den: 3,
    div: 4,
    family: 'chaturshra_trishram',
    name: 'Chaturshra Trishram Keez Kaalam',
  },
  '4/3': {
    id: '4/3',
    label: '4/3',
    num: 4,
    den: 3,
    div: 4,
    family: 'chaturshra_trishram',
    name: 'Chaturshra Trishram',
  },
  '8/3': {
    id: '8/3',
    label: '8/3',
    num: 8,
    den: 3,
    div: 8,
    family: 'chaturshra_trishram',
    name: 'Chaturshra Trishram Mel Kaalam',
  },
  '5': {
    id: '5',
    label: '5',
    num: 5,
    den: 1,
    div: 5,
    family: 'khandam',
    name: 'Khandam',
  },
  '10': {
    id: '10',
    label: '10',
    num: 10,
    den: 1,
    div: 10,
    family: 'khandam',
    name: 'Khanda Mel Kaalam',
  },
  '7': {
    id: '7',
    label: '7',
    num: 7,
    den: 1,
    div: 7,
    family: 'mishram',
    name: 'Mishram',
  },
  '9': {
    id: '9',
    label: '9',
    num: 9,
    den: 1,
    div: 9,
    family: 'sankeernam',
    name: 'Sankeernam',
  },
};

/** @type {NadaiFamily[]} */
export const NADAI_FAMILIES = [
  {
    id: 'chaturshram',
    label: 'Chaturshram',
    subtitle: '1, 2, 4, 8 syllables / beat',
    speeds: ['1', '2', '4', '8'],
  },
  {
    id: 'trishram',
    label: 'Trishram',
    subtitle: '1½, 3, 6 syllables / beat',
    speeds: ['3/2', '3', '6'],
  },
  {
    id: 'chaturshra_trishram',
    label: 'Chaturshra Trishram',
    subtitle: '2/3, 4/3, 8/3 syllables / beat',
    speeds: ['2/3', '4/3', '8/3'],
  },
  {
    id: 'khandam',
    label: 'Khandam',
    subtitle: '5, 10 syllables / beat',
    speeds: ['5', '10'],
  },
  {
    id: 'mishram',
    label: 'Mishram',
    subtitle: '7 syllables / beat',
    speeds: ['7'],
  },
  {
    id: 'sankeernam',
    label: 'Sankeernam',
    subtitle: '9 syllables / beat',
    speeds: ['9'],
  },
];

/**
 * Common Carnatic Thalam presets (in default speed of 4 syllables / beat).
 */
export const THALAM_PRESETS = [
  { label: 'Adi Thalam (8 beats = 32)', beats: 8, syllables: 32 },
  { label: 'Adi Thalam 2 Kalai (16 beats = 64)', beats: 16, syllables: 64 },
  { label: 'Rupaka Thalam (3 beats = 12)', beats: 3, syllables: 12 },
  { label: 'Rupaka Thalam (6 beats = 24)', beats: 6, syllables: 24 },
  { label: 'Khanda Chapu (2½ beats = 10)', beats: 2.5, syllables: 10 },
  { label: 'Mishra Chapu (3½ beats = 14)', beats: 3.5, syllables: 14 },
  { label: 'Sankeerna Chapu (4½ beats = 18)', beats: 4.5, syllables: 18 },
  { label: 'Khanda Eka (5 beats = 20)', beats: 5, syllables: 20 },
  { label: 'Mishra Jhampa (10 beats = 40)', beats: 10, syllables: 40 },
  { label: 'Khanda Triputa (9 beats = 36)', beats: 9, syllables: 36 },
  { label: 'Chaturshra Ata (12 beats = 48)', beats: 12, syllables: 48 },
  { label: 'Khanda Ata (14 beats = 56)', beats: 14, syllables: 56 },
];

/**
 * Greatest common divisor of two integers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a, b) {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x === 0 ? 1 : x;
}

/**
 * Least common multiple of two positive integers.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}

/**
 * Least common multiple across an array of positive integers.
 * @param {number[]} nums
 * @returns {number}
 */
export function lcmArray(nums) {
  return nums.reduce((acc, n) => lcm(acc, n), 1);
}

/**
 * Formats a rational number num/den as a human-readable beat string (e.g. "2 ¾", "1 ⅓", "3").
 * @param {number} num
 * @param {number} den
 * @returns {string}
 */
export function formatFraction(num, den) {
  if (den <= 0) throw new Error('Denominator must be positive');
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  if (d === 1) return `${n}`;
  const whole = Math.trunc(n / d);
  const rem = Math.abs(n % d);
  /** @type {Record<string, string>} */
  const vulgarMap = {
    '1/2': '½',
    '1/3': '⅓',
    '2/3': '⅔',
    '1/4': '¼',
    '3/4': '¾',
    '1/5': '⅕',
    '2/5': '⅖',
    '3/5': '⅗',
    '4/5': '⅘',
    '1/6': '⅙',
    '5/6': '⅚',
    '1/8': '⅛',
    '3/8': '⅜',
    '5/8': '⅝',
    '7/8': '⅞',
  };
  const fracKey = `${rem}/${d}`;
  const fracStr = vulgarMap[fracKey] || fracKey;
  if (whole === 0) return n < 0 ? `-${fracStr}` : fracStr;
  return `${whole} ${fracStr}`;
}

/**
 * Parses a single nadai token (e.g. "4", "10", "3/2", "1½", "1.5", "2/3", "4/3") into a NadaiSpec.
 * Supports catalog speeds as well as arbitrary positive rational p/q if needed.
 * @param {string | number | NadaiSpec} token
 * @returns {NadaiSpec}
 */
export function parseNadaiToken(token) {
  if (typeof token === 'object' && token !== null && typeof token.num === 'number') {
    return {
      ...token,
      div: token.div ?? token.num,
    };
  }
  const str = String(token).trim();
  if (str === '1½' || str === '1 1/2' || str === '1.5') {
    return NADAI_CATALOG['3/2'];
  }
  if (NADAI_CATALOG[str]) {
    return NADAI_CATALOG[str];
  }
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length !== 2) {
      throw new Error(`Invalid fractional nadai token: "${str}"`);
    }
    const num = Number(parts[0].trim());
    const den = Number(parts[1].trim());
    if (!Number.isInteger(num) || !Number.isInteger(den) || num <= 0 || den <= 0) {
      throw new Error(`Invalid fractional nadai values in "${str}"`);
    }
    const g = gcd(num, den);
    const rn = num / g;
    const rd = den / g;
    const id = rd === 1 ? `${rn}` : `${rn}/${rd}`;
    if (NADAI_CATALOG[id]) return NADAI_CATALOG[id];
    return {
      id,
      label: id,
      num: rn,
      den: rd,
      div: rn,
      family: 'chaturshra_trishram',
      name: `Custom (${id})`,
    };
  }
  const n = Number(str);
  if (!Number.isInteger(n) || n < 1 || n > 10) {
    throw new Error(`Unsupported nadai speed "${str}".`);
  }
  return NADAI_CATALOG[String(n)];
}

/**
 * Tokenizes a group chunk like "66", "6 6", "6.6", "10.10", "4/3.4/3", "3/2", "2/3", "1½"
 * into individual nadai token strings.
 * @param {string} chunk
 * @returns {string[]}
 */
function tokenizeGroupChunk(chunk) {
  const trimmed = chunk.trim().replace(/1\s+1\/2/g, '3/2');
  if (!trimmed) return [];

  // If separated by spaces, dots, commas, or underscores, split on those delimiters
  if (/[\s.,_]+/.test(trimmed)) {
    return trimmed
      .split(/[\s.,_]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Exact match for a single catalog speed or alias
  if (NADAI_CATALOG[trimmed] || trimmed === '1½') {
    return [trimmed === '1½' ? '3/2' : trimmed];
  }

  // Otherwise scan left-to-right matching "8/3", "4/3", "2/3", "3/2", "1½", "10", or single digits "1"-"9"
  /** @type {string[]} */
  const tokens = [];
  let i = 0;
  while (i < trimmed.length) {
    if (
      trimmed.startsWith('8/3', i) ||
      trimmed.startsWith('4/3', i) ||
      trimmed.startsWith('2/3', i) ||
      trimmed.startsWith('3/2', i)
    ) {
      tokens.push(trimmed.slice(i, i + 3));
      i += 3;
    } else if (trimmed.startsWith('1½', i)) {
      tokens.push('3/2');
      i += 2;
    } else if (trimmed.startsWith('10', i)) {
      tokens.push('10');
      i += 2;
    } else {
      const ch = trimmed[i];
      if (ch >= '1' && ch <= '9') {
        tokens.push(ch);
        i += 1;
      } else {
        throw new Error(`Invalid character "${ch}" in nadai sequence "${chunk}"`);
      }
    }
  }
  return tokens;
}

/**
 * Converts a keypad token array (e.g. ['3', '3', '4'] or ['4', '-', '6', '6', '-', '8', '8', '8'])
 * into structured groups of NadaiSpec objects.
 *
 * Grouping Rule:
 * - If no '-' separator is present in the token array, EACH nadai is its own group of size 1.
 * - If one or more '-' separators are present, tokens between '-' separators form groups.
 *
 * @param {string[]} rawTokens
 * @returns {NadaiSpec[][]}
 */
export function tokensToGroups(rawTokens) {
  if (!Array.isArray(rawTokens)) {
    throw new Error('Expected an array of tokens');
  }
  const cleaned = rawTokens.map((t) => String(t).trim()).filter(Boolean);
  if (cleaned.length === 0) {
    throw new Error('Nadai sequence cannot be empty');
  }

  const hasSeparator = cleaned.includes('-');
  if (!hasSeparator) {
    return cleaned.map((t) => [parseNadaiToken(t)]);
  }

  /** @type {NadaiSpec[][]} */
  const groups = [];
  /** @type {NadaiSpec[]} */
  let currentGroup = [];
  for (const tok of cleaned) {
    if (tok === '-') {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    } else {
      currentGroup.push(parseNadaiToken(tok));
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  if (groups.length === 0) {
    throw new Error('Nadai sequence contains no speeds');
  }
  return groups;
}

/**
 * Parses a human/URL nadai string or token list into structured NadaiSpec groups.
 * Examples:
 * - "3 3 4"        -> [[3], [3], [4]] (3 singleton groups)
 * - "334"          -> [[3], [3], [4]] (3 singleton groups, since no '-' is present)
 * - "4-66-888"     -> [[4], [6, 6], [8, 8, 8]]
 * - "4-6.6-8.8.8"  -> [[4], [6, 6], [8, 8, 8]]
 * - "4/3-4.4"      -> [[4/3], [4, 4]]
 *
 * @param {string | string[]} input
 * @returns {NadaiSpec[][]}
 */
export function parseNadaiGroups(input) {
  if (Array.isArray(input)) {
    return tokensToGroups(input);
  }
  if (typeof input !== 'string') {
    throw new Error('Nadai sequence must be a string or token array');
  }
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Nadai sequence cannot be empty');
  }

  if (trimmed.includes('-')) {
    const rawGroupStrings = trimmed
      .split('-')
      .map((g) => g.trim())
      .filter(Boolean);
    if (rawGroupStrings.length === 0) {
      throw new Error('Nadai sequence contains no speeds');
    }
    return rawGroupStrings.map((gStr) => {
      const toks = tokenizeGroupChunk(gStr);
      if (toks.length === 0) {
        throw new Error(`Empty group in nadai sequence "${trimmed}"`);
      }
      return toks.map((t) => parseNadaiToken(t));
    });
  }

  // No '-' delimiter: every individual nadai is its own singleton group
  const flatTokens = tokenizeGroupChunk(trimmed);
  if (flatTokens.length === 0) {
    throw new Error('Nadai sequence contains no speeds');
  }
  return flatTokens.map((t) => [parseNadaiToken(t)]);
}

/**
 * Converts a string or NadaiSpec[][] into a normalized keypad token array (e.g. ['4', '-', '6', '6']).
 * @param {string | string[]} input
 * @returns {string[]}
 */
export function parseToKeypadTokens(input) {
  if (Array.isArray(input)) {
    return input.map((t) => String(t).trim()).filter(Boolean);
  }
  const trimmed = String(input || '').trim();
  if (!trimmed) return [];
  const hasExplicitHyphen = trimmed.includes('-');
  const groups = parseNadaiGroups(trimmed);
  if (!hasExplicitHyphen && groups.every((g) => g.length === 1)) {
    return groups.map((g) => g[0].id);
  }
  /** @type {string[]} */
  const tokens = [];
  groups.forEach((g, idx) => {
    if (idx > 0) tokens.push('-');
    for (const spec of g) {
      tokens.push(spec.id);
    }
  });
  return tokens;
}

/**
 * Serializes keypad tokens into a clean, URL-safe string.
 * - Without '-': joins tokens with '.' (or compact if all single digits, e.g. "3.3.4" or "4/3.4")
 * - With '-': joins tokens within each group with '.' when needed or compactly (e.g. "4-66-888" or "4/3-44")
 * @param {string[]} tokens
 * @returns {string}
 */
export function serializeTokensToParam(tokens) {
  const cleaned = tokens.map((t) => String(t).trim()).filter(Boolean);
  if (cleaned.length === 0) return '';
  if (!cleaned.includes('-')) {
    return cleaned.join(' ');
  }
  const groups = tokensToGroups(cleaned);
  return groups
    .map((g) => {
      const ids = g.map((spec) => spec.id);
      const allSingleDigit = ids.every((id) => id.length === 1);
      return allSingleDigit ? ids.join('') : ids.join('.');
    })
    .join('-');
}

/**
 * Formats groups for human display (e.g. "3 3 4" or "4 - 66 - 888" or "4/3 - 4 4").
 * @param {NadaiSpec[][]} groups
 * @param {boolean} [explicitGrouping]
 * @returns {string}
 */
export function formatGroupsDisplay(groups, explicitGrouping) {
  const hasMultiElementGroup = groups.some((g) => g.length > 1);
  const useHyphen = explicitGrouping ?? hasMultiElementGroup;
  if (!useHyphen) {
    return groups.map((g) => g[0].id).join(' ');
  }
  return groups
    .map((g) => {
      const ids = g.map((s) => s.id);
      const allSingleDigit = ids.every((id) => id.length === 1);
      return allSingleDigit ? ids.join('') : ids.join(' ');
    })
    .join('-');
}

/**
 * Evaluates whether playing `groupLengths` across `groups` satisfies all entry and exit
 * divisibility constraints.
 *
 * Mathematical model:
 * - Each segment has nadai N_i = p_i / q_i syllables per beat.
 * - Entry alignment before segment i: cumulative beats t_{i-1} must be divisible by 1 / p_i.
 * - Playing length ell_i syllables in segment i adds ell_i * (q_i / p_i) beats.
 * - Exit alignment after all segments: total beats t_m must be divisible by 1 / 4 (default speed = 4).
 *
 * @param {NadaiSpec[][]} groups
 * @param {number[]} groupLengths
 * @returns {{
 *   valid: boolean,
 *   durationSyllables: number | null,
 *   durationBeatsFormatted: string | null,
 *   ticksPerBeat: number,
 *   totalTicks: number,
 *   steps: Array<{
 *     groupIndex: number,
 *     segmentIndex: number,
 *     nadai: NadaiSpec,
 *     length: number,
 *     startBeatsFormatted: string,
 *     endBeatsFormatted: string,
 *     entryValid: boolean
 *   }>,
 *   exitValid: boolean
 * }}
 */
export function evaluateSequence(groups, groupLengths) {
  if (groups.length !== groupLengths.length) {
    throw new Error(
      `Group count (${groups.length}) must match groupLengths count (${groupLengths.length})`
    );
  }

  const flatSpecs = groups.flat();
  const M = lcmArray([4, ...flatSpecs.map((s) => lcm(s.num, s.div ?? s.num))]);

  let ticks = 0;
  let segmentIndex = 0;
  let allEntriesValid = true;
  /** @type {Array<{groupIndex: number, segmentIndex: number, nadai: NadaiSpec, length: number, startBeatsFormatted: string, endBeatsFormatted: string, entryValid: boolean}>} */
  const steps = [];

  for (let gIdx = 0; gIdx < groups.length; gIdx++) {
    const group = groups[gIdx];
    const length = groupLengths[gIdx];
    for (const spec of group) {
      const divFactor = spec.div ?? spec.num;
      const entryStepTicks = M / divFactor;
      const entryValid = ticks % entryStepTicks === 0;
      if (!entryValid) {
        allEntriesValid = false;
      }
      const startTicks = ticks;
      const durationStepTicks = M / spec.num;
      const deltaTicks = length * spec.den * durationStepTicks;
      ticks += deltaTicks;

      steps.push({
        groupIndex: gIdx,
        segmentIndex,
        nadai: spec,
        length,
        startBeatsFormatted: formatFraction(startTicks, M),
        endBeatsFormatted: formatFraction(ticks, M),
        entryValid,
      });
      segmentIndex++;
    }
  }

  const exitStepTicks = M / 4;
  const exitValid = ticks % exitStepTicks === 0;
  const valid = allEntriesValid && exitValid;
  const durationSyllables = valid ? ticks / exitStepTicks : null;
  const durationBeatsFormatted = valid ? formatFraction(ticks, M) : null;

  return {
    valid,
    durationSyllables,
    durationBeatsFormatted,
    ticksPerBeat: M,
    totalTicks: ticks,
    steps,
    exitValid,
  };
}

/**
 * Fast integer-only check used inside inner search loops.
 * Returns total duration in default-speed syllables (4/beat) if valid, else null.
 * @param {NadaiSpec[][]} groups
 * @param {number[]} groupLengths
 * @param {number} M - Precomputed ticksPerBeat = lcm(4, p_1, ..., p_m)
 * @returns {number | null}
 */
export function evaluateDurationFast(groups, groupLengths, M) {
  let ticks = 0;
  for (let gIdx = 0; gIdx < groups.length; gIdx++) {
    const group = groups[gIdx];
    const length = groupLengths[gIdx];
    for (let i = 0; i < group.length; i++) {
      const spec = group[i];
      const divFactor = spec.div ?? spec.num;
      const entryStep = M / divFactor;
      if (ticks % entryStep !== 0) {
        return null;
      }
      const durationStep = M / spec.num;
      ticks += length * spec.den * durationStep;
    }
  }
  const exitStep = M / 4;
  if (ticks % exitStep !== 0) {
    return null;
  }
  return ticks / exitStep;
}

/**
 * Finds the `basic` kernel: the smallest positive integer L >= 1 such that playing
 * uniform length [L, L, ..., L] across all groups is rhythmically valid.
 *
 * @param {NadaiSpec[][] | string | string[]} groupsOrInput
 * @returns {{
 *   length: number,
 *   lengths: number[],
 *   duration: number,
 *   beatsFormatted: string,
 *   summary: string,
 *   evaluation: ReturnType<typeof evaluateSequence>
 * }}
 */
export function findBasic(groupsOrInput) {
  const groups =
    Array.isArray(groupsOrInput) && Array.isArray(groupsOrInput[0])
      ? /** @type {NadaiSpec[][]} */ (groupsOrInput)
      : parseNadaiGroups(/** @type {string | string[]} */ (groupsOrInput));

  const flatSpecs = groups.flat();
  const M = lcmArray([4, ...flatSpecs.map((s) => lcm(s.num, s.div ?? s.num))]);
  const k = groups.length;

  for (let L = 1; L <= M; L++) {
    const lengths = new Array(k).fill(L);
    const dur = evaluateDurationFast(groups, lengths, M);
    if (dur !== null) {
      const evaluation = evaluateSequence(groups, lengths);
      return {
        length: L,
        lengths,
        duration: dur,
        beatsFormatted: formatFraction(dur, 4),
        summary: `${L} is to ${dur}`,
        evaluation,
      };
    }
  }
  throw new Error('No valid basic kernel found within theoretical bound');
}

/**
 * Finds the `difference_basic` kernel: the arithmetic progression
 * L_r = s + (r - 1) * d (for r = 1..k) with smallest common difference d >= 1
 * and smallest starting length s >= 1 that is rhythmically valid.
 *
 * @param {NadaiSpec[][] | string | string[]} groupsOrInput
 * @returns {{
 *   start: number,
 *   step: number,
 *   lengths: number[],
 *   duration: number,
 *   beatsFormatted: string,
 *   summary: string,
 *   evaluation: ReturnType<typeof evaluateSequence>
 * }}
 */
export function findDifferenceBasic(groupsOrInput) {
  const groups =
    Array.isArray(groupsOrInput) && Array.isArray(groupsOrInput[0])
      ? /** @type {NadaiSpec[][]} */ (groupsOrInput)
      : parseNadaiGroups(/** @type {string | string[]} */ (groupsOrInput));

  const flatSpecs = groups.flat();
  const M = lcmArray([4, ...flatSpecs.map((s) => lcm(s.num, s.div ?? s.num))]);
  const k = groups.length;

  for (let d = 1; d <= M; d++) {
    for (let s = 1; s <= M; s++) {
      const lengths = [];
      for (let r = 0; r < k; r++) {
        lengths.push(s + r * d);
      }
      const dur = evaluateDurationFast(groups, lengths, M);
      if (dur !== null) {
        const evaluation = evaluateSequence(groups, lengths);
        return {
          start: s,
          step: d,
          lengths,
          duration: dur,
          beatsFormatted: formatFraction(dur, 4),
          summary: `${lengths.join(' ')} is to ${dur}`,
          evaluation,
        };
      }
    }
  }
  throw new Error('No valid difference_basic kernel found within theoretical bound');
}

/**
 * @typedef {Object} KorvaiSolution
 * @property {number} a - Multiplier for basic (a >= 0)
 * @property {number} b - Multiplier for difference_basic (b >= 0)
 * @property {number[]} groupLengths - Phrase length for each group r = 1..k
 * @property {number[]} segmentLengths - Phrase length expanded for each individual nadai segment
 * @property {number} startLength - Starting phrase length (group 1)
 * @property {number} progressionStep - Arithmetic progression step between groups (b * d)
 * @property {number} durationSyllables - Total duration in default-speed syllables (4/beat)
 * @property {string} durationBeatsFormatted - Total duration in beats (e.g. "8" or "8 ¾")
 * @property {number} cycles - Number of full Thalam cycles completed ((duration - eduppu) / thalam)
 * @property {string} formulaText - Human-readable combination formula
 */

/**
 * Computes basic, difference_basic, and all valid linear combinations
 * (a * basic + b * difference_basic) === eduppu (mod thalam)
 * with a >= 0, b >= 0, and (a, b) != (0, 0).
 *
 * @param {Object} params
 * @param {NadaiSpec[][] | string | string[]} params.nadai
 * @param {number} params.thalam - Cycle duration in default-speed syllables (even integer >= 2)
 * @param {number} params.eduppu - Starting offset in default-speed syllables (0 <= eduppu < thalam)
 * @param {number} [params.maxA=25] - Maximum multiplier a to search
 * @param {number} [params.maxB=25] - Maximum multiplier b to search
 * @param {number} [params.maxSolutions=200] - Cap on returned solutions
 */
export function solveKorvais({
  nadai,
  thalam,
  eduppu,
  maxA = 25,
  maxB = 25,
  maxSolutions = 200,
}) {
  if (!Number.isInteger(thalam) || thalam < 2) {
    throw new Error('Thalam duration must be an integer >= 2 syllables');
  }
  if (!Number.isInteger(eduppu) || eduppu < 0) {
    throw new Error('Eduppu offset must be a non-negative integer (in syllables)');
  }

  const groups =
    Array.isArray(nadai) && Array.isArray(nadai[0])
      ? /** @type {NadaiSpec[][]} */ (nadai)
      : parseNadaiGroups(/** @type {string | string[]} */ (nadai));

  const basic = findBasic(groups);
  const differenceBasic = findDifferenceBasic(groups);
  const targetMod = ((eduppu % thalam) + thalam) % thalam;

  // Check mathematical solvability of (a * D_basic + b * D_diff) === targetMod (mod thalam)
  const kernelGcd = gcd(gcd(basic.duration, differenceBasic.duration), thalam);
  const solvable = targetMod % kernelGcd === 0;

  /** @type {KorvaiSolution[]} */
  const solutions = [];

  if (solvable) {
    for (let b = 0; b <= maxB; b++) {
      for (let a = 0; a <= maxA; a++) {
        if (a === 0 && b === 0) continue;

        const durationSyllables = a * basic.duration + b * differenceBasic.duration;
        if (durationSyllables % thalam !== targetMod) continue;

        const groupLengths = differenceBasic.lengths.map(
          (diffLen) => a * basic.length + b * diffLen
        );
        const segmentLengths = [];
        for (let gIdx = 0; gIdx < groups.length; gIdx++) {
          for (let sIdx = 0; sIdx < groups[gIdx].length; sIdx++) {
            segmentLengths.push(groupLengths[gIdx]);
          }
        }

        const cycles = Math.floor((durationSyllables - targetMod) / thalam);
        const progressionStep = b * differenceBasic.step;

        const parts = [];
        if (a > 0) parts.push(`${a} × basic`);
        if (b > 0) parts.push(`${b} × diff_basic`);
        const formulaText = parts.join(' + ');

        solutions.push({
          a,
          b,
          groupLengths,
          segmentLengths,
          startLength: groupLengths[0],
          progressionStep,
          durationSyllables,
          durationBeatsFormatted: formatFraction(durationSyllables, 4),
          cycles,
          formulaText,
        });
      }
    }

    // Sort solutions by total duration ascending, then by b > 0 preference (increasing korvais first for ties)
    solutions.sort((x, y) => {
      if (x.durationSyllables !== y.durationSyllables) {
        return x.durationSyllables - y.durationSyllables;
      }
      return x.a - y.a;
    });
  }

  return {
    groups,
    thalam,
    eduppu,
    targetMod,
    basic,
    differenceBasic,
    solvable,
    kernelGcd,
    solutions: solutions.slice(0, maxSolutions),
    totalFound: solutions.length,
  };
}
