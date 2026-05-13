/**
 * SnapSL Token Allocator Engine
 *
 * Deterministic, shortest-first token allocation.
 * Priority sequence:
 *   Step 1:  a-z          (length 1, 26 tokens)
 *   Step 2:  0-9          (length 1, 10 tokens)
 *   Step 3:  aa-zz        (length 2, 676 tokens)
 *   Step 4:  00-99        (length 2, 100 tokens)
 *   Step 5:  a0-z9, 0a-9z (length 2 mixed, 520 tokens)
 *   Step 6:  aaa-zzz      (length 3, 17576 tokens)
 *   Step 7:  000-999      (length 3, 1000 tokens)
 *   ...continues up to length 5 (max token length)
 *
 * Max token length = 5, hyphen counts toward length.
 * We use a global counter (stored in Redis) that maps to
 * a position in the ordered sequence. This makes allocation
 * O(1) - no scanning, no brute force.
 */

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';

// Build the complete ordered sequence of tokens up to maxLen=5
// Returns an array of all possible tokens in priority order
function buildSequence(maxLen = 5) {
  const sequence = [];

  for (let len = 1; len <= maxLen; len++) {
    // For each length, generate in priority order:
    // 1. All-alpha combos
    // 2. All-digit combos
    // 3. Mixed combos (alpha+digit, digit+alpha patterns)

    const alphaCombos = generateCombinations(ALPHA, len);
    const digitCombos = generateCombinations(DIGITS, len);

    sequence.push(...alphaCombos);
    sequence.push(...digitCombos);

    if (len >= 2) {
      const mixedCombos = generateMixed(len);
      sequence.push(...mixedCombos);
    }
  }

  return sequence;
}

// Generate all combinations of `charset` with exactly `length` chars
function generateCombinations(charset, length) {
  if (length === 1) return charset.split('');

  const results = [];
  const base = charset.length;

  const total = Math.pow(base, length);
  for (let i = 0; i < total; i++) {
    let n = i;
    let combo = '';
    for (let p = 0; p < length; p++) {
      combo = charset[n % base] + combo;
      n = Math.floor(n / base);
    }
    results.push(combo);
  }
  return results;
}

// Generate mixed alpha+digit combos for a given length
// Mixed means: at least one alpha AND at least one digit character
function generateMixed(length) {
  const charset = ALPHA + DIGITS; // a-z then 0-9
  const allCombos = generateCombinations(charset, length);
  const alphaSet = new Set(ALPHA.split(''));
  const digitSet = new Set(DIGITS.split(''));

  // Keep only combos that have BOTH alpha and digit characters
  return allCombos.filter((combo) => {
    const chars = combo.split('');
    const hasAlpha = chars.some((c) => alphaSet.has(c));
    const hasDigit = chars.some((c) => digitSet.has(c));
    return hasAlpha && hasDigit;
  });
}

// Precompute the full sequence once at startup
let _sequence = null;
let _sequenceSet = null; // for fast existence checks

function getSequence() {
  if (!_sequence) {
    _sequence = buildSequence(5);
    _sequenceSet = new Set(_sequence);
  }
  return _sequence;
}

function getSequenceSet() {
  if (!_sequenceSet) getSequence();
  return _sequenceSet;
}

// Total number of tokens in our sequence
function getSequenceLength() {
  return getSequence().length;
}

/**
 * Get token at a given index (0-based) in the priority sequence.
 * O(1) lookup.
 */
function getTokenAtIndex(index) {
  const seq = getSequence();
  if (index < 0 || index >= seq.length) return null;
  return seq[index];
}

/**
 * Get index of a token in the sequence.
 * O(1) lookup via precomputed index map.
 */
let _indexMap = null;
function getIndexMap() {
  if (!_indexMap) {
    const seq = getSequence();
    _indexMap = new Map();
    seq.forEach((token, i) => _indexMap.set(token, i));
  }
  return _indexMap;
}

function getTokenIndex(token) {
  return getIndexMap().get(token) ?? -1;
}

export {
  getSequence,
  getSequenceSet,
  getSequenceLength,
  getTokenAtIndex,
  getTokenIndex,
  buildSequence,
};
