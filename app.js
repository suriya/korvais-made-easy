// @ts-check
/**
 * Korvai's Made Easy — Mobile-First Main UI Controller (index.html)
 * Streamlined for performers:
 * 1. Thalam & Eduppu first
 * 2. Compact family-grouped Nadai keypad
 * 3. Top N phrase length combinations sorted in ascending order of total duration
 */

import {
  NADAI_CATALOG,
  NADAI_FAMILIES,
  THALAM_PRESETS,
  formatFraction,
  tokensToGroups,
  parseToKeypadTokens,
  serializeTokensToParam,
  solveKorvais,
} from './korvai.js';

const FAVORITES_STORAGE_KEY = 'korvai_saved_favorites_v1';
const TOP_N_SOLUTIONS = 30;

const state = {
  /** @type {string[]} */
  tokens: ['4', '-', '6', '6', '-', '8', '8', '8'],
  thalam: 32,
  eduppu: 4,
  /** @type {Array<{id: string, name: string, nadaiParam: string, thalam: number, eduppu: number}>} */
  favorites: [],
};

// DOM References
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
const elKeypadRows = /** @type {HTMLElement} */ (document.getElementById('keypad-rows'));
const elSequenceGroupsRow = /** @type {HTMLElement} */ (
  document.getElementById('sequence-groups-row')
);
const elSequenceCanonicalText = /** @type {HTMLElement} */ (
  document.getElementById('sequence-canonical-text')
);
const elErrorBanner = /** @type {HTMLElement} */ (document.getElementById('error-banner'));
const elSolutionsCountBadge = /** @type {HTMLElement} */ (
  document.getElementById('solutions-count-badge')
);
const elPhraseResultsGrid = /** @type {HTMLElement} */ (
  document.getElementById('phrase-results-grid')
);
const elFavoritesList = /** @type {HTMLElement} */ (document.getElementById('favorites-list'));
const elFavoritesCountLabel = /** @type {HTMLElement} */ (
  document.getElementById('favorites-count-label')
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
  }, 2200);
}

/**
 * Builds the compact family-grouped Nadai keypad (with Chaturshra Trishram on its own row).
 */
