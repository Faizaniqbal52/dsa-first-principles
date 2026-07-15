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
    try { localStorage.setItem('fp-strings-story', '1'); } catch (e) {}
  }
  var choiceBtns = document.querySelectorAll('#ch1-choices button');
  choiceBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      choiceBtns.forEach(function (x) { x.disabled = true; });
      b.style.borderColor = 'var(--accent)';
      b.disabled = false;
      open($('ch1-r-' + b.dataset.choice));
      open($('ch1-vars'));
    });
  });
  $('ch1-continue').addEventListener('click', function () {
    openRest();
    setTimeout(function () { $('invention').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 60);
  });
  $('skip-story').addEventListener('click', function () {
    document.querySelectorAll('#story .reveal').forEach(open);
    openRest();
  });
  try {
    if (localStorage.getItem('fp-strings-story') === '1') {
      document.querySelectorAll('#story .reveal').forEach(function (el) { el.classList.add('open'); });
      restOpen = true;
      $('rest').classList.add('open');
    }
  } catch (e) {}

  /* ---------- encode-a-word demo ---------- */
  function renderWord(word) {
    var box = $('word-cells');
    if (!word.length) {
      box.innerHTML = '';
      $('word-note').textContent = 'Type a word first, then press the button.';
      return;
    }
    var html = '';
    for (var k = 0; k < word.length; k++) {
      var ch = word.charAt(k);
      var code = word.charCodeAt(k);
      var shown = ch === ' ' ? '␣' : ch;
      html += '<div class="cell lit"><span class="idx">position ' + k + '</span>' +
        shown + '<span class="addr">= ' + code + '</span></div>';
    }
    box.innerHTML = html;
    $('word-note').innerHTML = '"' + word + '" is really the numbers ' +
      Array.prototype.map.call(word, function (c) { return c.charCodeAt(0); }).join(', ') +
      '. A row of numbers, side by side. That is an array.';
  }
  $('btn-encode').addEventListener('click', function () {
    renderWord($('word-input').value.trim());
  });
  $('word-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') renderWord($('word-input').value.trim());
  });

  /* ---------- reverse (two pointers) demo ---------- */
  var revBase = ['b', 'o', 'o', 'm', 'e', 'r', 'a', 'n', 'g'];
  var revArr = revBase.slice();
  var revBusy = false;
  function renderRev(l, r) {
    $('rev-cells').innerHTML = revArr.map(function (ch, k) {
      var lit = (k === l || k === r) ? ' lit' : '';
      return '<div class="cell' + lit + '"><span class="idx">' + k + '</span>' + ch + '</div>';
    }).join('');
  }
  $('btn-reverse').addEventListener('click', function () {
    if (revBusy) return;
    revBusy = true;
    var swaps = 0;
    var l = 0, r = revArr.length - 1;
    function step() {
      if (l < r) {
        var t = revArr[l]; revArr[l] = revArr[r]; revArr[r] = t;
        swaps++;
        $('rev-count').textContent = swaps;
        renderRev(l, r);
        l++; r--;
        setTimeout(step, reduced ? 0 : 460);
      } else {
        renderRev(-1, -1);
        $('rev-note').innerHTML = 'Done in <b>' + swaps + ' swaps</b>. Each character was touched once, so reversing is O(n) time, and we used no second array, so O(1) extra space.';
        revBusy = false;
      }
    }
    step();
  });
  $('btn-rev-reset').addEventListener('click', function () {
    if (revBusy) return;
    revArr = revBase.slice();
    $('rev-count').textContent = '0';
    $('rev-note').innerHTML = 'The two lit lockers are the pointers. Each step swaps them and moves both one closer to the middle. A word of 9 letters needs just 4 swaps.';
    renderRev(0, revArr.length - 1);
  });
  renderRev(0, revArr.length - 1);

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
    try { saved = JSON.parse(localStorage.getItem('fp-strings-check') || '{}'); } catch (e) {}
    boxes.forEach(function (b) { b.checked = !!saved[b.dataset.key]; });
    updateProgress();
  }
  function saveChecks() {
    var out = {};
    boxes.forEach(function (b) { out[b.dataset.key] = b.checked; });
    try { localStorage.setItem('fp-strings-check', JSON.stringify(out)); } catch (e) {}
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
      done === boxes.length ? 'All done. You proved a "new" topic was arrays in disguise, and you picked up two patterns you\'ll reuse for months. When you\'re ready, tell Claude: "Module 2: Grids."' :
      done >= boxes.length / 2 ? 'More than halfway. Keep the two-pointer and counting ideas close, they come back constantly.' : '';
  }
  boxes.forEach(function (b) {
    b.addEventListener('change', function () { saveChecks(); updateProgress(); });
  });
  loadChecks();

  /* remember how many checkpoints this module has, so the map can show it */
  try { localStorage.setItem('fp-strings-total', String(boxes.length)); } catch (e) {}
})();
