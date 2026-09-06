export function formatDate(dateInput: string | number | Date): string {
  if (!dateInput) return '';
  const d = new Date(typeof dateInput === 'number' && dateInput < 10000000000 ? dateInput * 1000 : dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateInput: string | number | Date): string {
  if (!dateInput) return '';
  const d = new Date(typeof dateInput === 'number' && dateInput < 10000000000 ? dateInput * 1000 : dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

export function formatTime(dateInput: string | number | Date): string {
  if (!dateInput) return '';
  const d = new Date(typeof dateInput === 'number' && dateInput < 10000000000 ? dateInput * 1000 : dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
