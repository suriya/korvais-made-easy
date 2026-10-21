// @ts-check
/**
 * Korvai's Made Easy — Debug UI Controller (for debug.html)
 * Preserves full kernel inspection, step-by-step alignment table, (a, b) formulas, and durations.
 */

import {
  NADAI_CATALOG,
  NADAI_FAMILIES,
  THALAM_PRESETS,
  formatFraction,
  tokensToGroups,
  parseToKeypadTokens,
  serializeTokensToParam,
  evaluateSequence,
  solveKorvais,
} from './korvai.js';

const FAVORITES_STORAGE_KEY = 'korvai_saved_favorites_v1';

const state = {
  /** @type {string[]} */
  tokens: ['4', '-', '6', '6', '-', '8', '8', '8'],
  thalam: 32,
  eduppu: 4,
  filterMode: 'increasing',
  maxRange: 25,
  /** @type {ReturnType<typeof solveKorvais> | null} */
  lastResult: null,
  /** @type {Array<{id: string, name: string, nadaiParam: string, thalam: number, eduppu: number}>} */
  favorites: [],
};

const elKeypadRows = /** @type {HTMLElement} */ (document.getElementById('keypad-rows'));
const elSequenceGroupsRow = /** @type {HTMLElement} */ (
  document.getElementById('sequence-groups-row')
);
const elSequenceModeLabel = /** @type {HTMLElement} */ (
  document.getElementById('sequence-mode-label')
);
const elSequenceCanonicalText = /** @type {HTMLElement} */ (
  document.getElementById('sequence-canonical-text')
);
const elSelectThalamPreset = /** @type {HTMLSelectElement} */ (
  document.getElementById('select-thalam-preset')
);
const elInputThalam = /** @type {HTMLInputElement} */ (document.getElementById('input-thalam'));
const elThalamBeatsLabel = /** @type {HTMLElement} */ (
  document.getElementById('thalam-beats-label')
);
const elInputEduppu = /** @type {HTMLInputElement} */ (document.getElementById('input-eduppu'));
const elEduppuBeatsLabel = /** @type {HTMLElement} */ (
  document.getElementById('eduppu-beats-label')
);
const elErrorBanner = /** @type {HTMLElement} */ (document.getElementById('error-banner'));
const elKernelsSection = /** @type {HTMLElement} */ (document.getElementById('kernels-section'));
const elBasicMainVal = /** @type {HTMLElement} */ (document.getElementById('basic-main-val'));
const elBasicSubVal = /** @type {HTMLElement} */ (document.getElementById('basic-sub-val'));
const elDiffMainVal = /** @type {HTMLElement} */ (document.getElementById('diff-main-val'));
const elDiffSubVal = /** @type {HTMLElement} */ (document.getElementById('diff-sub-val'));
const elCongruenceSub = /** @type {HTMLElement} */ (
  document.getElementById('congruence-equation-sub')
);
const elSolutionsCountBadge = /** @type {HTMLElement} */ (
  document.getElementById('solutions-count-badge')
);
const elSolutionsTbody = /** @type {HTMLElement} */ (document.getElementById('solutions-tbody'));
const elBreakdownPanel = /** @type {HTMLElement} */ (document.getElementById('breakdown-panel'));
const elBreakdownTitle = /** @type {HTMLElement} */ (document.getElementById('breakdown-title'));
const elBreakdownSummary = /** @type {HTMLElement} */ (
  document.getElementById('breakdown-summary')
);
const elBreakdownTbody = /** @type {HTMLElement} */ (document.getElementById('breakdown-tbody'));
const elFavoritesList = /** @type {HTMLElement} */ (document.getElementById('favorites-list'));
const elFavoritesCountLabel = /** @type {HTMLElement} */ (
  document.getElementById('favorites-count-label')
);
const elInputFavoriteName = /** @type {HTMLInputElement} */ (
  document.getElementById('input-favorite-name')
);
const elToastBanner = /** @type {HTMLElement} */ (document.getElementById('toast-banner'));

