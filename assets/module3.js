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
    try { localStorage.setItem('fp-twoptr-story', '1'); } catch (e) {}
  }
  var choiceBtns = document.querySelectorAll('#ch3-choices button');
  choiceBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      choiceBtns.forEach(function (x) { x.disabled = true; });
      b.style.borderColor = 'var(--accent)';
      b.disabled = false;
      open($('ch3-r-' + b.dataset.choice));
      open($('ch3-vars'));
    });
  });
  $('ch3-continue').addEventListener('click', function () {
    openRest();
    setTimeout(function () { $('twoptr').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }, 60);
  });
  $('skip-story').addEventListener('click', function () {
    document.querySelectorAll('#story .reveal').forEach(open);
    openRest();
  });
  try {
    if (localStorage.getItem('fp-twoptr-story') === '1') {
      document.querySelectorAll('#story .reveal').forEach(function (el) { el.classList.add('open'); });
      restOpen = true;
      $('rest').classList.add('open');
    }
  } catch (e) {}

  /* ---------- two pointers (converging) demo ---------- */
  var TP = [1, 2, 4, 7, 9, 11, 15];
  var TARGET = 11;
  var tl = 0, tr = TP.length - 1, tdone = false;
  function renderTP() {
    $('tp-cells').innerHTML = TP.map(function (v, k) {
      var cls = '';
      if (k === tl || k === tr) cls = ' lit';
      var tag = k === tl ? 'left' : (k === tr ? 'right' : '');
      return '<div class="cell' + cls + '"><span class="idx">' + tag + '</span>' + v + '</div>';
    }).join('');
    $('tp-sum').textContent = (tl < tr || tdone) ? (TP[tl] + TP[tr]) : '?';
  }
  $('btn-tp-step').addEventListener('click', function () {
    if (tdone || tl >= tr) return;
    var sum = TP[tl] + TP[tr];
    if (sum === TARGET) {
      tdone = true;
      renderTP();
      $('tp-msg').innerHTML = TP[tl] + ' + ' + TP[tr] + ' = <b>' + TARGET + '</b>. Found it, at positions ' + tl + ' and ' + tr + '. One pass, no pair checked twice.';
      $('btn-tp-step').disabled = true;
    } else if (sum < TARGET) {
      $('tp-msg').innerHTML = TP[tl] + ' + ' + TP[tr] + ' = ' + sum + ', too small. Step the <b>left</b> pointer right to grow the sum.';
      tl++;
      renderTP();
    } else {
      $('tp-msg').innerHTML = TP[tl] + ' + ' + TP[tr] + ' = ' + sum + ', too big. Step the <b>right</b> pointer left to shrink the sum.';
      tr--;
      renderTP();
    }
  });
  $('btn-tp-reset').addEventListener('click', function () {
    tl = 0; tr = TP.length - 1; tdone = false;
    $('btn-tp-step').disabled = false;
    $('tp-msg').innerHTML = 'Two lit lockers are the pointers. Each step compares their sum to the target and moves one pointer. No pair is ever checked twice.';
    renderTP();
  });
  renderTP();

  /* ---------- sliding window demo ---------- */
  var SW = [2, 1, 5, 1, 3, 2];
  var K = 3;
  var wl = 0, wsum = 0, wmax = 0;
  function windowSum(start) {
    var s = 0;
    for (var i = start; i < start + K; i++) s += SW[i];
    return s;
  }
  function renderSW() {
    $('sw-cells').innerHTML = SW.map(function (v, k) {
      var inWin = (k >= wl && k < wl + K);
      return '<div class="cell' + (inWin ? ' lit' : '') + '"><span class="idx">day ' + k + '</span>' + v + '</div>';
    }).join('');
    $('sw-sum').textContent = wsum;
    $('sw-max').textContent = wmax;
  }
  $('btn-sw-step').addEventListener('click', function () {
    if (wl + K > SW.length - 1) {
      $('sw-msg').innerHTML = 'Reached the end. The best window sum was <b>' + wmax + '</b>. The whole scan was one pass, O(n).';
      return;
    }
    var entering = SW[wl + K];
    var leaving = SW[wl];
    wsum += entering - leaving;
    wl++;
    if (wsum > wmax) wmax = wsum;
    renderSW();
    $('sw-msg').innerHTML = 'Slid one day right: added ' + entering + ', removed ' + leaving + '. New window sum ' + wsum + '. One add, one subtract, not a full recount.';
  });
  $('btn-sw-reset').addEventListener('click', function () {
    wl = 0; wsum = windowSum(0); wmax = wsum;
    $('sw-msg').innerHTML = 'The lit lockers are the current window. Each slide does one add and one subtract, no matter how wide the window is. That\'s the trick.';
    renderSW();
  });
  wsum = windowSum(0); wmax = wsum;
  renderSW();

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
    try { saved = JSON.parse(localStorage.getItem('fp-twoptr-check') || '{}'); } catch (e) {}
    boxes.forEach(function (b) { b.checked = !!saved[b.dataset.key]; });
    updateProgress();
  }
  function saveChecks() {
    var out = {};
    boxes.forEach(function (b) { out[b.dataset.key] = b.checked; });
    try { localStorage.setItem('fp-twoptr-check', JSON.stringify(out)); } catch (e) {}
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
      done === boxes.length ? 'All done. That is the end of Arc 0. You have a real scanning toolkit now. When you\'re ready, tell Claude: "Module 4: Linked lists."' :
      done >= boxes.length / 2 ? 'More than halfway. Naming the technique fast is the skill interviews test most.' : '';
  }
  boxes.forEach(function (b) {
    b.addEventListener('change', function () { saveChecks(); updateProgress(); });
  });
  loadChecks();

  /* remember how many checkpoints this module has, so the map can show it */
  try { localStorage.setItem('fp-twoptr-total', String(boxes.length)); } catch (e) {}
})();
