const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const vm = require('node:vm');
const code = readFileSync(join(__dirname, '..', 'game.js'), 'utf8');

function game() {
  const nodes = {};
  const context = vm.createContext({document: {
    getElementById(id) {
      return nodes[id] ??= {innerHTML: '', children: [], append(node) {this.children.push(node);}, focus() {}};
    },
    createElement() {return {};}
  }});
  vm.runInContext(code, context);
  const run = expression => vm.runInContext(expression, context);
  run('start()');
  return {run, nodes, state: () => JSON.parse(run('JSON.stringify(s)'))};
}

test('water is numeric and each choice changes the right resources', () => {
  const g = game();
  g.run('choose(0)');
  assert.deepEqual(g.state().lastChoice.changes, {food: -1, water: -1, spirit: 0, hull: 0, progress: 2});
  assert.equal(g.state().water, 11);
  g.run('start(); s.day = 4; choose(0)');
  assert.equal(g.state().water, 10);
  assert.equal(g.state().food, 11);
  assert.equal(g.state().spirit, 9);
  assert.equal(g.state().hull, 8);
  g.run('start(); s.day = 6; choose(0)');
  assert.equal(g.state().hull, 11);
  assert.equal(g.state().spirit, 7);
  assert.equal(g.state().progress, 0);
});

test('fishing, rain collection, rest, and storm damage have distinct effects', () => {
  const g = game();
  g.run('s.day = 2; choose(0)');
  assert.equal(g.state().food, 15);
  assert.equal(g.state().water, 11);
  assert.equal(g.state().hull, 8);
  g.run('start(); s.day = 3; s.water = 5; choose(2)');
  assert.equal(g.state().water, 9);
  assert.equal(g.state().hull, 7);
  g.run('start(); s.day = 3; choose(1)');
  assert.equal(g.state().hull, 5);
  assert.equal(g.state().spirit, 5);
  assert.equal(g.state().progress, 3);
  g.run('start(); s.day = 4; choose(2)');
  assert.equal(g.state().spirit, 10);
  assert.equal(g.state().progress, 0);
  assert.equal(g.state().day, 5);
});

test('all 18 choices stay finite and bounded, preserve the lesson, and honor their preview', () => {
  const g = game();
  for (let day = 1; day <= 6; day++) for (let choice = 0; choice < 3; choice++) {
    for (const level of [1, 7, 14, 15]) {
      g.run(`start(); s.day = ${day}; s.food = s.water = s.spirit = s.hull = ${level};`);
      const preview = JSON.parse(g.run(`JSON.stringify(outcome(events[${day - 1}].choices[${choice}]))`));
      g.run(`choose(${choice})`);
      const state = g.state();
      for (const resource of ['food', 'water', 'spirit', 'hull']) {
        assert.ok(Number.isFinite(state[resource]));
        assert.ok(state[resource] >= 0 && state[resource] <= 15);
        assert.equal(state[resource], preview.next[resource]);
      }
      assert.deepEqual(state.lastChoice.changes, preview.changes);
      assert.equal(state.progress, preview.next.progress);
      assert.ok(g.nodes.game.innerHTML.includes(state.lastChoice.lesson));
    }
  }
});

test('previews account for the resource cap and the final travel step', () => {
  const g = game();
  g.run('s.day = 2; s.food = 14; s.progress = 18;');
  const result = JSON.parse(g.run('JSON.stringify(outcome(events[1].choices[0]))'));
  assert.equal(result.changes.food, 1);
  assert.equal(result.changes.progress, 1);
  g.run('choose(0)');
  assert.equal(g.state().food, 15);
  assert.equal(g.state().progress, 19);
  assert.equal(g.state().done, 'won');
  g.run('start(); s.day = 2; s.food = 15; render()');
  assert.ok(g.nodes.choices.children.some(button => button.innerHTML?.includes('Food 0')));
});

test('each depleted resource ends the voyage, including water at landfall', () => {
  const g = game();
  for (const [resource, day, choice] of [['food', 1, 0], ['water', 1, 0], ['spirit', 4, 1], ['hull', 6, 1]]) {
    g.run(`start(); s.day = ${day}; s.${resource} = 1; choose(${choice})`);
    assert.equal(g.state().done, 'lost');
    assert.ok(g.state().ending.includes(resource === 'spirit' ? 'crew spirit' : resource));
    const ended = g.state();
    g.run('choose(0)');
    assert.deepEqual(g.state(), ended);
  }
  g.run('start(); s.water = 1; s.progress = 18; choose(0)');
  assert.equal(g.state().done, 'lost');
});

test('a planned voyage can win and a replay resets supplies, travel, and feedback', () => {
  const g = game();
  // Gather food and rain, support the crew, then balance repairs and travel.
  for (const choice of [0, 0, 2, 0, 1, 2, 0, 0, 2, 1, 1, 1]) g.run(`choose(${choice})`);
  assert.equal(g.state().done, 'won');
  assert.equal(g.state().progress, 19);
  for (const resource of ['food', 'water', 'spirit', 'hull']) assert.ok(g.state()[resource] > 0);
  assert.ok(g.nodes.game.innerHTML.includes('aria-valuenow="100"'));
  g.run('start()');
  assert.deepEqual(g.state(), {day: 1, food: 12, water: 12, spirit: 7, hull: 8, progress: 0, lastChoice: null, done: false, ending: ''});
  assert.ok(!g.nodes.game.innerHTML.includes('What this teaches:'));
});
