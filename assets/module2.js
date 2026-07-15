(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  function open(el) { if (el) { el.classList.add('open', 'fade-in'); } }

  /* ---------- story flow ---------- */
  var restOpen = false;
  function openRest() {
    if (restOpen) return;
    restOpen = true;
    open($('rest'));
    try { localStorage.setItem('fp-grids-story', '1'); } catch (e) {}
  }
  var choiceBtns = document.querySelectorAll('#ch2-choices button');
  choiceBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      choiceBtns.forEach(function (x) { x.disabled = true; });
      b.style.borderColor = 'var(--accent)';
      b.disabled = false;
      open($('ch2-r-' + b.dataset.choice));
      open($('ch2-vars'));
    });
  });
  $('ch2-continue').addEventListener('click', function () {
    openRest();
    setTimeout(function () { $('invention').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 60);
  });
  $('skip-story').addEventListener('click', function () {
    document.querySelectorAll('#story .reveal').forEach(open);
    openRest();
  });
  try {
    if (localStorage.getItem('fp-grids-story') === '1') {
      document.querySelectorAll('#story .reveal').forEach(function (el) { el.classList.add('open'); });
      restOpen = true;
      $('rest').classList.add('open');
    }
  } catch (e) {}

  /* ---------- grid to memory demo ---------- */
  var GROWS = 4, GCOLS = 5;
  var lastR = -1, lastC = -1;
  var gridBox = $('grid-cells');
  var flatBox = $('flat-cells');

  function buildGrid() {
    gridBox.style.gridTemplateColumns = 'repeat(' + GCOLS + ', 48px)';
    var html = '';
    for (var r = 0; r < GROWS; r++) {
      for (var c = 0; c < GCOLS; c++) {
        var idx = r * GCOLS + c;
        html += '<div class="gcell" data-r="' + r + '" data-c="' + c + '" role="button" tabindex="0">' +
          '<span class="rc">' + r + ',' + c + '</span>' + idx + '</div>';
      }
    }
    gridBox.innerHTML = html;
  }
  function buildFlat() {
    var html = '';
    for (var i = 0; i < GROWS * GCOLS; i++) {
      html += '<div class="cell" data-i="' + i + '"><span class="idx">' + i + '</span>·</div>';
    }
    flatBox.innerHTML = html;
  }
  function clearLit() {
    gridBox.querySelectorAll('.gcell').forEach(function (el) { el.classList.remove('lit', 'warm'); });
    flatBox.querySelectorAll('.cell').forEach(function (el) { el.classList.remove('lit', 'warm'); });
  }
  function litFlat(idx, cls) {
    var el = flatBox.querySelector('.cell[data-i="' + idx + '"]');
    if (el) el.classList.add(cls);
  }
  function litGrid(r, c, cls) {
    var el = gridBox.querySelector('.gcell[data-r="' + r + '"][data-c="' + c + '"]');
    if (el) el.classList.add(cls);
  }
  function selectCell(r, c) {
    lastR = r; lastC = c;
    clearLit();
    var idx = r * GCOLS + c;
    litGrid(r, c, 'lit');
    litFlat(idx, 'lit');
    $('grid-formula').innerHTML = 'cell (row <b>' + r + '</b>, col <b>' + c + '</b>) &nbsp;→&nbsp; ' +
      r + ' × ' + GCOLS + ' + ' + c + ' = locker <b>' + idx + '</b>';
    $('btn-lightrow').disabled = false;
    $('btn-lightcol').disabled = false;
  }
  gridBox.addEventListener('click', function (e) {
    var el = e.target.closest('.gcell');
    if (el) selectCell(parseInt(el.dataset.r, 10), parseInt(el.dataset.c, 10));
  });
  gridBox.addEventListener('keydown', function (e) {
    var el = e.target.closest('.gcell');
    if (el && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      selectCell(parseInt(el.dataset.r, 10), parseInt(el.dataset.c, 10));
    }
  });
  $('btn-lightrow').addEventListener('click', function () {
    if (lastR < 0) return;
    clearLit();
    for (var c = 0; c < GCOLS; c++) {
      var cls = (c === lastC) ? 'lit' : 'warm';
      litGrid(lastR, c, cls);
      litFlat(lastR * GCOLS + c, cls);
    }
    $('grid-note').innerHTML = 'Row <b>' + lastR + '</b> is a solid run of neighbours in memory: lockers ' +
      (lastR * GCOLS) + ' to ' + (lastR * GCOLS + GCOLS - 1) + '. Scanning it rides the cache for free.';
  });
  $('btn-lightcol').addEventListener('click', function () {
    if (lastC < 0) return;
    clearLit();
    var spots = [];
    for (var r = 0; r < GROWS; r++) {
      var cls = (r === lastR) ? 'lit' : 'warm';
      litGrid(r, lastC, cls);
      litFlat(r * GCOLS + lastC, cls);
      spots.push(r * GCOLS + lastC);
    }
    $('grid-note').innerHTML = 'Column <b>' + lastC + '</b> is scattered: lockers ' + spots.join(', ') +
      '. Each step jumps ' + GCOLS + ' lockers, so it keeps missing the cache.';
  });
  buildGrid();
  buildFlat();

  /* ---------- ask-why toggles ---------- */
  document.querySelectorAll('.why-btn').forEach(function (b) {
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var panel = b.parentElement.nextElementSibling;
      if (panel && panel.classList.contains('why-panel')) {
        var isOpen = panel.classList.toggle('open');
        b.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        b.textContent = isOpen ? 'okay' : 'why?';
      }
    });
  });

  /* ---------- hint ladders ---------- */
  document.querySelectorAll('[data-next-hint]').forEach(function (btn) {
    var key = btn.dataset.nextHint;
    var hints = document.querySelectorAll('[data-hints="' + key + '"] .hint');
    var shown = 0;
    btn.addEventListener('click', function () {
      if (shown < hints.length) { open(hints[shown]); shown++; }
      if (shown >= hints.length) {
        btn.textContent = 'That was the last hint, now decide your answer';
        btn.disabled = true;
      } else {
        btn.textContent = 'Reveal hint ' + (shown + 1);
      }
    });
  });

  /* ---------- layer reveals ---------- */
  document.querySelectorAll('[data-reveal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      open($(btn.dataset.reveal));
      btn.style.display = 'none';
    });
  });

  /* ---------- unfold panels (reveal-as-you-go) ---------- */
  document.querySelectorAll('.unfold-btn').forEach(function (b) {
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var panel = b.nextElementSibling;
      if (panel && panel.classList.contains('unfold')) {
        var isOpen = panel.classList.toggle('open');
        b.classList.toggle('done', isOpen);
        b.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  /* ---------- check-your-understanding (no scores, just feedback) ---------- */
  document.querySelectorAll('.cp').forEach(function (cp) {
    var answer = cp.dataset.answer;
    var opts = cp.querySelectorAll('.cp-opts button');
    var fb = cp.querySelector('.cp-fb');
    var nudge = cp.querySelector('.cp-nudge');
    var solved = false;
    opts.forEach(function (b) {
      b.addEventListener('click', function () {
        if (solved) return;
        if (b.dataset.opt === answer) {
          solved = true;
          b.classList.add('right');
          if (nudge) nudge.classList.remove('show');
          opts.forEach(function (x) { x.disabled = true; });
          if (fb) fb.classList.add('show');
        } else {
          b.classList.add('nope');
          b.disabled = true;
          if (nudge) nudge.classList.add('show');
        }
      });
    });
  });

  /* ---------- understanding checklist ---------- */
  var boxes = document.querySelectorAll('#checklist input');
  function loadChecks() {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem('fp-grids-check') || '{}'); } catch (e) {}
    boxes.forEach(function (b) { b.checked = !!saved[b.dataset.key]; });
    updateProgress();
  }
  function saveChecks() {
    var out = {};
    boxes.forEach(function (b) { out[b.dataset.key] = b.checked; });
    try { localStorage.setItem('fp-grids-check', JSON.stringify(out)); } catch (e) {}
  }
  function updateProgress() {
    var done = 0;
    boxes.forEach(function (b) {
      if (b.checked) done++;
      b.parentElement.querySelector('span').classList.toggle('done', b.checked);
    });
    var pct = Math.round(done / boxes.length * 100);
    $('progress-fill').style.width = pct + '%';
    $('progress-num').textContent = pct + '%';
    $('check-msg').textContent =
      done === boxes.length ? 'All done. The address sum, the cache, and two pointers keep paying off. When you\'re ready, tell Claude: "Module 3: Two pointers and sliding window."' :
      done >= boxes.length / 2 ? 'More than halfway. The index maths and loop order are the parts interviews actually test.' : '';
  }
  boxes.forEach(function (b) {
    b.addEventListener('change', function () { saveChecks(); updateProgress(); });
  });
  loadChecks();

  /* remember how many checkpoints this module has, so the map can show it */
  try { localStorage.setItem('fp-grids-total', String(boxes.length)); } catch (e) {}
})();
