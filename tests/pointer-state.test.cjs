const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/site.js'), 'utf8');
const pointerSource = source.slice(source.indexOf('// Mouse capability stays established'));

function harness({ fine = true, reduce = false, preference = null } = {}) {
  function events(target = {}) {
    const handlers = new Map();
    target.addEventListener = (name, fn) => {
      if (!handlers.has(name)) handlers.set(name, []);
      handlers.get(name).push(fn);
    };
    target.emit = (name, event = {}) => {
      for (const fn of handlers.get(name) || []) fn({ type: name, ...event });
    };
    return target;
  }
  function element() {
    const classes = new Set();
    return events({
      hidden: true, dataset: {}, attributes: {}, textContent: '',
      style: { setProperty(key, value) { this[key] = value; } },
      classList: { add: (...names) => names.forEach(n => classes.add(n)),
        remove: (...names) => names.forEach(n => classes.delete(n)),
        contains: name => classes.has(name) },
      setAttribute(name, value) { this.attributes[name] = value; },
      closest: () => null,
      animate: () => ({ cancel() {} }),
      querySelector() { return element(); }
    });
  }
  const button = element(), surface = element(), fineMedia = events({ matches: fine });
  const reducedMedia = events({ matches: reduce }), win = events();
  let companion, nextId = 0;
  const frames = new Map(), timers = new Map();
  const document = events({ hidden: false, createElement: element,
    body: { append(el) { companion = el; } }, elementFromPoint: () => surface });
  const context = {
    document, innerWidth: 1200, innerHeight: 800,
    matchMedia: () => fineMedia, reducedMedia,
    localStorage: { getItem: () => preference, setItem: (_, value) => { preference = value; }, removeItem: () => { preference = null; } },
    addEventListener: win.addEventListener,
    requestAnimationFrame: fn => { frames.set(++nextId, fn); return nextId; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: fn => { timers.set(++nextId, fn); return nextId; },
    clearTimeout: id => timers.delete(id), button
  };
  vm.runInNewContext('(() => { const $ = () => button; const reduced = reducedMedia;\n' + pointerSource, context);
  return {
    document, win, fineMedia, button,
    get companion() { return companion; },
    get preference() { return preference; },
    move(x, y) { document.emit('pointermove', { pointerType: 'mouse', clientX: x, clientY: y, target: surface }); },
    clickToggle() { button.emit('click', { pointerType: 'mouse', detail: 1, clientX: 300, clientY: 100, target: button }); },
    tick(time) { const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(time)); },
    settleDecoration() { const batch = [...timers.values()]; timers.clear(); batch.forEach(fn => fn()); },
    visible() { return !!companion?.classList.contains('is-visible'); }
  };
}

// Every page load starts Off, including when an older visit stored On.
for (const preference of [null, 'on', 'off']) {
  const visitor = harness({ preference });
  visitor.move(100, 100);
  visitor.win.emit('focus');
  visitor.win.emit('pageshow');
  assert.equal(visitor.visible(), false, 'A saved setting must never activate the pointer');
  assert.equal(visitor.button.attributes['aria-pressed'], 'false');
  assert.equal(visitor.button.hidden, false, 'The opt-in control remains available');
  assert.equal(visitor.preference, null, 'The legacy preference is cleared');
  visitor.clickToggle();
  assert.equal(visitor.visible(), true, 'Visitors can enable the pointer explicitly');
  assert.equal(visitor.preference, null, 'Opting in does not persist into another visit');
  const reloaded = harness({ preference: visitor.preference });
  reloaded.move(100, 100);
  assert.equal(reloaded.visible(), false, 'Reloading starts with the pointer Off again');
  visitor.clickToggle();
  assert.equal(visitor.visible(), false);
}

function enabledHarness(options) {
  const page = harness(options);
  page.clickToggle();
  return page;
}

// A background capability change must not erase the option or recovery state.
const tab = enabledHarness();
tab.move(100, 100);
tab.document.hidden = true;
tab.fineMedia.matches = false;
tab.fineMedia.emit('change');
tab.document.emit('visibilitychange');
tab.win.emit('blur');
assert.equal(tab.visible(), false);
assert.equal(tab.button.hidden, false);
tab.document.hidden = false;
tab.document.emit('visibilitychange');
tab.win.emit('focus');
assert.equal(tab.visible(), true, 'Returning to the tab restores the companion without a new mousemove');
assert.equal(tab.button.hidden, false);
tab.settleDecoration();
tab.document.emit('scroll');
assert.equal(tab.visible(), true, 'Idle and scrolling preserve the pointer');

// Some browsers deliver focus before making the document visible again.
tab.document.hidden = true;
tab.document.emit('visibilitychange');
tab.win.emit('blur');
tab.win.emit('focus');
assert.equal(tab.visible(), false);
tab.document.hidden = false;
tab.document.emit('visibilitychange');
assert.equal(tab.visible(), true);

// Window focus and back/forward cache recovery preserve the same enabled state.
tab.win.emit('blur');
tab.win.emit('focus');
assert.equal(tab.visible(), true);
tab.win.emit('blur');
tab.win.emit('pageshow');
assert.equal(tab.visible(), true);
tab.clickToggle();
tab.win.emit('blur');
tab.win.emit('focus');
assert.equal(tab.visible(), false, 'Focus recovery must respect an explicit Off preference');
tab.clickToggle();
assert.equal(tab.visible(), true);

// Genuine mouse input works even when the initial capability query says touch-only.
const hybrid = enabledHarness({ fine: false });
assert.equal(hybrid.button.hidden, false);
hybrid.move(100, 100);
assert.equal(hybrid.visible(), true);
hybrid.move(700, 100);
hybrid.tick(16.67);
const x = Number(hybrid.companion.style.transform.match(/translate3d\(([\d.]+)/)[1]);
assert.ok(x > 120 && x < 720, 'Normal motion trails smoothly rather than snapping to the target');
for (let frame = 2; frame <= 80; frame++) hybrid.tick(frame * 16.67);
assert.match(hybrid.companion.style.transform, /translate3d\(720px,122px,0\)/);

// Reduced motion keeps the companion visible and removes the trailing animation.
const reduced = enabledHarness({ reduce: true });
reduced.move(100, 100);
reduced.move(700, 100);
reduced.tick(16.67);
assert.equal(reduced.visible(), true);
assert.match(reduced.companion.style.transform, /translate3d\(720px,122px,0\)/);
console.log('Pointer regression checks passed: always starts off, legacy settings, explicit opt-in, tab return, capability changes, focus, idle, scroll, toggle, trailing, reduced motion.');
