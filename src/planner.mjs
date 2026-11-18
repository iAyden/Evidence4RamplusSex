function assertWholeNumber(value, minimum, maximum, label) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${label} must be a whole number from ${minimum} to ${maximum}.`);
  }
}

export function planSessions({ startTime, focusMinutes, breakMinutes, sessionCount } = {}) {
  if (typeof startTime !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
    throw new RangeError('Start time must be in HH:MM format.');
  }

  assertWholeNumber(focusMinutes, 1, 180, 'Focus minutes');
  assertWholeNumber(breakMinutes, 0, 60, 'Break minutes');
  assertWholeNumber(sessionCount, 1, 12, 'Session count');

  const [hour, minute] = startTime.split(':').map(Number);
  const startMinutes = hour * 60 + minute;
  const rows = [];
  let cursor = startMinutes;

  for (let session = 1; session <= sessionCount; session += 1) {
    rows.push({ kind: 'focus', session, startMinutes: cursor, endMinutes: cursor + focusMinutes });
    cursor += focusMinutes;

    if (breakMinutes > 0 && session < sessionCount) {
      rows.push({ kind: 'break', session, startMinutes: cursor, endMinutes: cursor + breakMinutes });
      cursor += breakMinutes;
    }
  }

  return { startMinutes, endMinutes: cursor, totalMinutes: cursor - startMinutes, rows };
}
