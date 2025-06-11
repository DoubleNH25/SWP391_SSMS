export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay?: boolean;
  extendedProps: {
    calendar:  "Pending" | "Approved" | "Rejected";
    description?: string;
    eventType: "medical" | "vaccination";
    vaccineName?: string;
    exp?: string;
    mfg?: string;
    vaccineType?: string;
    classIds?: [string];
  };
}

export const eventCategories = {
  Pending: { label: "Chờ duyệt", color: "bg-yellow-500", lightColor: "bg-yellow-50", textColor: "text-black-700" },
  Approved: { label: "Đã duyệt", color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-black-800" },
  Rejected: { label: "Từ chối", color: "bg-red-500", lightColor: "bg-red-50", textColor: "text-black-800" },
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
    return toLocalISOString(new Date());
  }
  return toLocalISOString(d);
};

export const customFormatDateOnly = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

// Function specifically for sending date data to backend
// This adds timezone offset to compensate for backend's automatic timezone conversion
export const customFormatDateForBackend = (date: Date | string): string => {
  let d: Date;

  if (typeof date === 'string') {
    // If it's a date-only string (YYYY-MM-DD), create date in local timezone
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      d = new Date(year, month - 1, day); // month is 0-indexed
    } else {
      d = new Date(date);
    }
  } else {
    d = date;
  }

  // Get timezone offset in minutes and convert to milliseconds
  const timezoneOffset = d.getTimezoneOffset() * 60 * 1000;

  // Create new date with timezone offset added to compensate for backend conversion
  // Since getTimezoneOffset() returns positive for UTC-X and negative for UTC+X,
  // we subtract it to add the offset (double negative becomes positive)
  const adjustedDate = new Date(d.getTime() - timezoneOffset);

  // Return standard ISO string (UTC format)
  return adjustedDate.toISOString();
};