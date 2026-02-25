export function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function parseTimeInput(value: string): number {
  // Accept formats like: "1h 30m", "90m", "1.5h", "90", "1h", "30m"
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return 0;

  // Pure number -> assume minutes
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);

  // hours + minutes: "1h 30m" or "1h30m"
  const hm = trimmed.match(/(\d+(?:\.\d+)?)h\s*(?:(\d+)m?)?/);
  if (hm) {
    const h = parseFloat(hm[1]);
    const m = hm[2] ? parseInt(hm[2], 10) : 0;
    return Math.round(h * 60) + m;
  }

  // minutes only: "30m"
  const mOnly = trimmed.match(/(\d+)m/);
  if (mOnly) return parseInt(mOnly[1], 10);

  return 0;
}

export function formatDateForInput(date: string | undefined): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