/**
 * @param {string} msg
 */
function showToast(msg) {
  elToastBanner.textContent = msg;
  elToastBanner.style.display = 'block';
  clearTimeout(/** @type {any} */ (showToast)._timer);
  /** @type {any} */ (showToast)._timer = setTimeout(() => {
    elToastBanner.style.display = 'none';
  }, 2400);
}

function initKeypad() {
  elKeypadRows.innerHTML = '';
  for (const fam of NADAI_FAMILIES) {
    const row = document.createElement('div');
    row.className = 'keypad-family-row';

    const labelCell = document.createElement('div');
    labelCell.className = 'family-label-cell';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'family-label-name';
    nameSpan.textContent = fam.label;
    const subSpan = document.createElement('span');
    subSpan.className = 'family-label-sub';
    subSpan.textContent = fam.subtitle;
    labelCell.appendChild(nameSpan);
    labelCell.appendChild(subSpan);

    const btnCell = document.createElement('div');
    btnCell.className = 'family-buttons-cell';

    for (const speedId of fam.speeds) {
      const spec = NADAI_CATALOG[speedId];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `btn-speed-${speedId.replace('/', '-')}`;
      btn.className = `speed-btn fam-${spec.family}`;
      btn.textContent = spec.label;
      btn.title = `${spec.name} (${spec.id} syllables/beat)`;
      btn.addEventListener('click', () => {
        state.tokens.push(spec.id);
        onStateChanged();
      });
      btnCell.appendChild(btn);
    }

    row.appendChild(labelCell);
    row.appendChild(btnCell);
    elKeypadRows.appendChild(row);
  }
}

function initThalamPresets() {
  elSelectThalamPreset.innerHTML = '';
  for (const preset of THALAM_PRESETS) {
    const opt = document.createElement('option');
    opt.value = String(preset.syllables);
    opt.textContent = preset.label;
    if (preset.syllables === state.thalam) {
      opt.selected = true;
    }
    elSelectThalamPreset.appendChild(opt);
  }
  const customOpt = document.createElement('option');
  customOpt.value = 'custom';
  customOpt.textContent = 'Custom Thalam Duration...';
  elSelectThalamPreset.appendChild(customOpt);
}

function loadStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const nadaiParam = params.get('nadai');
  const thalamParam = params.get('thalam');
  const eduppuParam = params.get('eduppu');

  if (nadaiParam) {
    try {
      const parsedTokens = parseToKeypadTokens(nadaiParam);
      if (parsedTokens.length > 0) {
        state.tokens = parsedTokens;
      }
    } catch (e) {
      console.warn('Invalid nadai URL parameter:', e);
    }
  }
  if (thalamParam !== null) {
    const t = Number(thalamParam);
    if (Number.isInteger(t) && t >= 2) state.thalam = t;
  }
  if (eduppuParam !== null) {
    const e = Number(eduppuParam);
    if (Number.isInteger(e) && e >= 0) state.eduppu = e;
  }
}

function syncUrlFromState() {
  const nadaiStr = serializeTokensToParam(state.tokens);
  const params = new URLSearchParams();
  if (nadaiStr) params.set('nadai', nadaiStr);
  params.set('thalam', String(state.thalam));
  params.set('eduppu', String(state.eduppu));
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newUrl);
}