function initKeypad() {
  elKeypadRows.innerHTML = '';
  for (const fam of NADAI_FAMILIES) {
    const row = document.createElement('div');
    row.className = 'compact-keypad-row';

    const labelCell = document.createElement('div');
    labelCell.className = 'family-label-cell';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'family-label-name';
    nameSpan.textContent = fam.label;
    labelCell.appendChild(nameSpan);

    const btnCell = document.createElement('div');
    btnCell.className = 'family-buttons-cell';

    for (const speedId of fam.speeds) {
      const spec = NADAI_CATALOG[speedId];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = `btn-speed-${speedId.replace('/', '-')}`;
      btn.className = `speed-btn fam-${spec.family}`;
      btn.textContent = spec.label;
      btn.title = spec.name;
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
      const parsed = parseToKeypadTokens(nadaiParam);
      if (parsed.length > 0) state.tokens = parsed;
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
  chip.title = `Tap to remove "${label}"`;
  chip.addEventListener('click', () => {
    state.tokens.splice(tokenIndex, 1);
    onStateChanged();
  });
  return chip;
}

function renderSequenceDisplay() {
  elSequenceGroupsRow.innerHTML = '';
  const hasExplicitSep = state.tokens.includes('-');
  const canonicalStr = serializeTokensToParam(state.tokens);
  elSequenceCanonicalText.textContent = canonicalStr || '(empty)';

  if (state.tokens.length === 0) {
    const emptyHint = document.createElement('span');
    emptyHint.className = 'panel-hint';
    emptyHint.textContent = 'Tap speed buttons below to build nadai sequence...';
    elSequenceGroupsRow.appendChild(emptyHint);
    return;
  }

  if (!hasExplicitSep) {
    state.tokens.forEach((tok, idx) => {
      const spec = NADAI_CATALOG[tok];
      const box = document.createElement('span');
      box.className = 'group-pill-box';
      box.appendChild(
        createTokenChip(spec ? spec.label : tok, spec ? spec.family : 'chaturshram', idx)
      );
      elSequenceGroupsRow.appendChild(box);
    });
  } else {
    let currentBox = document.createElement('span');
    currentBox.className = 'group-pill-box';
    let currentHasItems = false;

    state.tokens.forEach((tok, idx) => {
      if (tok === '-') {
        if (currentHasItems) {
          elSequenceGroupsRow.appendChild(currentBox);
          currentBox = document.createElement('span');
          currentBox.className = 'group-pill-box';
          currentHasItems = false;
        }
        const sep = document.createElement('span');
        sep.className = 'group-sep-badge';
        sep.textContent = '—';
        sep.style.cursor = 'pointer';
        sep.addEventListener('click', () => {
          state.tokens.splice(idx, 1);
          onStateChanged();
        });
        elSequenceGroupsRow.appendChild(sep);
      } else {
        const spec = NADAI_CATALOG[tok];
        currentBox.appendChild(
          createTokenChip(spec ? spec.label : tok, spec ? spec.family : 'chaturshram', idx)
        );
        currentHasItems = true;
      }
    });

    if (currentHasItems) {
      elSequenceGroupsRow.appendChild(currentBox);
    }
  }
}

function renderThalamAndEduppuInputs() {
  elInputThalam.value = String(state.thalam);
  elThalamBeatsLabel.textContent = `${formatFraction(state.thalam, 4)} beats (${state.thalam})`;

  const matchingPreset = THALAM_PRESETS.find((p) => p.syllables === state.thalam);
  elSelectThalamPreset.value = matchingPreset ? String(matchingPreset.syllables) : 'custom';

  elInputEduppu.value = String(state.eduppu);
  if (state.eduppu === 0 || state.eduppu % state.thalam === 0) {
    elEduppuBeatsLabel.textContent = 'Samam';
  } else {
    elEduppuBeatsLabel.textContent = `${formatFraction(state.eduppu, 4)}b`;
  }
}

/**
 * Computes and renders the top N phrase combinations sorted in ascending order of total duration.
 * Only displays the value of each phrase (no a, b, or total duration).
 */
function computeAndRenderResults() {
  elPhraseResultsGrid.innerHTML = '';
  try {
    const groups = tokensToGroups(state.tokens);
    const result = solveKorvais({
      nadai: groups,
      thalam: state.thalam,
      eduppu: state.eduppu,
      maxA: 40,
      maxB: 40,
      maxSolutions: 300,
    });

    elErrorBanner.style.display = 'none';

    if (!result.solvable) {
      elSolutionsCountBadge.textContent = '0 matches';
      elErrorBanner.style.display = 'block';
      elErrorBanner.textContent =
        'No valid korvai exists for this Thalam and Eduppu combination (parity mismatch).';
      return;
    }

    // Deduplicate identical phrase length sequences and keep top N in ascending duration order
    const seen = new Set();
    const uniqueTop = [];
    for (const sol of result.solutions) {
      const key = sol.groupLengths.join(',');
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTop.push(sol);
        if (uniqueTop.length >= TOP_N_SOLUTIONS) break;
      }
    }

    elSolutionsCountBadge.textContent = `Showing top ${uniqueTop.length}`;

    uniqueTop.forEach((sol, idx) => {
      const row = document.createElement('div');
      row.className = 'phrase-result-row';

      const numSpan = document.createElement('span');
      numSpan.className = 'phrase-result-index';
      numSpan.textContent = `#${idx + 1}`;

      const valuesWrap = document.createElement('div');
      valuesWrap.className = 'phrase-values-wrap';

      result.groups.forEach((g, gIdx) => {
        if (gIdx > 0) {
          const sep = document.createElement('span');
          sep.className = 'phrase-sep';
          sep.textContent = '-';
          valuesWrap.appendChild(sep);
        }
        for (const spec of g) {
          const pill = document.createElement('span');
          pill.className = `phrase-value-pill fam-${spec.family}`;
          pill.textContent = String(sol.groupLengths[gIdx]);
          valuesWrap.appendChild(pill);
        }
      });

      row.appendChild(numSpan);
      row.appendChild(valuesWrap);
      elPhraseResultsGrid.appendChild(row);
    });
  } catch (err) {
    elSolutionsCountBadge.textContent = '';
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
        const seen = new Set();
        state.favorites = parsed.filter((f) => {
          const key = `${f.nadaiParam}|${f.thalam}|${f.eduppu}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
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

  if (state.favorites.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'panel-hint';
    empty.textContent = 'No saved queries yet.';
    elFavoritesList.appendChild(empty);
    return;
  }

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
  if (!nadaiParam) {
    showToast('Select at least one Nadai speed first');
    return;
  }
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
  const defaultLabel = `${nadaiParam} (T:${state.thalam}, E:+${state.eduppu})`;
  state.favorites.unshift({
    id: `fav-${Date.now()}`,
    name: defaultLabel,
    nadaiParam,
    thalam: state.thalam,
    eduppu: state.eduppu,
  });
  saveAndRenderFavorites();
  showToast('★ Saved query');
}

function onStateChanged() {
  syncUrlFromState();
  renderThalamAndEduppuInputs();
  renderSequenceDisplay();
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

  document.getElementById('btn-save-favorite')?.addEventListener('click', saveCurrentQueryToFavorites);
}

initKeypad();
initThalamPresets();
loadFavorites();
loadStateFromUrl();
saveAndRenderFavorites();
attachEventListeners();
onStateChanged();
