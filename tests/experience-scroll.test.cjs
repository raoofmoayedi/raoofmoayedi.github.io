const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/site.js', 'utf8');
const block = source.split(' // Close experiences only after')[1].split(' // End experience scroll behavior.')[0];
const card = {open: true, bottom: 400, focused: false,
  getBoundingClientRect() { return {bottom: this.bottom}; },
  querySelector() { return {contains: () => this.focused}; }
};
let listener, frame;
const context = {scrollY: 0, $$: () => [card], document: {activeElement: {}},
  header: {getBoundingClientRect: () => ({bottom: 90})},
  addEventListener: (event, callback) => {listener = callback;},
  requestAnimationFrame: callback => {frame = callback; return 1;}
};
vm.runInNewContext('// Close experiences only after' + block, context);
function scroll(y, bottom) { context.scrollY = y; card.bottom = bottom; listener(); frame(); }
scroll(100, 200);
assert.equal(card.open, true, 'Keep the description open while it is visible');
scroll(250, 80);
assert.equal(card.open, false, 'Close when scrolled below the entire entry');
card.open = true;
scroll(200, 80);
assert.equal(card.open, true, 'Do not collapse on an upward scroll');
card.focused = true;
scroll(300, 80);
assert.equal(card.open, true, 'Do not hide a focused description link');
card.focused = false;
scroll(350, 80);
assert.equal(card.open, false, 'Collapse once the description is no longer focused');
console.log('Experience scroll checks passed: visible reading, offscreen closure, direction and keyboard focus');
