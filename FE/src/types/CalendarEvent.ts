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
