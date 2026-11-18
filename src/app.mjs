import { planSessions } from './planner.mjs';

const form = document.querySelector('#plan-form');
const errorMessage = document.querySelector('#plan-error');
const planStatus = document.querySelector('#plan-status');
const planResults = document.querySelector('#plan-results');
const finishTime = document.querySelector('#finish-time');
const totalTime = document.querySelector('#total-time');
const focusTime = document.querySelector('#focus-time');
const scheduleRows = document.querySelector('#schedule-rows');

function clockTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function timeLabel(minutes) {
  const daysLater = Math.floor(minutes / 1440);
  const time = clockTime(minutes);

  if (daysLater === 0) return time;
  if (daysLater === 1) return `${time} (+1 day)`;
  return `${time} (+${daysLater} days)`;
}

function durationLabel(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} h`;
  return `${hours} h ${remainder} min`;
}

function renderRow({ kind, session, startMinutes, endMinutes }) {
  const item = document.createElement('li');
  item.className = `timeline-row timeline-row--${kind}`;

  const block = document.createElement('div');
  const title = document.createElement('p');
  title.className = 'block-title';
  title.textContent = kind === 'focus' ? `Focus session ${session}` : 'Break';

  const range = document.createElement('p');
  range.className = 'block-range';
  range.textContent = `${timeLabel(startMinutes)} – ${timeLabel(endMinutes)}`;
  block.append(title, range);

  const duration = document.createElement('span');
  duration.className = 'block-duration';
  duration.textContent = durationLabel(endMinutes - startMinutes);
  item.append(block, duration);

  return item;
}

function updateSchedule() {
  const { elements } = form;
  const input = {
    startTime: elements.startTime.value,
    focusMinutes: elements.focusMinutes.valueAsNumber,
    breakMinutes: elements.breakMinutes.valueAsNumber,
    sessionCount: elements.sessionCount.valueAsNumber,
  };

  let plan;

  try {
    plan = planSessions(input);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    errorMessage.hidden = false;
    errorMessage.textContent = error.message;
    return;
  }

  errorMessage.hidden = true;
  errorMessage.textContent = '';
  finishTime.textContent = timeLabel(plan.endMinutes);
  totalTime.textContent = durationLabel(plan.totalMinutes);
  focusTime.textContent = durationLabel(input.focusMinutes * input.sessionCount);
  scheduleRows.replaceChildren(...plan.rows.map(renderRow));
  planResults.hidden = false;
  planStatus.textContent = `Schedule has ${plan.rows.length} blocks and ends at ${timeLabel(plan.endMinutes)}.`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateSchedule();
});

updateSchedule();
