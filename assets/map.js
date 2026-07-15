(function () {
  function $(id) { return document.getElementById(id); }

  /* ---------- course map data ---------- */
  var arcs = [
    { tag: 'Arc 0 · Week 1', name: 'Foundations', sub: 'How a computer remembers, and the first structure ever invented.', mods: [
      { n: 'Module 0', t: 'How a computer remembers', born: 'You can\'t ask 10,000 named boxes for "number n". Memory, variables, arrays, O(1) vs O(n), cache.', st: 'live', href: 'modules/module-0.html', checkKey: 'fp-arrays-check', totalKey: 'fp-arrays-total', defTotal: 9 },
      { n: 'Module 1', t: 'Strings', born: 'Text is just an array of characters, so every array trick suddenly works on words.', st: 'live', href: 'modules/module-1.html', checkKey: 'fp-strings-check', totalKey: 'fp-strings-total', defTotal: 6 },
      { n: 'Module 2', t: 'Grids (2D arrays)', born: 'Photos, game boards and marksheets are rows of rows. Locker maths, done twice.', st: 'live', href: 'modules/module-2.html', checkKey: 'fp-grids-check', totalKey: 'fp-grids-total', defTotal: 7 },
      { n: 'Module 3', t: 'Two pointers & sliding window', born: 'Scanning an array twice is often once too many. Two techniques born inside arrays.', st: 'next' }
    ]},
    { tag: 'Arc 1 · Week 2', name: 'Patches for the array\'s pains', sub: 'Each structure here fixes one exact array weakness you watched break.', mods: [
      { n: 'Module 4', t: 'Linked lists', born: 'Inserting at the front shifted 10 million values. What if each value simply held the address of the next?', st: 'lock' },
      { n: 'Module 5', t: 'Stacks', born: 'Undo, the back button, and function calls only ever touch the newest thing. A rule that makes life easier.', st: 'lock' },
      { n: 'Module 6', t: 'Queues', born: 'Waiting lines want the oldest first, but removing from an array\'s front hurts. There\'s a circular trick.', st: 'lock' },
      { n: 'Module 7', t: 'Hash maps & sets', born: '"Which student scored 97?" forced a full search. A genius trick turns the VALUE itself into a locker number.', st: 'lock' }
    ]},
    { tag: 'Arc 2 · Week 3', name: 'Self-reference and order', sub: 'Problems that contain smaller copies of themselves, and the power of sorted data.', mods: [
      { n: 'Module 8', t: 'Recursion', born: 'Some problems are built from smaller versions of themselves. A function that trusts its smaller self.', st: 'lock' },
      { n: 'Module 9', t: 'Sorting', born: 'Sorted data makes a hundred impossible things easy. Why the fast sorts are fast, not just their names.', st: 'lock' },
      { n: 'Module 10', t: 'Binary search', born: 'Halving beats walking, 10,000 lockers found in 14 peeks. But only on sorted rows.', st: 'lock' },
      { n: 'Module 11', t: 'Trees & BSTs', born: 'Sorted arrays search fast but change slowly. Trees do both, if they stay balanced.', st: 'lock' }
    ]},
    { tag: 'Arc 3', name: 'Priority and prefixes', sub: 'Cheap answers to "the biggest?", "starts with…?", and "sum of this range?"', mods: [
      { n: 'Module 12', t: 'Heaps (priority queues)', born: '"Always hand me the biggest" shouldn\'t cost a full re-sort every time.', st: 'lock' },
      { n: 'Module 13', t: 'Tries', born: 'Autocomplete can\'t afford to compare your typing against every word ever.', st: 'lock' },
      { n: 'Module 14', t: 'Prefix sums & Kadane', born: 'A thousand range questions shouldn\'t re-add the same numbers a thousand times.', st: 'lock' }
    ]},
    { tag: 'Arc 4 · Week 4', name: 'Networks', sub: 'Friends-of-friends, maps and the internet don\'t fit in rows or trees.', mods: [
      { n: 'Module 15', t: 'Graphs, BFS & DFS', born: 'Anything can connect to anything. Walking these webs floods outward like water.', st: 'lock' },
      { n: 'Module 16', t: 'Shortest paths & topological order', born: '"Fastest route home" and "what must happen before what".', st: 'lock' },
      { n: 'Module 17', t: 'Union-Find', born: '"Are these two connected?" asked a million times, answered almost instantly.', st: 'lock' }
    ]},
    { tag: 'Arc 5', name: 'Making choices', sub: 'When you must choose, prove your choice, or organize your guessing.', mods: [
      { n: 'Module 18', t: 'Greedy', born: 'Sometimes the locally best choice is provably good enough. Knowing WHEN is the skill.', st: 'lock' },
      { n: 'Module 19', t: 'Backtracking', born: 'When you truly must try everything, try it in an organized, prunable way.', st: 'lock' },
      { n: 'Module 20', t: 'Dynamic programming I', born: 'Stop solving the same subproblem twice. Remembering answers changes everything.', st: 'lock' },
      { n: 'Module 21', t: 'Dynamic programming II', born: 'Turning remembered answers into tables, and the classic patterns interviews love.', st: 'lock' }
    ]},
    { tag: 'Arc 6', name: 'The advanced floor', sub: 'The "final level" topics, each one still just a patch for a pain you\'ll have felt.', mods: [
      { n: 'Module 22', t: 'Segment & Fenwick trees', born: 'Range questions on data that keeps changing under you.', st: 'lock' },
      { n: 'Module 23', t: 'Advanced graphs', born: 'Cheapest possible networks, weak points, and bridges.', st: 'lock' },
      { n: 'Module 24', t: 'Bit manipulation', born: 'Sometimes the fastest data structure is the number itself.', st: 'lock' },
      { n: 'Module 25', t: 'String algorithms', born: 'Finding a needle in a text without re-reading the haystack. KMP and rolling hashes.', st: 'lock' }
    ]},
    { tag: 'Arc 7 · The arena', name: 'Interview arena', sub: 'Everything mixed, under time, out loud, the way interviews actually are.', mods: [
      { n: 'Module 26', t: 'Mock scenarios', born: 'Unseen problems, reasoned data → operations → cost → structure, like today\'s Instagram and Spotify problems, but timed.', st: 'lock' }
    ]}
  ];

  /* ---------- read a module's saved progress ---------- */
  function readProg(m) {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(m.checkKey) || '{}'); } catch (e) {}
    var total = parseInt(localStorage.getItem(m.totalKey) || String(m.defTotal || 0), 10) || (m.defTotal || 0);
    var done = 0;
    Object.keys(saved).forEach(function (k) { if (saved[k]) done++; });
    if (done > total) done = total;
    return { done: done, total: total };
  }

  function renderMap() {
    var el = $('arcs');
    el.innerHTML = arcs.map(function (a) {
      return '<div class="arc"><div class="arc-tag">' + a.tag + '</div><h2>' + a.name + '</h2>' +
        '<div class="arc-sub">' + a.sub + '</div><div class="mods">' +
        a.mods.map(function (m) {
          var chip = m.st === 'live' ? '<span class="st st-live">Live now</span>' :
                     m.st === 'next' ? '<span class="st st-next">Next up</span>' :
                     '<span class="st st-lock">Built when you arrive</span>';
          var enter = '';
          if (m.st === 'live') {
            var pr = readProg(m);
            var prog = pr.total ? '<div class="mprog"><span class="mprog-bar"><span style="width:' +
              Math.round(pr.done / pr.total * 100) + '%"></span></span>' + pr.done + '/' + pr.total + '</div>' : '';
            enter = prog + '<button class="enter" data-href="' + m.href + '">Enter module \u2192</button>';
          } else if (m.st === 'next') {
            enter = '<div class="born" style="margin-top:10px;"><b>Coming next</b>Tell Claude: "' + m.n + ': ' + m.t + '" when you\'re ready.</div>';
          }
          return '<div class="mod ' + m.st + '"><div class="mnum">' + m.n + '</div><h3>' + m.t + '</h3>' +
            '<div class="born"><b>Born because</b>' + m.born + '</div>' + chip + enter + '</div>';
        }).join('') + '</div></div>';
    }).join('');
    el.querySelectorAll('[data-href]').forEach(function (b) {
      b.addEventListener('click', function () { window.location.href = b.dataset.href; });
    });
  }

  /* ---------- overall progress across every live module ---------- */
  function updateStats() {
    var done = 0, total = 0, live = 0;
    arcs.forEach(function (a) {
      a.mods.forEach(function (m) {
        if (m.st === 'live') live++;
        if (m.checkKey) { var p = readProg(m); done += p.done; total += p.total; }
      });
    });
    var pct = total ? Math.round(done / total * 100) : 0;
    if ($('ms-live')) $('ms-live').textContent = live;
    if ($('ms-checks')) $('ms-checks').textContent = done + '/' + total;
    if ($('progress-fill')) $('progress-fill').style.width = pct + '%';
    if ($('progress-num')) $('progress-num').textContent = pct + '%';
  }

  renderMap();
  updateStats();
})();