function renderSequenceDisplay() {
  elSequenceGroupsRow.innerHTML = '';
  const hasExplicitSep = state.tokens.includes('-');
  const canonicalStr = serializeTokensToParam(state.tokens);
  elSequenceCanonicalText.textContent = canonicalStr || '(empty)';

  if (state.tokens.length === 0) {
    elSequenceModeLabel.textContent = 'Tap speed buttons below to add nadais';
    const emptyHint = document.createElement('span');
    emptyHint.className = 'panel-hint';
    emptyHint.textContent = 'No nadai speeds selected yet.';
    elSequenceGroupsRow.appendChild(emptyHint);
    return;
  }

  if (!hasExplicitSep) {
    elSequenceModeLabel.textContent = `Ungrouped Mode (${state.tokens.length} separate groups of 1)`;
    state.tokens.forEach((tok, idx) => {
      const spec = NADAI_CATALOG[tok];
      const box = document.createElement('span');
      box.className = 'group-pill-box';
      const chip = createTokenChip(spec ? spec.label : tok, spec ? spec.family : 'chaturshram', idx);
      box.appendChild(chip);
      elSequenceGroupsRow.appendChild(box);
    });
  } else {
    let groupCount = 0;
    let currentBox = document.createElement('span');
    currentBox.className = 'group-pill-box';
    let currentHasItems = false;

    state.tokens.forEach((tok, idx) => {
      if (tok === '-') {
        if (currentHasItems) {
          elSequenceGroupsRow.appendChild(currentBox);
          groupCount++;
          currentBox = document.createElement('span');
          currentBox.className = 'group-pill-box';
          currentHasItems = false;
        }
        const sep = document.createElement('span');
        sep.className = 'group-sep-badge';
        sep.textContent = '—';
        sep.title = 'Click to remove separator';
        sep.style.cursor = 'pointer';
        sep.addEventListener('click', () => {
          state.tokens.splice(idx, 1);
          onStateChanged();
        });
        elSequenceGroupsRow.appendChild(sep);
      } else {
        const spec = NADAI_CATALOG[tok];
        const chip = createTokenChip(
          spec ? spec.label : tok,
          spec ? spec.family : 'chaturshram',
          idx
        );
        currentBox.appendChild(chip);
        currentHasItems = true;
      }
    });

    if (currentHasItems) {
      elSequenceGroupsRow.appendChild(currentBox);
      groupCount++;
    }
    elSequenceModeLabel.textContent = `Explicit Grouping (${groupCount} group${groupCount === 1 ? '' : 's'})`;
  }
}

/**
 * @param {string} label
 * @param {string} family
 * @param {number} tokenIndex
 */
function createTokenChip(label, family, tokenIndex) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = `nadai-chip fam-${family}`;
  chip.textContent = label;
  chip.title = `Click to remove "${label}"`;
  chip.addEventListener('click', () => {
    state.tokens.splice(tokenIndex, 1);
    onStateChanged();
  });
  return chip;
}

function renderThalamAndEduppuInputs() {
  elInputThalam.value = String(state.thalam);
  elThalamBeatsLabel.textContent = `${formatFraction(state.thalam, 4)} beats (${state.thalam} syllables)`;

  const matchingPreset = THALAM_PRESETS.find((p) => p.syllables === state.thalam);
  elSelectThalamPreset.value = matchingPreset ? String(matchingPreset.syllables) : 'custom';

  elInputEduppu.value = String(state.eduppu);
  if (state.eduppu === 0 || state.eduppu % state.thalam === 0) {
    elEduppuBeatsLabel.textContent = 'Samam (0 beats)';
  } else {
    elEduppuBeatsLabel.textContent = `${formatFraction(state.eduppu, 4)} beats (+${state.eduppu} syllables)`;
  }
}

/**
 * @param {string} title
 * @param {number[]} groupLengths
 */
