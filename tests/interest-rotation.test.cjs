const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/site.js'), 'utf8');
const interests = source.slice(source.indexOf('// Research interests advance'), source.indexOf('// Sketches unfold within'));

function harness() {
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
  const gallery = element(), document = element({ hidden: false });
  const nodes = {
    '#interests': gallery, '.interest-stage': element(),
    '#interest-title': element({ textContent: 'Topic 0' }), '#art-description': element({ textContent: 'Description 0' }),
    '#interest-count': element({ textContent: '01 / 08' }), '#interest-status': element()
  };
  let now = 0, nextId = 0, observer;
  const timers = new Map();
  const context = {
    document, window: { IntersectionObserver: true },
    $: selector => nodes[selector], $$: selector => selector === '[data-landscape]' ? buttons : images,
    setTimeout: (fn, delay) => { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} }
  };
  vm.runInNewContext(`(() => { ${interests} })()`, context);
  return {
    buttons, images, gallery, document, nodes,
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
h.view(true); h.advance(14999);
assert.equal(h.topic(), 'Topic 0');
h.advance(1);
assert.equal(h.topic(), 'Topic 1', 'The first automatic change occurs after fifteen seconds');
assert.equal(h.nodes['#art-description'].textContent, 'Description 1');
assert.equal(h.nodes['#interest-count'].textContent, '02 / 08');
assert.equal(h.images.filter(image => !image.hidden).length, 1);
assert.equal(h.images[1].hidden, false);
assert.equal(h.nodes['#interest-status'].textContent, '', 'Automatic changes are not announced');

h.gallery.emit('pointerenter', { pointerType: 'mouse' }); h.advance(15000);
assert.equal(h.topic(), 'Topic 2', 'Resting the pointer on the panel does not stop automatic changes');
h.gallery.emit('focusin', { target: h.buttons[2] }); h.advance(15000);
assert.equal(h.topic(), 'Topic 3', 'Focus does not leave rotation permanently stopped');
h.buttons[7].emit('click');
assert.equal(h.topic(), 'Topic 7');
assert.match(h.nodes['#interest-status'].textContent, /Topic 7/);
h.advance(14999);
assert.equal(h.topic(), 'Topic 7', 'Manual selection starts a full new fifteen-second interval');
h.advance(1);
assert.equal(h.topic(), 'Topic 0', 'Rotation continues from the chosen interest and wraps');
h.advance(120000);
assert.equal(h.topic(), 'Topic 0', 'A full cycle visits all eight interests');

h.document.hidden = true; h.document.emit('visibilitychange'); h.advance(90000);
assert.equal(h.topic(), 'Topic 0', 'Background tabs do not advance');
h.document.hidden = false; h.document.emit('visibilitychange'); h.advance(15000);
assert.equal(h.topic(), 'Topic 1');
h.view(false); h.advance(30000);
assert.equal(h.topic(), 'Topic 1');
h.view(true); h.advance(15000);
assert.equal(h.topic(), 'Topic 2');

const homepage = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert.match(homepage, /<title>Raoof Zare Moayedi<\/title>/);
assert.ok(!homepage.includes('class="interest-rotation"'), 'No Play/Pause control is rendered');
assert.ok(!homepage.includes('Machine learning researcher'), 'The generic introductory label is removed');
console.log('Interest checks passed: fifteen-second timing, continuous rotation, manual selection, wrapping, visibility, synchronized content, no controls, and the personal page title.');
