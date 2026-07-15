/* Turns a long module page into a step-by-step flow: one short screen at a
   time, with Back / Next, a progress bar, and jump-to-section via the top nav.
   Shared by every module page, loaded after the module's own script. */
(function () {
  var view = document.querySelector('[id^="view-m"]');
  if (!view) return;

  // The later sections are wrapped in a gated ".reveal" (#rest). Open it so
  // its sections can be paginated individually.
  var rest = document.getElementById('rest');
  if (rest) rest.classList.add('open');

  // Each screen is the hero header or a section.
  var steps = Array.prototype.slice.call(view.querySelectorAll('header.hero, section'));
  if (steps.length < 2) return;

  // Hide things that don't belong in a paginated flow.
  view.querySelectorAll('hr.sep').forEach(function (el) { el.style.display = 'none'; });
  var footer = document.querySelector('footer');
  if (footer) footer.style.display = 'none';
  var skip = document.getElementById('skip-story');
  if (skip) { var p = skip.closest('p'); (p || skip).style.display = 'none'; }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var key = 'fp-step-' + (location.pathname.split('/').pop() || 'module');

  var cur = 0;
  try { var saved = parseInt(localStorage.getItem(key), 10); if (!isNaN(saved) && saved >= 0 && saved < steps.length) cur = saved; } catch (e) {}

  // Build the bottom navigation bar.
  document.body.classList.add('has-stepnav');
  var nav = document.createElement('nav');
  nav.className = 'stepnav';
  nav.setAttribute('aria-label', 'Lesson steps');
  nav.innerHTML =
    '<button class="stepbtn back" type="button">← Back</button>' +
    '<div class="stepmeta"><div class="stepcount"></div><div class="stepbar"><span></span></div></div>' +
    '<button class="stepbtn next" type="button">Next →</button>';
  document.body.appendChild(nav);
  var backBtn = nav.querySelector('.back');
  var nextBtn = nav.querySelector('.next');
  var countEl = nav.querySelector('.stepcount');
  var barEl = nav.querySelector('.stepbar span');

  function show(i, scroll) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (el, idx) { el.hidden = idx !== cur; });
    var c = steps[cur];
    if (!reduced) { c.classList.remove('step-in'); void c.offsetWidth; c.classList.add('step-in'); }
    countEl.textContent = 'Step ' + (cur + 1) + ' of ' + steps.length;
    barEl.style.width = Math.round((cur + 1) / steps.length * 100) + '%';
    backBtn.disabled = cur === 0;
    var last = cur === steps.length - 1;
    nextBtn.textContent = last ? '✓ Course map' : 'Next →';
    nextBtn.classList.toggle('finish', last);
    try { localStorage.setItem(key, String(cur)); } catch (e) {}
    if (scroll !== false) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }

  nextBtn.addEventListener('click', function () {
    if (cur === steps.length - 1) {
      var map = document.querySelector('.rail-links a');
      window.location.href = map ? map.getAttribute('href') : '../index.html';
      return;
    }
    show(cur + 1);
  });
  backBtn.addEventListener('click', function () { show(cur - 1); });

  // Which step contains a given id?
  function stepOfId(id) {
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].id === id) return i;
      try { if (steps[i].querySelector('#' + (window.CSS && CSS.escape ? CSS.escape(id) : id))) return i; } catch (e) {}
    }
    return -1;
  }

  // In-page anchors (top nav + inline links) jump to the right step.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var idx = stepOfId(id);
      if (idx >= 0) { e.preventDefault(); show(idx); }
    });
  });

  // The story's "continue" button advances the flow.
  document.querySelectorAll('[id$="-continue"]').forEach(function (b) {
    b.addEventListener('click', function () { show(cur + 1); });
  });

  // Arrow keys, when not typing in a field.
  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && cur < steps.length - 1) show(cur + 1);
    if (e.key === 'ArrowLeft' && cur > 0) show(cur - 1);
  });

  show(cur, false);
})();
