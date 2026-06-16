export function isDueSoon(dateStr) {
  if (!dateStr) return false;

  const now = new Date();
  const due = new Date(dateStr);
  const diff = (due - now) / (1000 * 60 * 60 * 24);
  return diff <= 7;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
}
