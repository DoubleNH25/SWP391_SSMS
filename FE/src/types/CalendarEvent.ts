export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
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

