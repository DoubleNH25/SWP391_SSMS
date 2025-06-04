import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal } from "@/components/ui/modal/index";
import DatePicker from "@/components/ui/form/DateField";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel, VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { CalendarEvent, customFormatDate, customFormatDateOnly, customFormatTime, eventCategories, toLocalISOString } from "@/types/CalendarEvent";
import { Tooltip } from "@material-tailwind/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FecthCreateMedicalEvent, FecthDeleteMedicalEvents, FecthMedicalEvent, FecthUpdateMedicalEvent } from '@/services/MedicalEventService';
import { FecthCreateVaccinationCampaign, FecthDeleteVaccinationCampaign, FecthUpdateVaccinationCampaign, FecthVaccinationCampaign } from '@/services/VaccinationCampaignService';
import { Option } from '@/components/ui/form/Select';

type FormData =
  | { type: "medical"; data: MedicalEventUpdateCreateViewModel }
  | { type: "vaccination"; data: VaccinationCampaignsUpdateCreateViewModel };

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(customFormatDateOnly(new Date()));
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    type: "medical",
    data: { name: "", description: "", scheduledDate: "" },
  });
  const [viewEventsDate, setViewEventsDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [medicalEventsRaw, vaccinationCampaignsRaw] = await Promise.all([
        FecthMedicalEvent(),
        FecthVaccinationCampaign(),
      ]);

      const medicalEvents: CalendarEvent[] = (Array.isArray(medicalEventsRaw) ? medicalEventsRaw : []).map(
        (event: MedicalEventViewModel) => ({
          id: event.id ?? "",
          title: event.name ?? "",
          start: customFormatDate(event.scheduledDate || new Date()),
          allDay: false,
          extendedProps: {
            calendar: event.isAccepted ? "approve" : "pending",
            description: event.description || "",
            eventType: "medical",
          },
        })
      );

      const vaccinationEvents: CalendarEvent[] = (Array.isArray(vaccinationCampaignsRaw) ? vaccinationCampaignsRaw : []).map(
        (event: VaccinationCampaignsViewModel) => ({
          id: event.id ?? "",
          title: event.name ?? "",
          start: customFormatDate(event.startDate || new Date()),
          allDay: false,
          extendedProps: {
            calendar: event.isAccepted ? "approve" : "pending",
            vaccineType: event.vaccineType || "",
            exp: customFormatDate(event.exp || new Date()),
            mfg: customFormatDate(event.mfg || new Date()),
            vaccineName: event.vaccineName || "",
            eventType: "vaccination",
          },
        })
      );
      setEvents([...medicalEvents, ...vaccinationEvents]);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage.includes('authenticated')
        ? 'Please log in to view events.'
        : 'Failed to fetch events. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setViewEventsDate(null);
    setSelectedEvent(null);
    setFormData({
      type: "medical",
      data: { name: "", description: "", scheduledDate: "" },
    });
  }, []);

  const handleDateSelect = useCallback(
    (date: string) => {
      const selected = new Date(date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selected < currentDate) {
        toast.error("Cannot create events in the past!");
        return;
      }

      setSelectedDate(customFormatDateOnly(date));
      setFormData((prev) => {
        selected.setHours(9, 0);
        if (prev.type === "medical") {
          return {
            type: "medical",
            data: {
              ...prev.data,
              scheduledDate: selected.toISOString(),
            } as MedicalEventUpdateCreateViewModel,
          };
        } else {
          return {
            type: "vaccination",
            data: {
              ...prev.data,
              startDate: selected.toISOString(),
            } as VaccinationCampaignsUpdateCreateViewModel,
          };
        }
      });
    },
    []
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      const eventDate = new Date(event.start);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (eventDate < currentDate) {
        toast.error("Cannot edit past events");
        return;
      }

      if (event.extendedProps.calendar !== "pending") {
        toast.error("Cannot update or delete this event");
        return;
      }

      setSelectedEvent(event);
      setFormData(
        event.extendedProps.eventType === "medical"
          ? {
            type: "medical",
            data: {
              name: event.title,
              description: event.extendedProps.description || "",
              scheduledDate: new Date(event.start).toISOString(),
            },
          } : {
            type: "vaccination",
            data: {
              name: event.title,
              vaccineName: event.extendedProps.vaccineName || "",
              vaccineType: event.extendedProps.vaccineType || "",
              exp: new Date(event.extendedProps.exp || new Date()).toISOString(),
              mfg: new Date(event.extendedProps.mfg || new Date()).toISOString(),
              startDate: new Date(event.start).toISOString(),
            },
          }
      );
      openModal();
    },
    [openModal]
  );

  const handleMedicalInputChange = useCallback((field: keyof MedicalEventUpdateCreateViewModel, value: any) => {
    setFormData((prev) => {
      if (prev.type === "medical") {
        return {
          ...prev,
          data: {
            ...prev.data,
            [field]: value,
          } as MedicalEventUpdateCreateViewModel,
        };
      }
      return prev;
    });
  }, []);

  const handleVaccinationInputChange = useCallback((field: keyof VaccinationCampaignsUpdateCreateViewModel, value: any) => {
    setFormData((prev) => {
      if (prev.type === "vaccination") {
        return {
          ...prev,
          data: {
            ...prev.data,
            [field]: value,
          } as VaccinationCampaignsUpdateCreateViewModel,
        };
      }
      return prev;
    });
  }, []);

  function prepareMedicalData(data: MedicalEventUpdateCreateViewModel): MedicalEventUpdateCreateViewModel {
    return {
      ...data,
      scheduledDate: toLocalISOString(data.scheduledDate)
    };
  }

  function prepareVaccinationCampaignData(data: VaccinationCampaignsUpdateCreateViewModel): VaccinationCampaignsUpdateCreateViewModel {
    return {
      ...data,
      exp: toLocalISOString(data.exp),
      mfg: toLocalISOString(data.mfg),
      startDate: toLocalISOString(data.startDate)
    };
  }

  const handleAddOrUpdateEvent = useCallback(async () => {
    if (loading) return;
    const { type, data } = formData;

    if (type === "medical" && !data.name.trim()) {
      toast.error("Event name is required!");
      return;
    }
    if (type === "vaccination" && (!data.name.trim() || !data.vaccineName?.trim() || !data.vaccineType?.trim())) {
      toast.error("Campaign name, vaccine name, and vaccine type are required!");
      return;
    }

    if (!selectedEvent) {
      const eventDate = type === "medical" ? new Date(data.scheduledDate) : new Date(data.startDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (eventDate < currentDate) {
        toast.error("Cannot create events in the past!");
        return;
      }
    }

    setLoading(true);
    try {
      if (selectedEvent) {
        if (type === "medical") {
          const payload = prepareMedicalData(data);
          const success = await FecthUpdateMedicalEvent(selectedEvent.id, payload);
          if (success) {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === selectedEvent.id
                  ? {
                    ...event,
                    title: data.name,
                    start: customFormatDate(data.scheduledDate),
                    allDay: false,
                    extendedProps: {
                      ...event.extendedProps,
                      description: data.description || "",
                      calendar: "pending",
                    },
                  }
                  : event
              )
            );
            toast.success('Medical event updated successfully');
          }
        } else {
          const payload = prepareVaccinationCampaignData(data);
          const success = await FecthUpdateVaccinationCampaign(selectedEvent.id, payload);
          if (success) {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === selectedEvent.id
                  ? {
                    ...event,
                    title: data.name,
                    start: customFormatDate(data.startDate),
                    allDay: false,
                    extendedProps: {
                      ...event.extendedProps,
                      vaccineName: data.vaccineName || "",
                      vaccineType: data.vaccineType || "",
                      exp: customFormatDate(data.exp),
                      mfg: customFormatDate(data.mfg),
                      calendar: "pending",
                    },
                  }
                  : event
              )
            );
            toast.success('Vaccination campaign updated successfully');
          }
        }
      } else {
        if (type === "medical") {
          const payload = prepareMedicalData(data);
          const response = await FecthCreateMedicalEvent(payload);
          setEvents((prev) => [
            ...prev,
            {
              id: response.id ?? "",
              title: response.name ?? "",
              start: customFormatDate(response.scheduledDate || new Date()),
              allDay: false,
              extendedProps: {
                calendar: "pending",
                description: response.description || "",
                eventType: "medical",
              },
            },
          ]);
          toast.success('Medical event created successfully');
        } else {
          const payload = prepareVaccinationCampaignData(data);
          const response = await FecthCreateVaccinationCampaign(payload);
          setEvents((prev) => [
            ...prev,
            {
              id: response.id ?? "",
              title: response.name ?? "",
              start: customFormatDate(response.startDate || new Date()),
              allDay: false,
              extendedProps: {
                calendar: "pending",
                vaccineName: response.vaccineName || "",
                vaccineType: response.vaccineType || "",
                exp: customFormatDate(response.exp || new Date()),
                mfg: customFormatDate(response.mfg || new Date()),
                eventType: "vaccination",
              },
            },
          ]);
          toast.success('Vaccination campaign created successfully');
        }
      }
      closeModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to save the event: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [formData, selectedEvent, closeModal, loading]);

  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent || selectedEvent.extendedProps.calendar !== "pending") {
      toast.error("Cannot delete this event");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const success = selectedEvent.extendedProps.eventType === "medical"
        ? await FecthDeleteMedicalEvents(selectedEvent.id)
        : await FecthDeleteVaccinationCampaign(selectedEvent.id);
      if (success) {
        setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
        toast.success('Event deleted successfully');
      }
      closeModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`Failed to delete the event: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [selectedEvent, closeModal, loading]);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = Array(firstDay.getDay()).fill(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, []);

  const getEventsForDate = useCallback(
    (date: Date) => {
      const dateStr = customFormatDateOnly(date);
      return events.filter((event) => customFormatDateOnly(new Date(event.start)) === dateStr);
    },
    [events]
  );

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const MedicalEventForm = useMemo(() => {
    const medicalData = formData.type === "medical" ? formData.data as MedicalEventUpdateCreateViewModel : null;
    if (!medicalData) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Event Name *</Label>
          <Input
            type="text"
            value={medicalData.name || ""}
            onChange={(e) => handleMedicalInputChange("name", e.target.value)}
            placeholder="Enter event name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Description</Label>
          <textarea
            value={medicalData.description || ""}
            onChange={(e) => handleMedicalInputChange("description", e.target.value)}
            placeholder="Add event description (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker-medical"
            label="Scheduled Date"
            defaultDate={medicalData.scheduledDate || new Date()}
            onChange={(date) => handleMedicalInputChange("scheduledDate", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
        </div>
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Scheduled Time</Label>
          <Input
            type="time"
            value={customFormatTime(medicalData.scheduledDate)}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              const newDate = new Date(medicalData.scheduledDate);
              newDate.setHours(hours, minutes);
              handleMedicalInputChange("scheduledDate", newDate);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }, [formData, handleMedicalInputChange, selectedEvent]);

  const VaccinationCampaignForm = useMemo(() => {
    const vaccinationData = formData.type === "vaccination" ? formData.data as VaccinationCampaignsUpdateCreateViewModel : null;
    if (!vaccinationData) return null;

    return (
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Campaign Name *</Label>
          <Input
            type="text"
            value={vaccinationData.name || ""}
            onChange={(e) => handleVaccinationInputChange("name", e.target.value)}
            placeholder="Enter campaign name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Vaccine Name *</Label>
          <Input
            type="text"
            value={vaccinationData.vaccineName || ""}
            onChange={(e) => handleVaccinationInputChange("vaccineName", e.target.value)}
            placeholder="Enter vaccine name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Vaccine Type *</Label>
          <Input
            type="text"
            value={vaccinationData.vaccineType || ""}
            onChange={(e) => handleVaccinationInputChange("vaccineType", e.target.value)}
            placeholder="Enter vaccine type"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker-mfg"
            label="Manufacturing Date"
            defaultDate={vaccinationData.mfg || new Date()}
            onChange={(date) => handleVaccinationInputChange("mfg", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="1900-01-01"
            maxDate="today"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker-exp"
            label="Expiration Date"
            defaultDate={vaccinationData.exp || new Date()}
            onChange={(date) => handleVaccinationInputChange("exp", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker-start"
            label="Start Date"
            defaultDate={vaccinationData.startDate || new Date()}
            onChange={(date) => handleVaccinationInputChange("startDate", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
        </div>
        <div>
          <Label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</Label>
          <Input
            type="time"
            value={customFormatTime(vaccinationData.startDate)}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              const newDate = new Date(vaccinationData.startDate);
              newDate.setHours(hours, minutes);
              handleVaccinationInputChange("startDate", newDate);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }, [formData, handleVaccinationInputChange, selectedEvent]);

  const ViewEventsModal = useMemo(() => {
    if (!viewEventsDate) return null;
    const eventsForDate = getEventsForDate(new Date(viewEventsDate)).sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule for {new Date(viewEventsDate).toLocaleDateString()}</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {eventsForDate.length > 0 ? (
            eventsForDate.map((event) => {
              const category = eventCategories[event.extendedProps.calendar];
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium text-base">{event.title}</div>
                    <div>
                      <span className="text-sm">Type: {event.extendedProps.eventType}</span>
                    </div>
                  </div>
                  <div className="text-sm ml-2">
                    {event.extendedProps.eventType === "medical"
                      ? event.extendedProps.description || "No description"
                      : `Vaccine: ${event.extendedProps.vaccineName || "No vaccine name"}`}
                  </div>
                  {event.extendedProps.eventType === "vaccination" && (
                    <div className="text-sm mt-1 ml-2">
                      <div className="mt-1">Type: {event.extendedProps.vaccineType}</div>
                      <div className="mt-1">Mfg: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                      <div className="mt-1">Exp: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
                    </div>
                  )}
                  <div className="text-sm mt-1 ml-2">
                    <span>Time:</span> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-sm">No events scheduled for this date.</div>
          )}
        </div>
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              const viewDate = new Date(viewEventsDate);
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);
              if (viewDate < currentDate) {
                toast.error("Cannot create events in the past!");
                return;
              }
              setFormData((prev) => {
                const newDate = new Date(viewEventsDate);
                newDate.setHours(9, 0);
                if (prev.type === "medical") {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      scheduledDate: newDate.toISOString(),
                    } as MedicalEventUpdateCreateViewModel,
                  };
                } else {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      startDate: newDate.toISOString(),
                    } as VaccinationCampaignsUpdateCreateViewModel,
                  };
                }
              });
              setViewEventsDate(null);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            disabled={loading}
          >
            Add New Event
          </button>
          <button
            onClick={closeModal}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }, [viewEventsDate, getEventsForDate, eventCategories, loading, handleEventClick, closeModal]);

  const DailySchedule = useMemo(() => {
    if (!selectedDate) return null;
    const eventsForDate = getEventsForDate(new Date(selectedDate))
      .slice()
      .sort((a, b) => {
        const isApproveA = a.extendedProps?.calendar === 'approve' ? 1 : 0;
        const isApproveB = b.extendedProps?.calendar === 'approve' ? 1 : 0;
        if (isApproveA !== isApproveB) {
          return isApproveB - isApproveA;
        }
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });

    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Schedule for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <button
            onClick={() => {
              const selected = new Date(selectedDate);
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);
              if (selected < currentDate) {
                toast.error("Cannot create events in the past!");
                return;
              }
              setFormData((prev) => {
                const newDate = new Date(selectedDate);
                newDate.setHours(9, 0);
                if (prev.type === "medical") {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      scheduledDate: newDate.toISOString(),
                    } as MedicalEventUpdateCreateViewModel,
                  };
                } else {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      startDate: newDate.toISOString(),
                    } as VaccinationCampaignsUpdateCreateViewModel,
                  };
                }
              });
              openModal();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            disabled={loading}
          >
            Add Event
          </button>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {eventsForDate.length > 0 ? (
            eventsForDate.map((event) => {
              const category = eventCategories[event.extendedProps.calendar];
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium text-base">{event.title}</div>
                    <div>
                      <span className="text-xs">Type: {event.extendedProps.eventType}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm mt-1 ml-2">
                    {event.extendedProps.eventType === "medical"
                      ? event.extendedProps.description || "No description"
                      : `Vaccine: ${event.extendedProps.vaccineName || "No vaccine name"}`}
                  </div>
                  {event.extendedProps.eventType === "vaccination" && (
                    <div className="text-sm">
                      <div className="mt-1 ml-2">Type: {event.extendedProps.vaccineType}</div>
                      <div className="mt-1 ml-2">Mfg: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                      <div className="mt-1 ml-2">Exp: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
                    </div>
                  )}
                  <div className="text-sm mt-1 ml-2">
                    <span>Time:</span> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-sm">No events scheduled for this date.</div>
          )}
        </div>
      </div>
    );
  }, [selectedDate, getEventsForDate, eventCategories, loading, handleEventClick, openModal]);

  const eventTypeOptions: Option[] = useMemo(() => [
    { value: "medical", label: "Medical Event" },
    { value: "vaccination", label: "Vaccination Campaign" },
  ], []);

  const handleEventTypeChange = useCallback((value: string) => {
    setFormData(
      value === "medical"
        ? {
          type: "medical",
          data: { name: "", description: "", scheduledDate: new Date().toISOString() },
        } : {
          type: "vaccination",
          data: {
            name: "",
            vaccineName: "",
            exp: new Date().toISOString(),
            mfg: new Date().toISOString(),
            vaccineType: "",
            startDate: new Date().toISOString(),
          },
        }
    );
  }, []);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
          <p>{error}</p>
          {error.includes('authenticated') ? (
            <button
              onClick={() => window.location.href = '/login'}
              aria-label="Log in to view events"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={fetchEvents}
              aria-label="Retry fetching events"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <nav className="text-base text-gray-500">
              <ol className="flex items-center">
                <li><span className="mx-2">›</span></li>
                <li className="text-gray-700">Calendar Event</li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="lg:w-2/3 bg-white rounded-lg shadow-lg border-2 border-gray-200">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-gray-200 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-gray-200 bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-4">
                  {Object.entries(eventCategories).map(([key, category]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${category.color}`} />
                      <span className="text-sm text-gray-900 font-bold">{category.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(customFormatDateOnly(new Date()));
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Today
                </button>
              </div>

              <div className="grid grid-cols-7 bg-gray-50">
                {dayNames.map((day) => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-700 border-b border-gray-200">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const isPast = date && new Date(customFormatDateOnly(date)) < new Date(customFormatDateOnly(new Date()));
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] border border-gray-200 p-2 ${isPast ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'} ${date && customFormatDateOnly(date) === selectedDate
                        ? "bg-blue-100 hover:bg-blue-200"
                        : isPast ? '' : "hover:bg-gray-100"
                        }`}
                      onClick={() => date && !isPast && handleDateSelect(customFormatDate(date))}
                    >
                      {date && (
                        <>
                          <div
                            className={`text-sm font-medium mb-2 ${customFormatDateOnly(date) === customFormatDateOnly(new Date())
                              ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                              : isPast ? "text-gray-400" : "text-gray-700"
                              }`}
                          >
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {getEventsForDate(date).slice(0, 2).map((event) => {
                              const category = eventCategories[event.extendedProps.calendar];
                              return (
                                <Tooltip
                                  key={event.id}
                                  className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                                  content={
                                    <div className="text-left text-gray-900 text-sm">
                                      <div className="font-semibold mb-1">{event.title}</div>
                                      <p>
                                        <strong>Time:</strong>{' '}
                                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                      {event.extendedProps.eventType === "medical" ? (
                                        <>
                                          <p><strong>Description:</strong> {event.extendedProps.description || "No description"}</p>
                                          <p><strong>Date:</strong> {customFormatDateOnly(new Date(event.start))}</p>
                                        </>
                                      ) : (
                                        <>
                                          <p><strong>Vaccine Name:</strong> {event.extendedProps.vaccineName || "No vaccine name"}</p>
                                          <p><strong>Vaccine Type:</strong> {event.extendedProps.vaccineType || "No vaccine type"}</p>
                                          <p><strong>EXP:</strong> {customFormatDateOnly(new Date(event.extendedProps.exp!))}</p>
                                          <p><strong>MFG:</strong> {customFormatDateOnly(new Date(event.extendedProps.mfg!))}</p>
                                          <p><strong>Date:</strong> {customFormatDateOnly(new Date(event.start))}</p>
                                        </>
                                      )}
                                    </div>
                                  }
                                  placement="bottom"
                                >
                                  <div
                                    key={event.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEventClick(event);
                                    }}
                                    className={`flex items-start gap-2 text-xs p-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-[10px] uppercase tracking-wide mb-1 text-center">
                                        {event.extendedProps.eventType === "medical" ? "Medical" : "Vaccination"}
                                      </div>
                                      <div className="font-medium truncate text-sm mb-1">{event.title}</div>
                                      <div className="text-xs truncate opacity-75">
                                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                                        {event.extendedProps.eventType === "medical"
                                          ? event.extendedProps.description || "No description"
                                          : event.extendedProps.vaccineName || "No vaccine name"}
                                      </div>
                                    </div>
                                  </div>
                                </Tooltip>
                              );
                            })}
                            {getEventsForDate(date).length > 2 && (
                              <div
                                className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewEventsDate(customFormatDateOnly(date));
                                  openModal();
                                }}
                              >
                                +{getEventsForDate(date).length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:w-1/3">{DailySchedule}</div>
          </div>

          <Modal isOpen={isOpen} onClose={closeModal} className={`${formData.type === "medical" ? "" : "mt-[12rem]"} max-w-lg w-full p-6 bg-white rounded-lg shadow-lg`}>
            {viewEventsDate ? (
              ViewEventsModal
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEvent ? "Edit Event" : "Create New Event"}</h3>
                <div className="mb-4">
                  <Label className="block text-sm font-semibold text-gray-700 mb-1">Event Type *</Label>
                  <Select
                    options={eventTypeOptions}
                    placeholder="Select event type"
                    onChange={handleEventTypeChange}
                    defaultValue={formData.type}
                    disabled={selectedEvent !== null}
                  />
                </div>
                {formData.type === "medical" ? MedicalEventForm : VaccinationCampaignForm}
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  {selectedEvent && (
                    <div className="flex mr-[7.5rem]">
                      <button
                        onClick={handleDeleteEvent}
                        disabled={loading}
                        className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg bg-red-50 disabled:opacity-50"
                      >
                        Delete Event
                      </button>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddOrUpdateEvent}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {selectedEvent ? "Update Event" : "Create Event"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default Calendar;