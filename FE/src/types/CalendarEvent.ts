export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay?: boolean;
  extendedProps: {
    calendar: "pending" | "approve" | "cancel";
    description?: string;
    eventType: "medical" | "vaccination";
    vaccineName?: string;
    exp?: string;
    mfg?: string;
    vaccineType?: string;
  };
}

export const eventCategories = {
  pending: { label: "Pending", color: "bg-yellow-500", lightColor: "bg-yellow-50", textColor: "text-yellow-700" },
  approve: { label: "Approve", color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-green-700" },
  cancel: { label: "Cancel", color: "bg-red-500", lightColor: "bg-red-50", textColor: "text-red-700" },
};

export function toLocalISOString(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHours}:${offsetMinutes}`;
}

export const customFormatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return new Date().toISOString();
  }
  return d.toISOString();
};

export const customFormatDateOnly = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const customFormatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return "00:00";
  }
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};