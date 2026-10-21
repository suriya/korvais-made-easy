// @ts-check
/**
 * Comprehensive Unit & Property-Based Test Suite for Korvai's Made Easy
 * Runs both in the browser (via test.html) and via Node CLI.
 */

import {
  NADAI_CATALOG,
  NADAI_FAMILIES,
  gcd,
  lcm,
  lcmArray,
  formatFraction,
  parseNadaiToken,
  tokensToGroups,
  parseNadaiGroups,
  parseToKeypadTokens,
  serializeTokensToParam,
  formatGroupsDisplay,
  evaluateSequence,
  findBasic,
  findDifferenceBasic,
  solveKorvais,
} from './korvai.js';

/**
 * Simple assertion helpers that work identically in Browser and Node.
 */
const assert = {
  /**
   * @param {any} actual
   * @param {any} expected
   * @param {string} [msg]
   */
  equal(actual, expected, msg = '') {
    if (actual !== expected) {
      throw new Error(
        `${msg ? msg + ': ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
      );
    }
  },

  /**
   * @param {any} actual
   * @param {any} expected
   * @param {string} [msg]
   */
  deepEqual(actual, expected, msg = '') {
    const aStr = JSON.stringify(actual);
    const eStr = JSON.stringify(expected);
    if (aStr !== eStr) {
      throw new Error(`${msg ? msg + ': ' : ''}Expected ${eStr}, got ${aStr}`);
    }
  },

  /**
   * @param {any} condition
   * @param {string} [msg]
   */
  ok(condition, msg = 'Expected truthy value') {
    if (!condition) {
      throw new Error(msg);
    }
  },

  /**
   * @param {() => any} fn
   * @param {RegExp | string} [expectedMsg]
   */
  throws(fn, expectedMsg) {
    let threw = false;
    /** @type {any} */
    let caughtErr = null;
    try {
      fn();
    } catch (err) {
      threw = true;
      caughtErr = err;
    }
    if (!threw) {
      throw new Error('Expected function to throw an error, but it did not throw');
    }
    if (expectedMsg) {
      const message = caughtErr && caughtErr.message ? caughtErr.message : String(caughtErr);
      if (typeof expectedMsg === 'string' && !message.includes(expectedMsg)) {
        throw new Error(`Expected error containing "${expectedMsg}", got "${message}"`);
      }
      if (expectedMsg instanceof RegExp && !expectedMsg.test(message)) {
        throw new Error(`Expected error matching ${expectedMsg}, got "${message}"`);
      }
    }
  },
};

/**
 * @typedef {Object} TestCase
 * @property {string} suite
 * @property {string} name
 * @property {() => void} fn
 */

/** @type {TestCase[]} */
const registry = [];
let currentSuite = 'General';

/**
 * @param {string} suiteName
 * @param {() => void} fn
 */
function describe(suiteName, fn) {
  const prev = currentSuite;
  currentSuite = suiteName;
  fn();
  currentSuite = prev;
}

/**
 * @param {string} testName
 * @param {() => void} fn
 */
function test(testName, fn) {
  registry.push({ suite: currentSuite, name: testName, fn });
}

// ============================================================================
// 1. Math & Fraction Formatting Tests
// ============================================================================
describe('1. Math & Fraction Formatting', () => {
  test('gcd computes greatest common divisor accurately', () => {
    assert.equal(gcd(12, 8), 4);
    assert.equal(gcd(7, 13), 1);
    assert.equal(gcd(100, 25), 25);
    assert.equal(gcd(0, 9), 9);
    assert.equal(gcd(-18, 24), 6);
  });

  test('lcm and lcmArray compute least common multiples accurately', () => {
    assert.equal(lcm(3, 4), 12);
    assert.equal(lcm(4, 6), 12);
    assert.equal(lcm(6, 8), 24);
    assert.equal(lcmArray([4, 3, 3, 4]), 12);
    assert.equal(lcmArray([4, 4, 6, 8]), 24);
    assert.equal(lcmArray([4, 5, 7, 9]), 1260);
  });

  test('formatFraction renders integers and vulgar fractions cleanly', () => {
    assert.equal(formatFraction(0, 4), '0');
    assert.equal(formatFraction(12, 4), '3');
    assert.equal(formatFraction(11, 4), '2 ¾');
    assert.equal(formatFraction(1, 3), '⅓');
    assert.equal(formatFraction(2, 3), '⅔');
    assert.equal(formatFraction(4, 3), '1 ⅓');
    assert.equal(formatFraction(14, 4), '3 ½');
    assert.equal(formatFraction(3, 7), '3/7');
  });
});

// ============================================================================
// 2. Nadai Catalog, Keypad Grouping & Parsing Tests
// ============================================================================
describe('2. Nadai Catalog & Sequence Parsing', () => {
  test('Catalog contains all speeds 1..10 plus 1½ (3/2), 2/3, and 4/3', () => {
    for (let i = 1; i <= 10; i++) {
      const spec = NADAI_CATALOG[String(i)];
      assert.ok(spec, `Speed ${i} should exist in NADAI_CATALOG`);
      assert.equal(spec.num, i);
      assert.equal(spec.den, 1);
      assert.equal(spec.div, i === 2 ? 4 : i);
    }
    const tkk = NADAI_CATALOG['3/2'];
    assert.ok(tkk, '3/2 should exist in NADAI_CATALOG');
    assert.equal(tkk.label, '1½');
    assert.equal(tkk.num, 3);
    assert.equal(tkk.den, 2);
    assert.equal(tkk.div, 3);

    const ctk = NADAI_CATALOG['2/3'];
    assert.ok(ctk, '2/3 should exist in NADAI_CATALOG');
    assert.equal(ctk.label, '2/3');
    assert.equal(ctk.num, 2);
    assert.equal(ctk.den, 3);
    assert.equal(ctk.div, 4);

    const ct = NADAI_CATALOG['4/3'];
    assert.ok(ct, '4/3 should exist in NADAI_CATALOG');
    assert.equal(ct.num, 4);
    assert.equal(ct.den, 3);
    assert.equal(ct.div, 4);
    assert.equal(ct.name, 'Chaturshra Trishram');

    const ctm = NADAI_CATALOG['8/3'];
    assert.ok(ctm, '8/3 should exist in NADAI_CATALOG');
    assert.equal(ctm.label, '8/3');
    assert.equal(ctm.num, 8);
    assert.equal(ctm.den, 3);
    assert.equal(ctm.div, 8);
    assert.equal(ctm.name, 'Chaturshra Trishram Mel Kaalam');
  });

  test('Chaturshra Trishram has its own dedicated row in NADAI_FAMILIES with 2/3, 4/3, and 8/3', () => {
    const ctFamily = NADAI_FAMILIES.find((f) => f.id === 'chaturshra_trishram');
    assert.ok(ctFamily, 'chaturshra_trishram family should exist');
    assert.deepEqual(ctFamily.speeds, ['2/3', '4/3', '8/3']);
    const trishramFamily = NADAI_FAMILIES.find((f) => f.id === 'trishram');
    assert.deepEqual(trishramFamily?.speeds, ['3/2', '3', '6']);
    const chaturshramFamily = NADAI_FAMILIES.find((f) => f.id === 'chaturshram');
    assert.deepEqual(chaturshramFamily?.speeds, ['1', '2', '4', '8']);
  });

  test('Ungrouped sequence treats each nadai as its own group', () => {
    const groups = parseNadaiGroups('3 3 4');
    assert.equal(groups.length, 3);
    assert.deepEqual(
      groups.map((g) => g.map((s) => s.id)),
      [['3'], ['3'], ['4']]
    );

    const compactUngrouped = parseNadaiGroups('334');
    assert.deepEqual(
      compactUngrouped.map((g) => g.map((s) => s.id)),
      [['3'], ['3'], ['4']]
    );
  });

  test('Hyphen-grouped sequence groups consecutive nadais per chunk', () => {
    const groups = parseNadaiGroups('4-66-888');
    assert.equal(groups.length, 3);
    assert.deepEqual(
      groups.map((g) => g.map((s) => s.id)),
      [['4'], ['6', '6'], ['8', '8', '8']]
    );
  });

  test('Parses multi-character speeds 10 and 4/3 in both ungrouped and grouped forms', () => {
    const g1 = parseNadaiGroups('4/3 4 10');
    assert.deepEqual(
      g1.map((g) => g.map((s) => s.id)),
      [['4/3'], ['4'], ['10']]
    );

    const g2 = parseNadaiGroups('4/3-4.4-10.10');
    assert.deepEqual(
      g2.map((g) => g.map((s) => s.id)),
      [['4/3'], ['4', '4'], ['10', '10']]
    );

    const g3 = parseNadaiGroups('4/34/3-55-1010');
    assert.deepEqual(
      g3.map((g) => g.map((s) => s.id)),
      [['4/3', '4/3'], ['5', '5'], ['10', '10']]
    );
  });

  test('tokensToGroups handles keypad token arrays with and without "-" separator', () => {
    const ungrouped = tokensToGroups(['3', '3', '4']);
    assert.deepEqual(
      ungrouped.map((g) => g.map((s) => s.id)),
      [['3'], ['3'], ['4']]
    );

    const grouped = tokensToGroups(['4', '-', '6', '6', '-', '8', '8', '8']);
    assert.deepEqual(
      grouped.map((g) => g.map((s) => s.id)),
      [['4'], ['6', '6'], ['8', '8', '8']]
    );

    // Leading/trailing/consecutive '-' are gracefully ignored
    const messy = tokensToGroups(['-', '4/3', '-', '-', '4', '4', '-']);
    assert.deepEqual(
      messy.map((g) => g.map((s) => s.id)),
      [['4/3'], ['4', '4']]
    );
  });

  test('URL parameter serialization round-trips cleanly', () => {
    const t1 = ['4', '-', '6', '6', '-', '8', '8', '8'];
    const p1 = serializeTokensToParam(t1);
    assert.equal(p1, '4-66-888');
    assert.deepEqual(parseToKeypadTokens(p1), t1);

    const t2 = ['4/3', '-', '4', '4', '-', '10', '10'];
    const p2 = serializeTokensToParam(t2);
    assert.equal(p2, '4/3-44-10.10');
    assert.deepEqual(parseToKeypadTokens(p2), t2);

    const t3 = ['3', '3', '4'];
    const p3 = serializeTokensToParam(t3);
    assert.equal(p3, '3 3 4');
    assert.deepEqual(parseToKeypadTokens(p3), t3);
  });

  test('Rejects empty or invalid nadai tokens', () => {
    assert.throws(() => parseNadaiGroups(''), /cannot be empty/);
    assert.throws(() => parseNadaiGroups('---'), /contains no speeds/);
    assert.throws(() => parseNadaiToken('0'), /Unsupported nadai/);
    assert.throws(() => parseNadaiToken('11'), /Unsupported nadai/);
    assert.throws(() => parseNadaiGroups('3 a 4'), /Unsupported nadai|Invalid/);
  });
});

// ============================================================================
// 3. Rhythmic Validity & Divisibility Tests
// ============================================================================
describe('3. Divisibility & Alignment Evaluation', () => {
  test('Document walkthrough: "3 3 4" fails for L=1 and L=2, succeeds for L=3 (11 syllables)', () => {
    const groups = parseNadaiGroups('3 3 4');

    const eval1 = evaluateSequence(groups, [1, 1, 1]);
    assert.equal(eval1.valid, false);
    assert.equal(eval1.steps[0].entryValid, true);
    assert.equal(eval1.steps[1].entryValid, true);
    assert.equal(eval1.steps[2].entryValid, false); // 2/3 not divisible by 1/4

    const eval2 = evaluateSequence(groups, [2, 2, 2]);
    assert.equal(eval2.valid, false);
    assert.equal(eval2.steps[2].entryValid, false); // 4/3 not divisible by 1/4

    const eval3 = evaluateSequence(groups, [3, 3, 3]);
    assert.equal(eval3.valid, true);
    assert.equal(eval3.durationSyllables, 11);
    assert.equal(eval3.durationBeatsFormatted, '2 ¾');
  });

  test('Document walkthrough: "4-66-888" fails for [1, 2, 3], succeeds for [2, 3, 4] (12 syllables)', () => {
    const groups = parseNadaiGroups('4-66-888');

    const eval123 = evaluateSequence(groups, [1, 2, 3]);
    assert.equal(eval123.valid, false);
    assert.equal(eval123.steps[0].entryValid, true); // 0 divisible by 1/4
    assert.equal(eval123.steps[1].entryValid, false); // 1/4 not divisible by 1/6

    const eval234 = evaluateSequence(groups, [2, 3, 4]);
    assert.equal(eval234.valid, true);
    assert.equal(eval234.durationSyllables, 12);
    assert.equal(eval234.durationBeatsFormatted, '3');
  });

  test('Chaturshra Trishram (4/3): 1/4-beat entry divisibility and 3/4-beat per syllable duration', () => {
    // Sequence: [4] -> [4/3]
    // Playing 1 syllable in nadai 4 takes 1/4 beat.
    // Entering 4/3 at 1/4 beat IS valid because 4/3 has 1/4-beat divisibility!
    // Playing 1 syllable in 4/3 takes 3/4 beat, ending at 1/4 + 3/4 = 1 beat (4 syllables).
    const g1 = parseNadaiGroups('4 4/3');
    const ev1 = evaluateSequence(g1, [1, 1]);
    assert.equal(ev1.valid, true);
    assert.equal(ev1.durationSyllables, 4);
    assert.equal(ev1.durationBeatsFormatted, '1');

    // Sequence: [3] -> [4/3]
    // Playing 1 syllable in nadai 3 ends at 1/3 beat, which is NOT divisible by 1/4.
    const g2 = parseNadaiGroups('3 4/3');
    const evFail = evaluateSequence(g2, [1, 1]);
    assert.equal(evFail.valid, false);
    assert.equal(evFail.steps[1].entryValid, false);

    // Playing 3 syllables in nadai 3 ends at 1 beat (divisible by 1/4), then 1 syllable in 4/3 adds 3/4 beat -> 7 syllables.
    const evPass = evaluateSequence(g2, [3, 1]);
    assert.equal(evPass.valid, true);
    assert.equal(evPass.durationSyllables, 7);
    assert.equal(evPass.durationBeatsFormatted, '1 ¾');
  });

  test('Trishra Keez Kaalam (1½ = 3/2) has 1/3-beat divisibility and 2/3-beat per syllable duration', () => {
    // Playing 1 syllable in nadai 3 takes 1/3 beat.
    // Entering 1½ (3/2) at 1/3 beat IS valid (since divisibility is 1/3)!
    // Playing 1 syllable in 1½ adds 2/3 beat -> ends at 1/3 + 2/3 = 1 beat (4 syllables).
    const g = parseNadaiGroups('3 1½');
    const ev = evaluateSequence(g, [1, 1]);
    assert.equal(ev.valid, true);
    assert.equal(ev.durationSyllables, 4);
    assert.equal(ev.durationBeatsFormatted, '1');
  });

  test('Chaturshra Trishram 2/3 has 1/4-beat divisibility and 3/2-beat per syllable duration', () => {
    // Playing 1 syllable in nadai 4 takes 1/4 beat.
    // Entering 2/3 at 1/4 beat IS valid (since divisibility is 1/4)!
    // Playing 1 syllable in 2/3 adds 3/2 beats -> ends at 1/4 + 6/4 = 7/4 beats (7 syllables).
    const g = parseNadaiGroups('4 2/3');
    const ev = evaluateSequence(g, [1, 1]);
    assert.equal(ev.valid, true);
    assert.equal(ev.durationSyllables, 7);
    assert.equal(ev.durationBeatsFormatted, '1 ¾');
  });

  test('Chaturshram 2 (Chaturshra Keez Kaalam) has 1/4-beat divisibility and 1/2-beat per syllable duration', () => {
    // Playing 1 syllable in nadai 4 takes 1/4 beat.
    // Entering nadai 2 at 1/4 beat IS valid (since divisibility is 1/4)!
    // Playing 1 syllable in nadai 2 adds 1/2 beat -> ends at 1/4 + 2/4 = 3/4 beat (3 syllables).
    const g = parseNadaiGroups('4 2');
    const ev = evaluateSequence(g, [1, 1]);
    assert.equal(ev.valid, true);
    assert.equal(ev.durationSyllables, 3);
    assert.equal(ev.durationBeatsFormatted, '¾');
  });

  test('Chaturshra Trishram Mel Kaalam (8/3) has 1/8-beat divisibility and 3/8-beat per syllable duration', () => {
    // Playing 1 syllable in nadai 8 takes 1/8 beat.
    // Entering 8/3 at 1/8 beat IS valid (since divisibility is 1/8)!
    // Playing 1 syllable in 8/3 adds 3/8 beat -> ends at 1/8 + 3/8 = 4/8 = 1/2 beat (2 syllables).
    const g = parseNadaiGroups('8 8/3');
    const ev = evaluateSequence(g, [1, 1]);
    assert.equal(ev.valid, true);
    assert.equal(ev.durationSyllables, 2);
    assert.equal(ev.durationBeatsFormatted, '½');
  });
});

// ============================================================================
// 4. Kernel Computation Tests (basic & difference_basic)
// ============================================================================
describe('4. Kernel Search (basic & difference_basic)', () => {
  test('Finds exact basic and difference_basic for "3 3 4"', () => {
    const basic = findBasic('3 3 4');
    assert.equal(basic.length, 3);
    assert.equal(basic.duration, 11);
    assert.equal(basic.summary, '3 is to 11');

    const diff = findDifferenceBasic('3 3 4');
    // (1, 2, 3): 1/3 + 2/3 = 1 beat, then 3/4 beat -> 1 ¾ beats = 7 syllables
    assert.deepEqual(diff.lengths, [1, 2, 3]);
    assert.equal(diff.duration, 7);
    assert.equal(diff.summary, '1 2 3 is to 7');
  });

  test('Finds exact basic and difference_basic for "4-66-888"', () => {
    const basic = findBasic('4-66-888');
    // Smallest L where L/4 is divisible by 1/6 (L even) and L/4 + 2L/6 is divisible by 1/8 (L multiple of 3) -> L = 6
    // Duration for L = 6: 6/4 + 12/6 + 18/8 = 1.5 + 2 + 2.25 = 5.75 beats = 23 syllables
    assert.equal(basic.length, 6);
    assert.equal(basic.duration, 23);
    assert.equal(basic.summary, '6 is to 23');

    const diff = findDifferenceBasic('4-66-888');
    assert.deepEqual(diff.lengths, [2, 3, 4]);
    assert.equal(diff.duration, 12);
    assert.equal(diff.summary, '2 3 4 is to 12');
  });

  test('Finds kernels for Chaturshra Trishram sequences ("4/3 4 6" and "4/3-4-8")', () => {
    const b1 = findBasic('4/3 4 6');
    // L=3: 3*(3/4) = 9/4; + 3/4 = 12/4 = 3 beats (divisible by 1/6); + 3/6 = 3.5 beats = 14 syllables!
    assert.equal(b1.length, 3);
    assert.equal(b1.duration, 14);

    const d1 = findDifferenceBasic('4/3 4 6');
    assert.ok(d1.evaluation.valid);
    // d=1, s=1 -> [1, 2, 3]: 1*(3/4) + 2/4 = 5/4 (not divisible by 1/6)
    // d=1, s=3 -> [3, 4, 5]: 3*(3/4) + 4/4 = 13/4 (not divisible by 1/6)
    // d=2, s=2 -> [2, 4, 6]: 2*(3/4) + 4/4 = 10/4 = 2.5 beats (divisible by 1/2 -> divisible by 1/6!), + 6/6 = 3.5 beats = 14 syllables!
    assert.deepEqual(d1.lengths, [2, 4, 6]);
    assert.equal(d1.duration, 14);
  });

  test('Finds kernels for uniform Chaturshram "4 4 4"', () => {
    const basic = findBasic('4 4 4');
    assert.equal(basic.length, 1);
    assert.equal(basic.duration, 3);

    const diff = findDifferenceBasic('4 4 4');
    assert.deepEqual(diff.lengths, [1, 2, 3]);
    assert.equal(diff.duration, 6);
  });
});

// ============================================================================
// 5. Linear Combination Solver & Property-Based Invariant Tests
// ============================================================================
describe('5. Linear Combination Solver & Invariants', () => {
  test('Solves Adi Thalam (32) with 1-beat Eduppu (4) for "4-66-888"', () => {
    const res = solveKorvais({
      nadai: '4-66-888',
      thalam: 32,
      eduppu: 4,
      maxA: 15,
      maxB: 15,
    });
    assert.equal(res.solvable, true);
    assert.ok(res.solutions.length > 0, 'Should find valid korvai solutions');

    for (const sol of res.solutions) {
      assert.ok(sol.a >= 0 && sol.b >= 0, 'Coefficients a, b must be non-negative');
      assert.ok(!(sol.a === 0 && sol.b === 0), '(a, b) cannot both be zero');
      assert.equal(sol.durationSyllables % 32, 4);
      const ev = evaluateSequence(res.groups, sol.groupLengths);
      assert.ok(ev.valid, `Solution (${sol.a}, ${sol.b}) must satisfy all alignment rules`);
      assert.equal(ev.durationSyllables, sol.durationSyllables);
    }
  });

  test('Correctly identifies unsolvable parity cases when gcd(D_basic, D_diff, T) does not divide E', () => {
    // For "4-4": basic is (1, 1) -> 2 syllables; diff_basic is (1, 2) -> 3 syllables -> gcd(2, 3, 32) = 1 (solvable).
    // For "2 2": basic is (1, 1) -> 4 syllables; diff_basic is (1, 2) -> 6 syllables.
    // Both D_basic=4 and D_diff=6 are even, so with Thalam=32 (even), odd Eduppu=3 is unreachable!
    const res = solveKorvais({
      nadai: '2 2',
      thalam: 32,
      eduppu: 3,
    });
    assert.equal(res.basic.duration, 4);
    assert.equal(res.differenceBasic.duration, 6);
    assert.equal(res.solvable, false);
    assert.equal(res.solutions.length, 0);
  });

  test('Handles Eduppu = 0 (Samam) and Eduppu = Thalam equivalently', () => {
    const r0 = solveKorvais({ nadai: '3 3 4', thalam: 32, eduppu: 0, maxA: 10, maxB: 10 });
    const r32 = solveKorvais({ nadai: '3 3 4', thalam: 32, eduppu: 32, maxA: 10, maxB: 10 });
    assert.equal(r0.targetMod, 0);
    assert.equal(r32.targetMod, 0);
    assert.deepEqual(
      r0.solutions.map((s) => [s.a, s.b, s.durationSyllables]),
      r32.solutions.map((s) => [s.a, s.b, s.durationSyllables])
    );
  });

  test('Property-based invariant verification across 16 diverse Nadai sequences', () => {
    const sequences = [
      '3 3 4',
      '4-66-888',
      '3 4 5',
      '5 7 9',
      '1 2 4 8',
      '3-66',
      '5-10.10',
      '4/3 4',
      '4/3-44-888',
      '4 3 4',
      '7 7 4',
      '9 6 4',
      '2 3 4 6 8',
      '4/3 3 6',
      '6-8-10',
      '4-55-666',
    ];

    for (const seq of sequences) {
      const groups = parseNadaiGroups(seq);
      const basic = findBasic(groups);
      const diff = findDifferenceBasic(groups);

      // Invariant 1: basic is minimal positive uniform length
      assert.ok(basic.length >= 1);
      assert.ok(basic.evaluation.valid);
      for (let l = 1; l < basic.length; l++) {
        const subEval = evaluateSequence(groups, new Array(groups.length).fill(l));
        assert.equal(subEval.valid, false, `L=${l} should not be valid before basic=${basic.length} for ${seq}`);
      }

      // Invariant 2: difference_basic is valid and its starting length s <= L_basic
      assert.ok(diff.evaluation.valid);
      assert.ok(
        diff.start <= basic.length,
        `Expected diff.start (${diff.start}) <= basic.length (${basic.length}) for ${seq}`
      );

      // Invariant 3: All solutions for Mishra Chapu (T=14, E=3) & Adi (T=32, E=4) are valid
      for (const [thalam, eduppu] of [
        [32, 4],
        [14, 3],
        [10, 0],
      ]) {
        const solved = solveKorvais({ nadai: groups, thalam, eduppu, maxA: 8, maxB: 8 });
        for (const sol of solved.solutions) {
          assert.ok(sol.a >= 0 && sol.b >= 0);
          assert.ok(sol.groupLengths.every((len) => len >= 1));
          for (let i = 1; i < sol.groupLengths.length; i++) {
            assert.ok(
              sol.groupLengths[i] >= sol.groupLengths[i - 1],
              `Expected non-decreasing lengths in ${seq}`
            );
          }
          const check = evaluateSequence(groups, sol.groupLengths);
          assert.ok(check.valid, `Invalid solution generated for ${seq}`);
          assert.equal(check.durationSyllables, sol.durationSyllables);
          assert.equal(sol.durationSyllables % thalam, eduppu % thalam);
        }
      }
    }
  });
});

/**
 * Executes all registered tests and returns a structured report.
 */
export function runAllTests() {
  const results = [];
  let passed = 0;
  let failed = 0;
  const startTime = performance.now();

  for (const item of registry) {
    const t0 = performance.now();
    try {
      item.fn();
      const elapsedMs = performance.now() - t0;
      passed++;
      results.push({
        suite: item.suite,
        name: item.name,
        passed: true,
        elapsedMs,
        error: null,
      });
    } catch (err) {
      const elapsedMs = performance.now() - t0;
      failed++;
      results.push({
        suite: item.suite,
        name: item.name,
        passed: false,
        elapsedMs,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const totalTimeMs = performance.now() - startTime;
  return {
    total: registry.length,
    passed,
    failed,
    totalTimeMs,
    results,
  };
}

// If executed directly under Node.js CLI, run tests and print summary
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const report = runAllTests();
  console.log(`\n=== Korvai Unit Test Suite ===`);
  for (const r of report.results) {
    const icon = r.passed ? 'PASS' : 'FAIL';
    console.log(`[${icon}] ${r.suite} > ${r.name} (${r.elapsedMs.toFixed(2)}ms)`);
    if (!r.passed) {
      console.error(`       Error: ${r.error}`);
    }
  }
  console.log(
    `\nSummary: ${report.passed}/${report.total} passed, ${report.failed} failed (${report.totalTimeMs.toFixed(2)}ms)\n`
  );
  if (report.failed > 0) {
    process.exit(1);
  }
}
