# First Principles: a why-first DSA course

> Learn Data Structures and Algorithms by understanding **why each idea was
> invented**, before you ever memorise what it is. Built for a true beginner
> heading into coding interviews.

## ▶ Open the course: **https://faizaniqbal52.github.io/dsa-first-principles/**

That link is the whole thing. Click it, no setup, nothing to install. It opens
on the course map, and you pick a live module to start.

---

## What makes it different

- **Story first, definitions last.** Every topic starts with the real problem
  that forced someone to invent it. You feel the pain before you meet the fix.
- **You do, not just read.** Interactive demos let you watch memory, pointers,
  grids and windows actually move, and quick checkpoints test your understanding
  as you go.
- **A method, not memorisation.** Coding problems are solved with one repeatable
  way of thinking (understand, brute force, find the waste, pseudo-code, then
  code and cost), so you can face problems you have never seen.
- **One connected story.** Each topic points back to the ones before it, so the
  whole subject stays a single thread instead of 27 disconnected lessons.
- **Interview-ready.** Coding solutions are written in **C++**, ramped from easy
  to hard, in the style of real LeetCode-type questions.

## Progress

**Arc 0 (Foundations) is complete.** 4 of 27 modules are fully built; the rest
are on the map and get built at full depth as you arrive at them.

| Module | Topic | Status |
|--------|-------|--------|
| 0 | How a computer remembers (arrays) | Built |
| 1 | Strings | Built |
| 2 | Grids (2D arrays) | Built |
| 3 | Two pointers & sliding window | Built |
| 4 to 26 | Linked lists onward | On the map |

## How every module is taught

1. **The story**: the real problem that existed before this idea, told plainly.
2. **Look inside the machine**: interactive demos of what is actually happening.
3. **Ask "why?"**: nested explanations that go as deep as you want, down to the
   hardware.
4. **Watch it break**: every structure's weaknesses, shown not just stated.
5. **Daily life**: where it hides in photos, video, games, apps, and the web.
6. **Design practice**: real engineering scenarios with Socratic hints that lead
   your thinking instead of handing you the answer.
7. **Code it**: interview-style problems in C++, each solved with the five-step
   method above rather than a memorised answer.
8. **Reflection**: an understanding checklist. Progress is measured by what you
   can explain, not how many problems you grind.

Then the loop repeats on the next topic.

## The full journey: 27 modules, 8 arcs

- **Arc 0 · Foundations**: arrays, strings, grids, two pointers & sliding window
- **Arc 1 · Patches for the array's pains**: linked lists, stacks, queues, hash maps
- **Arc 2 · Self-reference & order**: recursion, sorting, binary search, trees
- **Arc 3 · Priority & prefixes**: heaps, tries, prefix sums
- **Arc 4 · Networks**: graphs (BFS/DFS), shortest paths, union-find
- **Arc 5 · Making choices**: greedy, backtracking, dynamic programming I & II
- **Arc 6 · The advanced floor**: segment/Fenwick trees, advanced graphs, bit
  manipulation, string algorithms
- **Arc 7 · The arena**: mixed, timed, interview-style scenarios

## Project layout

Each module is its own page, so no single file ever gets overwhelming:

```
index.html              the course map (home)
modules/
  module-0.html         Module 0: how a computer remembers (arrays)
  module-1.html         Module 1: strings
  module-2.html         Module 2: grids (2D arrays)
  module-3.html         Module 3: two pointers & sliding window
assets/
  base.css              shared styles for every page
  map.js                renders the course map + progress
  module0.js            per-module interactivity
  module1.js
  module2.js
  module3.js
```

A new module is added as `modules/module-N.html` reusing `assets/base.css`, with
its own small `assets/moduleN.js`. The map in `index.html` links to each one, and
progress is shared through the browser's local storage so the map always shows
how far along you are.

## Built with

Plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies, no
tracking. Works offline, adapts to light and dark mode, and saves your progress
locally in your browser.

<sub>Running it locally? Clone the repo and open `index.html` in any browser.
That is only for development; visitors just use the link above.</sub>
