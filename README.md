# First Principles: a why-first DSA course

An interactive course that teaches Data Structures and Algorithms the way you
actually build deep understanding: **why an idea was invented before what it is.**
No definitions dropped on you cold, no "solve 500 problems and hope it clicks."

Coding questions come *last*, after you understand the problem the structure
was born to solve.

**Live page:** open `index.html` in any browser (or enable GitHub Pages to host it).
It opens on the course map; click a live module to open its own page.

## Project layout

Each module is its own page, so no single file gets overwhelming:

```
index.html              the course map (home)
modules/
  module-0.html         Module 0: how a computer remembers (arrays)
assets/
  base.css              shared styles for every page
  map.js                renders the course map + progress
  module0.js            Module 0 interactivity
```

New modules are added as `modules/module-N.html` reusing `assets/base.css`, with
their own small `assets/moduleN.js`. The map in `index.html` links to each one.
Progress is shared through the browser's local storage, so the map always shows
how far you are.

## How every module is taught

1. **The story**: the real problem that existed before this idea, told plainly.
2. **Look inside the machine**: interactive demos of what memory actually does.
3. **Ask "why?"**: nested explanations that go as deep as you want, down to how
   the hardware works.
4. **Watch it break**: every structure's weaknesses, shown not just stated.
5. **Daily life**: where it hides in photos, video, Spotify, Instagram, AI.
6. **Design practice**: real engineering scenarios with Socratic hints that lead
   your thinking instead of handing you the answer.
7. **Code it**: interview-style (LeetCode) problems, ramped easy to hard, each
   taught with one repeatable thinking method rather than a memorized answer:
   understand, brute force, find the waste, pseudo-code, then code and cost.
8. **Reflection**: an understanding checklist; progress is measured by what you
   can explain, not how many problems you solved.

Then the loop repeats on the next topic, and every new topic points back at the
ones you already know, so the whole subject stays one connected story.

## The journey: 27 modules, 8 arcs

- **Arc 0 · Foundations**: memory & arrays, strings, grids, two pointers
- **Arc 1 · Patches for the array's pains**: linked lists, stacks, queues, hash maps
- **Arc 2 · Self-reference & order**: recursion, sorting, binary search, trees
- **Arc 3 · Priority & prefixes**: heaps, tries, prefix sums
- **Arc 4 · Networks**: graphs (BFS/DFS), shortest paths, union-find
- **Arc 5 · Making choices**: greedy, backtracking, dynamic programming I & II
- **Arc 6 · The advanced floor**: segment/Fenwick trees, advanced graphs, bit
  manipulation, string algorithms
- **Arc 7 · The arena**: mixed, timed, interview-style scenarios

**Module 0 (memory & arrays) is fully built.** The rest are on the map and get
built at full depth as the learner arrives at each one.

## Built with

Plain HTML, CSS, and vanilla JavaScript, no build step, no dependencies. Works
offline, adapts to light and dark mode, saves your progress locally in the browser.
