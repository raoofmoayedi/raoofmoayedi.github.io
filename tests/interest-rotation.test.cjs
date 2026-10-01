const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/site.js'), 'utf8');
const interests = source.slice(source.indexOf('// Research interests rotate'), source.indexOf('// Sketches unfold within'));

function harness(reduce = false) {
  function element(extra = {}) {
    const listeners = new Map();
    return {
      dataset: {}, attributes: {}, textContent: '', hidden: false,
      addEventListener(type, fn) { listeners.set(type, [...(listeners.get(type) || []), fn]); },
      emit(type, event = {}) { for (const fn of listeners.get(type) || []) fn({ preventDefault() {}, ...event }); },
      setAttribute(name, value) { this.attributes[name] = value; },
      ...extra
    };
  }
  const buttons = Array.from({ length: 8 }, (_, i) => element({ dataset: { landscape: `topic-${i}`, label: `Topic ${i}`, description: `Description ${i}` } }));
  const images = buttons.map((_, i) => element({ dataset: { sketch: `topic-${i}` }, hidden: i !== 0 }));
  const label = element(), toggle = element({ querySelector: () => label });
  const gallery = element({ contains: target => [toggle, ...buttons].includes(target) });
  const reduced = element({ matches: reduce }), document = element({ hidden: false });
  const nodes = {
    '#interests': gallery, '.interest-stage': element(), '.interest-rotation': toggle,
    '#interest-title': element({ textContent: 'Topic 0' }), '#art-description': element({ textContent: 'Description 0' }),
    '#interest-count': element({ textContent: '01 / 08' }), '#interest-status': element()
  };
  let now = 0, nextId = 0, observer;
  const timers = new Map();
  const context = {
    document, reduced, window: { IntersectionObserver: true },
    $: selector => nodes[selector], $$: selector => selector === '[data-landscape]' ? buttons : images,
    setTimeout: (fn, delay) => { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} }
  };
  vm.runInNewContext(`(() => { ${interests} })()`, context);
  return {
    buttons, images, gallery, reduced, document, toggle, nodes,
    view(visible) { observer([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]); },
    advance(ms) {
      const end = now + ms;
      while (timers.size) {
        const [id, timer] = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
        if (timer.at > end) break;
        now = timer.at; timers.delete(id); timer.fn();
      }
      now = end;
      assert.ok(timers.size <= 1, 'Only one rotation timer can be active');
    },
    topic() { return nodes['#interest-title'].textContent; }
  };
}

const h = harness();
h.advance(60000);
assert.equal(h.topic(), 'Topic 0', 'Offscreen interests do not advance');
h.view(true); h.advance(9999);
assert.equal(h.topic(), 'Topic 0');
h.advance(1);
assert.equal(h.topic(), 'Topic 1', 'The first change occurs after ten seconds');
assert.equal(h.nodes['#art-description'].textContent, 'Description 1');
assert.equal(h.nodes['#interest-count'].textContent, '02 / 08');
assert.equal(h.images.filter(image => !image.hidden).length, 1);
assert.equal(h.images[1].hidden, false);
assert.equal(h.nodes['#interest-status'].textContent, '', 'Automatic changes are not announced');

h.gallery.emit('pointerenter', { pointerType: 'mouse' }); h.advance(30000);
assert.equal(h.topic(), 'Topic 1', 'Hovering gives visitors time to read');
h.gallery.emit('pointerleave', { pointerType: 'mouse' }); h.advance(10000);
assert.equal(h.topic(), 'Topic 2');
h.gallery.emit('focusin', { target: h.buttons[2] }); h.advance(30000);
assert.equal(h.topic(), 'Topic 2', 'Keyboard interaction pauses changes');
h.buttons[7].emit('click');
assert.equal(h.topic(), 'Topic 7');
assert.match(h.nodes['#interest-status'].textContent, /Topic 7/);
h.gallery.emit('focusout', { relatedTarget: null }); h.advance(10000);
assert.equal(h.topic(), 'Topic 0', 'Rotation continues from the manually selected interest and wraps');

h.document.hidden = true; h.document.emit('visibilitychange'); h.advance(90000);
assert.equal(h.topic(), 'Topic 0', 'Background tabs do not advance');
h.document.hidden = false; h.document.emit('visibilitychange'); h.advance(10000);
assert.equal(h.topic(), 'Topic 1');
h.toggle.emit('click'); h.advance(30000);
assert.equal(h.topic(), 'Topic 1', 'The Pause control persists across timer ticks');
assert.equal(h.toggle.dataset.playing, 'false');
h.toggle.emit('click'); h.advance(10000);
assert.equal(h.topic(), 'Topic 2');
h.view(false); h.advance(30000);
assert.equal(h.topic(), 'Topic 2');
h.view(true); h.advance(10000);
assert.equal(h.topic(), 'Topic 3');

const calm = harness(true);
calm.view(true); calm.advance(30000);
assert.equal(calm.topic(), 'Topic 0', 'Reduced motion starts with automatic changes disabled');
calm.toggle.emit('click'); calm.advance(10000);
assert.equal(calm.topic(), 'Topic 1', 'Explicit Play still works with reduced motion');
console.log('Interest rotation checks passed: timing, synchronized content, hover/focus, manual choices, pause, visibility, wrapping, and reduced motion.');
