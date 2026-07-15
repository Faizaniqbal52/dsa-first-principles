(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return document.getElementById(id); }
  function open(el) { if (el) { el.classList.add('open', 'fade-in'); } }
  function fmt(n) { return n.toLocaleString('en-US'); }

  /* ---------- first variable demo ---------- */
  var stored = null;
  $('btn-store').addEventListener('click', function () {
    var v = parseInt($('age-input').value, 10);
    if (isNaN(v) || v < 1 || v > 120) {
      $('age-note').textContent = 'Type a real age first (1 to 120), then press the button.';
      return;
    }
    stored = v;
    $('age-locker').innerHTML =
      '<div class="locker">' + '?' + '<span class="tag">locker 7204157</span></div>' +
      '<div class="locker lit">' + v + '<span class="tag">locker 7204158 · "age"</span></div>' +
      '<div class="locker">' + '?' + '<span class="tag">locker 7204159</span></div>';
    $('btn-print').disabled = false;
    $('age-note').innerHTML = 'Done. Your number <b>' + v + '</b> is sitting in locker 7,204,158, and the sticker "age" points to it. The lockers beside it belong to other parts of the program.';
  });
  $('btn-print').addEventListener('click', function () {
    if (stored === null) return;
    $('age-note').innerHTML = 'The computer sees "age" → looks up which locker the sticker points to → opens locker 7,204,158 → <b>prints ' + stored + '</b>. That lookup-by-name is everything a variable does.';
  });

  /* ---------- story flow ---------- */
  var restOpen = false;
  function openRest() {
    if (restOpen) return;
    restOpen = true;
    open($('rest'));
    try { localStorage.setItem('fp-arrays-ch0', '1'); } catch (e) {}
  }
  var choiceBtns = document.querySelectorAll('#ch0-choices button');
  choiceBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      choiceBtns.forEach(function (x) { x.disabled = true; });
      b.style.borderColor = 'var(--accent)';
      b.disabled = false;
      open($('ch0-r-' + b.dataset.choice));
      open($('ch0-vars'));
      renderVars();
    });
  });
  function renderVars() {
    var box = $('varlist');
    if (box.childNodes.length) return;
    var html = '';
    for (var i = 1; i <= 21; i++) html += '<div>marks' + i + ' = 0</div>';
    html += '<div class="more">… 9,978 more lines like this …</div>';
    html += '<div>marks10000 = 0</div>';
    box.innerHTML = html;
  }
  document.querySelectorAll('#print-choices button').forEach(function (b) {
    b.addEventListener('click', function () {
      open($('print-r-' + b.dataset.attempt));
      open($('ch0-wall'));
    });
  });
  $('ch0-continue').addEventListener('click', function () {
    openRest();
    setTimeout(function () { $('invention').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 60);
  });
  $('skip-story').addEventListener('click', function () {
    document.querySelectorAll('#story .reveal').forEach(open);
    renderVars();
    openRest();
  });
  try {
    if (localStorage.getItem('fp-arrays-ch0') === '1') {
      document.querySelectorAll('#story .reveal').forEach(function (el) { el.classList.add('open'); });
      renderVars();
      restOpen = true;
      $('rest').classList.add('open');
    }
  } catch (e) {}

  /* ---------- locker strip ---------- */
  var BASE = 5000;
  function renderStrip(i) {
    var box = $('ram-cells');
    var html = '';
    for (var k = 0; k < 4; k++) html += cellHtml(k, i === k);
    if (i > 4) html += '<div class="cell gap">…</div>';
    if (i >= 4) html += cellHtml(i, true);
    if (i < 9999) html += '<div class="cell gap">…</div>' + cellHtml(9999, false);
    box.innerHTML = html;
  }
  function cellHtml(k, lit) {
    return '<div class="cell' + (lit ? ' lit' : '') + '"><span class="idx">position ' + k + '</span>' +
      'mark<span class="addr">locker ' + fmt(BASE + k) + '</span></div>';
  }
  function getIdx() {
    var v = parseInt($('idx-input').value, 10);
    if (isNaN(v) || v < 0) v = 0;
    if (v > 9999) v = 9999;
    $('idx-input').value = v;
    return v;
  }
  $('btn-compute').addEventListener('click', function () {
    var i = getIdx();
    renderStrip(i);
    $('ram-formula').innerHTML = '5000 + <b>' + fmt(i) + '</b> = locker <b>' + fmt(BASE + i) + '</b>, calculated, not searched.';
    $('calc-count').textContent = '1 sum';
    $('calc-sub').textContent = 'the same single addition, for any position';
  });
  var walking = false;
  $('btn-walk').addEventListener('click', function () {
    if (walking) return;
    var i = getIdx();
    renderStrip(i);
    var out = $('walk-count');
    if (reduced || i === 0) {
      out.textContent = fmt(i) + ' doors';
      $('walk-sub').textContent = 'opened one by one, all the way to position ' + fmt(i);
      return;
    }
    walking = true;
    var dur = Math.min(2600, 400 + i * 0.25);
    var t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      out.textContent = fmt(Math.round(eased * i)) + ' doors';
      if (p < 1) requestAnimationFrame(tick);
      else {
        walking = false;
        $('walk-sub').textContent = 'opened one by one, all the way to position ' + fmt(i);
      }
    }
    requestAnimationFrame(tick);
  });
  renderStrip(8436);

  /* ---------- cache shelf ---------- */
  (function () {
    var box = $('cache-cells');
    var vals = [72, 65, 91, 58, 77, 83, 69, 95, 61, 88, 74, 80, 67, 93, 55, 86];
    box.innerHTML = vals.map(function (v, k) {
      return '<div class="cell" data-k="' + k + '" role="button" tabindex="0" style="cursor:pointer;min-width:44px;">' +
        '<span class="idx">' + k + '</span>' + v + '</div>';
    }).join('');
    function fire(k) {
      box.querySelectorAll('.cell').forEach(function (c, j) {
        c.classList.toggle('lit', j === k);
        c.classList.toggle('warm', j !== k);
      });
      $('cache-note').innerHTML = 'You asked for position <b>' + k + '</b>. The computer photocopied the whole shelf onto its desk, all 16 values. The next reads in your loop cost almost nothing.';
    }
    box.addEventListener('click', function (e) {
      var c = e.target.closest('.cell');
      if (c) fire(parseInt(c.dataset.k, 10));
    });
    box.addEventListener('keydown', function (e) {
      var c = e.target.closest('.cell');
      if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fire(parseInt(c.dataset.k, 10)); }
    });
  })();

  /* ---------- insert-at-front demo ---------- */
  var insBase = [7, 12, 5, 9, 3, 14, 8, null];
  var insArr = insBase.slice();
  var insBusy = false;
  function renderIns(hot) {
    $('ins-cells').innerHTML = insArr.map(function (v, k) {
      var lit = (k === hot) ? ' lit' : '';
      return '<div class="cell' + lit + '"><span class="idx">' + k + '</span>' + (v === null ? '·' : v) + '</div>';
    }).join('');
  }
  $('btn-insert').addEventListener('click', function () {
    if (insBusy || insArr[0] === 99) return;
    insBusy = true;
    var shifts = 0;
    var j = insArr.length - 2;
    function step() {
      if (j >= 0) {
        insArr[j + 1] = insArr[j];
        insArr[j] = null;
        shifts++;
        $('ins-count').textContent = shifts;
        renderIns(j + 1);
        j--;
        setTimeout(step, reduced ? 0 : 320);
      } else {
        insArr[0] = 99;
        renderIns(0);
        $('ins-note').innerHTML = shifts + ' values → <b>' + shifts + ' moves for ONE insertion.</b> With 10 million values arriving non-stop, the machine would spend its whole life shifting instead of serving. This exact pain gives birth to Module 2.';
        insBusy = false;
      }
    }
    step();
  });
  $('btn-ins-reset').addEventListener('click', function () {
    if (insBusy) return;
    insArr = insBase.slice();
    $('ins-count').textContent = '0';
    $('ins-note').innerHTML = '7 values → 7 moves, for ONE insertion. Imagine 10 million values, with new ones arriving every second. That\'s O(n) pain, over and over.';
    renderIns(-1);
  });
  renderIns(-1);

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
    try { saved = JSON.parse(localStorage.getItem('fp-arrays-check') || '{}'); } catch (e) {}
    boxes.forEach(function (b) { b.checked = !!saved[b.dataset.key]; });
    updateProgress();
  }
  function saveChecks() {
    var out = {};
    boxes.forEach(function (b) { out[b.dataset.key] = b.checked; });
    try { localStorage.setItem('fp-arrays-check', JSON.stringify(out)); } catch (e) {}
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
      done === boxes.length ? 'All done. You now understand arrays more deeply than most people who have solved 200 problems, and you have a method for the problems too. When you\'re ready, tell Claude: "Module 2, linked lists."' :
      done >= boxes.length / 2 ? 'More than halfway. The remaining lines are the ones interviews actually test.' : '';
  }
  boxes.forEach(function (b) {
    b.addEventListener('change', function () { saveChecks(); updateProgress(); });
  });
  loadChecks();

  /* remember how many checkpoints this module has, so the map can show it */
  try { localStorage.setItem('fp-arrays-total', String(boxes.length)); } catch (e) {}
})();
