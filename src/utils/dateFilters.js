function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const today = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

export function isToday(date) {
  return normalizeDate(date).getTime() === today().getTime();
}

export function isUpcoming(date) {
  return normalizeDate(date).getTime() > today().getTime();
}

export function isOverdue(date) {
  return normalizeDate(date).getTime() < today().getTime();
}