function openBreakdownInspector(title, groupLengths) {
  if (!state.lastResult) return;
  const evaluation = evaluateSequence(state.lastResult.groups, groupLengths);
  elBreakdownTitle.textContent = title;
  elBreakdownSummary.textContent = `Group phrase lengths: [${groupLengths.join(', ')}] • Total Duration: ${evaluation.durationSyllables} syllables (${evaluation.durationBeatsFormatted} beats) • Beat resolution M = ${evaluation.ticksPerBeat} ticks/beat`;

  elBreakdownTbody.innerHTML = '';
  for (const step of evaluation.steps) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${step.segmentIndex + 1}</td>
      <td>Group ${step.groupIndex + 1}</td>
      <td><span class="length-badge fam-${step.nadai.family}">${step.nadai.label}</span> <span class="panel-hint">${step.nadai.name}</span></td>
      <td><strong>${step.length}</strong> letters</td>
      <td>${step.startBeatsFormatted} beats</td>
      <td>Divisible by 1/${step.nadai.num} beat ${step.entryValid ? '✅' : '❌'}</td>
      <td><strong>${step.endBeatsFormatted}</strong> beats</td>
    `;
    elBreakdownTbody.appendChild(tr);
  }
  elBreakdownPanel.style.display = 'block';
}

function computeAndRenderResults() {
  try {
    const groups = tokensToGroups(state.tokens);
    const result = solveKorvais({
      nadai: groups,
      thalam: state.thalam,
      eduppu: state.eduppu,
      maxA: state.maxRange,
      maxB: state.maxRange,
      maxSolutions: 250,
    });
    state.lastResult = result;

    elErrorBanner.style.display = 'none';
    elKernelsSection.style.display = 'block';

    elBasicMainVal.textContent = result.basic.summary;
    elBasicSubVal.textContent = `Playing length ${result.basic.length} in each nadai takes ${result.basic.duration} syllables (${result.basic.beatsFormatted} beats)`;

    elDiffMainVal.textContent = result.differenceBasic.summary;
    elDiffSubVal.textContent = `Start s = ${result.differenceBasic.start}, Step d = +${result.differenceBasic.step} • Takes ${result.differenceBasic.duration} syllables (${result.differenceBasic.beatsFormatted} beats)`;

    elCongruenceSub.textContent = `Solving (a × ${result.basic.duration} + b × ${result.differenceBasic.duration}) ≡ ${result.targetMod} (mod ${result.thalam}) with a ≥ 0, b ≥ 0`;

    const filtered = result.solutions.filter((sol) => {
      if (state.filterMode === 'increasing') return sol.b > 0;
      if (state.filterMode === 'uniform') return sol.b === 0;
      return true;
    });

    elSolutionsCountBadge.textContent = `${filtered.length} solution${filtered.length === 1 ? '' : 's'}`;
    elSolutionsTbody.innerHTML = '';

    if (!result.solvable) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 22px; color: #fca5a5;">
          No integer solution exists because gcd(D_basic=${result.basic.duration}, D_diff=${result.differenceBasic.duration}, Thalam=${result.thalam}) = ${result.kernelGcd} does not divide Eduppu (${result.targetMod}).
        </td>
      `;
      elSolutionsTbody.appendChild(tr);
      return;
    }

    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 22px; color: var(--text-secondary);">
          No solutions in this filter view.
        </td>
      `;
      elSolutionsTbody.appendChild(tr);
      return;
    }

    for (const sol of filtered) {
      const tr = document.createElement('tr');
      const lengthsHtml = result.groups
        .map((g, gIdx) => {
          const family = g[0].family;
          const len = sol.groupLengths[gIdx];
          const countLabel = g.length > 1 ? ` <small style="opacity:0.8">×${g.length}</small>` : '';
          return `<span class="length-badge fam-${family}">${len}${countLabel}</span>`;
        })
        .join('<span style="color:var(--text-muted);font-weight:700;">–</span>');

      const stepText = sol.progressionStep === 0 ? 'Uniform (0)' : `+${sol.progressionStep}`;
      const cycleText =
        result.targetMod === 0
          ? `${sol.cycles} cycle${sol.cycles === 1 ? '' : 's'}`
          : `${sol.cycles} cycle${sol.cycles === 1 ? '' : 's'} + ${result.targetMod}`;

      tr.innerHTML = `
        <td><div class="phrase-lengths-cell">${lengthsHtml}</div></td>
        <td><strong>${stepText}</strong></td>
        <td><code>a=${sol.a}, b=${sol.b}</code> <span class="panel-hint">(${sol.formulaText})</span></td>
        <td><strong>${sol.durationSyllables}</strong> syllables <span class="panel-hint">(${sol.durationBeatsFormatted} beats)</span></td>
        <td>${cycleText}</td>
      `;

      tr.addEventListener('click', () => {
        document
          .querySelectorAll('.solutions-table tbody tr')
          .forEach((r) => r.classList.remove('selected-row'));
        tr.classList.add('selected-row');
        openBreakdownInspector(
          `Solution Breakdown (a=${sol.a}, b=${sol.b} → [${sol.groupLengths.join(', ')}])`,
          sol.groupLengths
        );
      });

      elSolutionsTbody.appendChild(tr);
    }
  } catch (err) {
    elKernelsSection.style.display = 'none';
    elErrorBanner.style.display = 'block';
    elErrorBanner.textContent = err instanceof Error ? err.message : String(err);
  }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.favorites = parsed;
        return;
      }
    }
  } catch (e) {
    console.warn('Could not read favorites:', e);
  }
  state.favorites = [
    {
      id: 'seed-1',
      name: 'Adi Thalam (+1 beat) • 4-66-888',
      nadaiParam: '4-66-888',
      thalam: 32,
      eduppu: 4,
    },
    {
      id: 'seed-2',
      name: 'Mishra Chapu (+¾ beat) • 3 3 4',
      nadaiParam: '3 3 4',
      thalam: 14,
      eduppu: 3,
    },
  ];
}

function saveAndRenderFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
  } catch (e) {
    console.warn('Could not save favorites:', e);
  }

  elFavoritesCountLabel.textContent = `${state.favorites.length} saved`;
  elFavoritesList.innerHTML = '';

  for (const fav of state.favorites) {
    const item = document.createElement('div');
    item.className = 'favorite-item';

    const info = document.createElement('div');
    info.className = 'favorite-info';
    const title = document.createElement('div');
    title.className = 'favorite-title';
    title.textContent = fav.name;
    const meta = document.createElement('div');
    meta.className = 'favorite-meta';
    meta.textContent = `Nadai: ${fav.nadaiParam} • Thalam: ${fav.thalam} • Eduppu: +${fav.eduppu}`;
    info.appendChild(title);
    info.appendChild(meta);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn danger';
    delBtn.style.padding = '3px 8px';
    delBtn.style.fontSize = '0.75rem';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      state.favorites = state.favorites.filter((f) => f.id !== fav.id);
      saveAndRenderFavorites();
    });

    item.addEventListener('click', () => {
      state.tokens = parseToKeypadTokens(fav.nadaiParam);
      state.thalam = fav.thalam;
      state.eduppu = fav.eduppu;
      onStateChanged();
      showToast(`Loaded "${fav.name}"`);
    });

    item.appendChild(info);
    item.appendChild(delBtn);
    elFavoritesList.appendChild(item);
  }
}

function saveCurrentQueryToFavorites() {
  const nadaiParam = serializeTokensToParam(state.tokens);
  if (!nadaiParam) return;
  const alreadyExists = state.favorites.some(
    (f) =>
      f.nadaiParam === nadaiParam &&
      f.thalam === state.thalam &&
      f.eduppu === state.eduppu
  );
  if (alreadyExists) {
    showToast('Query is already in Saved Queries');
    return;
  }
  const customLabel = elInputFavoriteName.value.trim();
  const defaultLabel = `${nadaiParam} (T:${state.thalam}, E:+${state.eduppu})`;
  state.favorites.unshift({
    id: `fav-${Date.now()}`,
    name: customLabel || defaultLabel,
    nadaiParam,
    thalam: state.thalam,
    eduppu: state.eduppu,
  });
  elInputFavoriteName.value = '';
  saveAndRenderFavorites();
  showToast('★ Saved query to favorites');
}

function onStateChanged() {
  elBreakdownPanel.style.display = 'none';
  syncUrlFromState();
  renderSequenceDisplay();
  renderThalamAndEduppuInputs();
  computeAndRenderResults();
}

function attachEventListeners() {
  document.getElementById('btn-key-sep')?.addEventListener('click', () => {
    if (state.tokens.length > 0 && state.tokens[state.tokens.length - 1] !== '-') {
      state.tokens.push('-');
      onStateChanged();
    }
  });
  document.getElementById('btn-key-backspace')?.addEventListener('click', () => {
    if (state.tokens.length > 0) {
      state.tokens.pop();
      onStateChanged();
    }
  });
  document.getElementById('btn-key-clear')?.addEventListener('click', () => {
    state.tokens = [];
    onStateChanged();
  });
  document.querySelectorAll('#preset-sequences-row .preset-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const seq = btn.getAttribute('data-seq');
      if (seq) {
        state.tokens = parseToKeypadTokens(seq);
        onStateChanged();
      }
    });
  });
  elSelectThalamPreset.addEventListener('change', () => {
    if (elSelectThalamPreset.value !== 'custom') {
      state.thalam = Number(elSelectThalamPreset.value);
      onStateChanged();
    }
  });
  elInputThalam.addEventListener('input', () => {
    const val = Number(elInputThalam.value);
    if (Number.isInteger(val) && val >= 2) {
      state.thalam = val;
      onStateChanged();
    }
  });
  document.querySelectorAll('#eduppu-quick-chips .preset-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const eVal = Number(btn.getAttribute('data-eduppu'));
      if (Number.isInteger(eVal) && eVal >= 0) {
        state.eduppu = eVal;
        onStateChanged();
      }
    });
  });
  elInputEduppu.addEventListener('input', () => {
    const val = Number(elInputEduppu.value);
    if (Number.isInteger(val) && val >= 0) {
      state.eduppu = val;
      onStateChanged();
    }
  });
  document.querySelectorAll('.pill-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pill-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.filterMode = tab.getAttribute('data-filter') || 'increasing';
      computeAndRenderResults();
    });
  });
  const elMaxRange = /** @type {HTMLSelectElement} */ (document.getElementById('select-max-range'));
  elMaxRange?.addEventListener('change', () => {
    state.maxRange = Number(elMaxRange.value) || 25;
    computeAndRenderResults();
  });
  document.getElementById('btn-inspect-basic')?.addEventListener('click', () => {
    if (state.lastResult) {
      openBreakdownInspector(
        `Basic Kernel Alignment (${state.lastResult.basic.summary})`,
        state.lastResult.basic.lengths
      );
    }
  });
  document.getElementById('btn-inspect-diff')?.addEventListener('click', () => {
    if (state.lastResult) {
      openBreakdownInspector(
        `Difference_Basic Kernel Alignment (${state.lastResult.differenceBasic.summary})`,
        state.lastResult.differenceBasic.lengths
      );
    }
  });
  document.getElementById('btn-close-breakdown')?.addEventListener('click', () => {
    elBreakdownPanel.style.display = 'none';
  });
  document.getElementById('btn-share-url')?.addEventListener('click', async () => {
    syncUrlFromState();
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('🔗 Shareable link copied to clipboard!');
    } catch {
      showToast(`Share URL: ${url}`);
    }
  });
  document.getElementById('btn-save-favorite')?.addEventListener('click', saveCurrentQueryToFavorites);
  document.getElementById('btn-add-favorite-inline')?.addEventListener('click', saveCurrentQueryToFavorites);
}

initKeypad();
initThalamPresets();
loadFavorites();
loadStateFromUrl();
saveAndRenderFavorites();
attachEventListeners();
onStateChanged();
