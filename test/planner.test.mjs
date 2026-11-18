import assert from 'node:assert/strict';
import test from 'node:test';
import { planSessions } from '../src/planner.mjs';

const standardInputs = {
  startTime: '09:30',
  focusMinutes: 25,
  breakMinutes: 5,
  sessionCount: 3,
};

test('alternates focus and break periods in chronological order', () => {
  assert.deepEqual(planSessions(standardInputs), {
    startMinutes: 570,
    endMinutes: 655,
    totalMinutes: 85,
    rows: [
      { kind: 'focus', session: 1, startMinutes: 570, endMinutes: 595 },
      { kind: 'break', session: 1, startMinutes: 595, endMinutes: 600 },
      { kind: 'focus', session: 2, startMinutes: 600, endMinutes: 625 },
      { kind: 'break', session: 2, startMinutes: 625, endMinutes: 630 },
      { kind: 'focus', session: 3, startMinutes: 630, endMinutes: 655 },
    ],
  });
});

test('omits a trailing break when there is only one focus session', () => {
  assert.deepEqual(
    planSessions({ ...standardInputs, startTime: '00:00', focusMinutes: 1, sessionCount: 1 }),
    {
      startMinutes: 0,
      endMinutes: 1,
      totalMinutes: 1,
      rows: [{ kind: 'focus', session: 1, startMinutes: 0, endMinutes: 1 }],
    },
  );
});

test('places focus sessions back to back when break minutes is zero', () => {
  assert.deepEqual(planSessions({ ...standardInputs, breakMinutes: 0 }), {
    startMinutes: 570,
    endMinutes: 645,
    totalMinutes: 75,
    rows: [
      { kind: 'focus', session: 1, startMinutes: 570, endMinutes: 595 },
      { kind: 'focus', session: 2, startMinutes: 595, endMinutes: 620 },
      { kind: 'focus', session: 3, startMinutes: 620, endMinutes: 645 },
    ],
  });
});

test('uses increasing absolute minutes when a session crosses midnight', () => {
  assert.deepEqual(planSessions({ ...standardInputs, startTime: '23:50', sessionCount: 2 }), {
    startMinutes: 1430,
    endMinutes: 1485,
    totalMinutes: 55,
    rows: [
      { kind: 'focus', session: 1, startMinutes: 1430, endMinutes: 1455 },
      { kind: 'break', session: 1, startMinutes: 1455, endMinutes: 1460 },
      { kind: 'focus', session: 2, startMinutes: 1460, endMinutes: 1485 },
    ],
  });
});

test('accepts the maximum focus duration, break duration and session count together', () => {
  const plan = planSessions({
    startTime: '23:59',
    focusMinutes: 180,
    breakMinutes: 60,
    sessionCount: 12,
  });

  assert.equal(plan.startMinutes, 1439);
  assert.equal(plan.totalMinutes, 2820);
  assert.equal(plan.endMinutes, 4259);
  assert.equal(plan.rows.filter(({ kind }) => kind === 'focus').length, 12);
  assert.equal(plan.rows.filter(({ kind }) => kind === 'break').length, 11);
  assert.deepEqual(plan.rows.at(-1), {
    kind: 'focus',
    session: 12,
    startMinutes: 4079,
    endMinutes: 4259,
  });
});

test('rejects times outside the 24-hour clock and malformed HH:MM input', () => {
  for (const startTime of ['24:00', '09:60', '9:30', '09:3', '09:30:00', ' 09:30', '', null]) {
    assert.throws(
      () => planSessions({ ...standardInputs, startTime }),
      { name: 'RangeError', message: /start time/i },
      `Expected to reject ${JSON.stringify(startTime)}`,
    );
  }
});

test('rejects focus durations outside the allowed integer range', () => {
  for (const focusMinutes of [0, 181, 1.5, '25', NaN]) {
    assert.throws(
      () => planSessions({ ...standardInputs, focusMinutes }),
      { name: 'RangeError', message: /focus minutes/i },
      `Expected to reject ${focusMinutes}`,
    );
  }
});

test('rejects break durations outside the allowed integer range', () => {
  for (const breakMinutes of [-1, 61, 2.5, '5', Infinity]) {
    assert.throws(
      () => planSessions({ ...standardInputs, breakMinutes }),
      { name: 'RangeError', message: /break minutes/i },
      `Expected to reject ${breakMinutes}`,
    );
  }
});

test('rejects session counts outside the allowed integer range', () => {
  for (const sessionCount of [0, 13, 2.5, '3', undefined]) {
    assert.throws(
      () => planSessions({ ...standardInputs, sessionCount }),
      { name: 'RangeError', message: /session count/i },
      `Expected to reject ${sessionCount}`,
    );
  }
});

test('reports a consistent error when planner settings are missing or not an object', () => {
  for (const settings of [undefined, null, false, '09:30', []]) {
    assert.throws(() => planSessions(settings), {
      name: 'TypeError',
      message: 'Planner settings must be an object.',
    });
  }
});
