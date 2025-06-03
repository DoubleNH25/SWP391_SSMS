import { useState, useEffect, useCallback, useMemo } from "react";
import { formatDate } from "@fullcalendar/core";
import { Modal } from "@/components/ui/modal/index";
import { FecthCreateMedicalEvent, FecthDeleteMedicalEvents, FecthMedicalEvent, FecthUpdateMedicalEvent, } from "@/services/MedicalEventService";
import { FecthCreateVaccinationCampaign, FecthDeleteVaccinationCampaign, FecthVaccinationCampaign, FecthUpdateVaccinationCampaign, } from "@/services/VaccinationCampaignService";
import DatePicker from "@/components/ui/form/DateField";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel, VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { CalendarEvent } from "@/types/CalendarEvent";
import { Tooltip } from "@material-tailwind/react";

type FormData =
  | { type: "medical"; data: MedicalEventUpdateCreateViewModel }
  | { type: "vaccination"; data: VaccinationCampaignsUpdateCreateViewModel };

interface Option {
  value: string;
  label: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState<FormData>({
    type: "medical",
    data: { name: "", description: "", scheduledDate: new Date() },
  });
  const [viewEventsDate, setViewEventsDate] = useState<string | null>(null);

  const eventCategories = useMemo(
    () => ({
      pending: { label: "Pending", color: "bg-yellow-500", lightColor: "bg-yellow-50", textColor: "text-yellow-700" },
      approve: { label: "Approve", color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-green-700" },
      cancel: { label: "Cancel", color: "bg-red-500", lightColor: "bg-red-50", textColor: "text-red-700" },
    }),
    []
  );

  const fetchEvents = useCallback(async () => {
    try {
      const [medicalEventsRaw, vaccinationCampaignsRaw] = await Promise.all([
        FecthMedicalEvent(),
        FecthVaccinationCampaign(),
      ]);

      const medicalEvents: CalendarEvent[] = (Array.isArray(medicalEventsRaw) ? medicalEventsRaw : [medicalEventsRaw]).map(
        (event: MedicalEventViewModel) => ({
          id: event.id,
          title: event.name,
          start: formatDate(event.scheduledDate),
          allDay: true,
          extendedProps: { calendar: event.isAccepted ? "approve" : "pending", description: event.description || "", eventType: "medical" },
        })
      );

      const vaccinationEvents: CalendarEvent[] = (
        Array.isArray(vaccinationCampaignsRaw) ? vaccinationCampaignsRaw : [vaccinationCampaignsRaw]
      ).map((event: VaccinationCampaignsViewModel) => ({
        id: event.id,
        title: event.name,
        start: formatDate(event.startDate),
        allDay: true,
        extendedProps: {
          calendar: event.isAccepted ? "approve" : "pending",
          vaccineType: event.vaccineType || "",
          exp: formatDate(event.exp),
          mfg: formatDate(event.mfg),
          vaccineName: event.vaccineName || "",
          eventType: "vaccination",
        },
      }));

      setEvents([...medicalEvents, ...vaccinationEvents]);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
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
      data: { name: "", description: "", scheduledDate: new Date() },
    });
  }, []);

  const handleDateSelect = useCallback(
    (date: string) => {
      setFormData((prev) => {
        if (prev.type === "medical") {
          return {
            type: "medical",
            data: {
              ...prev.data,
              scheduledDate: new Date(date),
            } as MedicalEventUpdateCreateViewModel,
          };
        } else {
          return {
            type: "vaccination",
            data: {
              ...prev.data,
              startDate: new Date(date),
            } as VaccinationCampaignsUpdateCreateViewModel,
          };
        }
      });
      openModal();
    },
    [openModal]
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      if (event.extendedProps.calendar !== "pending") {
        window.alert("Cannot update or delete this event");
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
              scheduledDate: new Date(event.start),
            },
          }
          : {
            type: "vaccination",
            data: {
              name: event.title,
              vaccineName: event.extendedProps.vaccineName || "",
              vaccineType: event.extendedProps.vaccineType || "",
              exp: new Date(event.extendedProps.exp || new Date()),
              mfg: new Date(event.extendedProps.mfg || new Date()),
              startDate: new Date(event.start),
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

  const handleAddOrUpdateEvent = useCallback(async () => {
    const { type, data } = formData;
    if (type === "medical" && !data.name.trim()) {
      window.alert("Event name is required!");
      return;
    }
    if (type === "vaccination" && (!data.name.trim() || !data.vaccineName?.trim() || !data.vaccineType?.trim())) {
      window.alert("Campaign name, vaccine name, and vaccine type are required!");
      return;
    }

    try {
      if (selectedEvent) {
        if (type === "medical") {
          await FecthUpdateMedicalEvent(selectedEvent.id, data as MedicalEventUpdateCreateViewModel);
          setEvents((prev) =>
            prev.map((event) =>
              event.id === selectedEvent.id
                ? { ...event, title: data.name, start: formatDate(data.scheduledDate), extendedProps: { ...event.extendedProps, description: data.description || "", calendar: "pending" } }
                : event
            )
          );
        } else {
          await FecthUpdateVaccinationCampaign(selectedEvent.id, data as VaccinationCampaignsUpdateCreateViewModel);
          setEvents((prev) =>
            prev.map((event) =>
              event.id === selectedEvent.id
                ? {
                  ...event,
                  title: data.name,
                  start: formatDate(data.startDate),
                  extendedProps: {
                    ...event.extendedProps,
                    vaccineName: data.vaccineName || "",
                    vaccineType: data.vaccineType || "",
                    exp: formatDate(data.exp),
                    mfg: formatDate(data.mfg),
                    calendar: "pending",
                  },
                }
                : event
            )
          );
        }
      } else {
        const response = type === "medical"
          ? await FecthCreateMedicalEvent(data as MedicalEventUpdateCreateViewModel)
          : await FecthCreateVaccinationCampaign(data as VaccinationCampaignsUpdateCreateViewModel);
        setEvents((prev) => [
          ...prev,
          {
            id: response.id,
            title: response.name,
            start: formatDate(type === "medical" ? (response as MedicalEventViewModel).scheduledDate : (response as VaccinationCampaignsViewModel).startDate),
            allDay: true,
            extendedProps: {
              calendar: "pending",
              description: (response as MedicalEventViewModel).description || (response as VaccinationCampaignsViewModel).name,
              eventType: type,
              ...(type === "vaccination" && {
                vaccineName: (response as VaccinationCampaignsViewModel).vaccineName || "",
                vaccineType: (response as VaccinationCampaignsViewModel).vaccineType || "",
                exp: formatDate((response as VaccinationCampaignsViewModel).exp),
                mfg: formatDate((response as VaccinationCampaignsViewModel).mfg),
              }),
            },
          },
        ]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save event:", error);
      window.alert("Failed to save the event. Please try again.");
    }
  }, [formData, selectedEvent, closeModal]);

  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent || selectedEvent.extendedProps.calendar !== "pending") {
      window.alert("Cannot delete this event");
      return;
    }
    try {
      if (selectedEvent.extendedProps.eventType === "medical") {
        await FecthDeleteMedicalEvents(selectedEvent.id);
      } else {
        await FecthDeleteVaccinationCampaign(selectedEvent.id);
      }
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
      closeModal();
    } catch (error) {
      console.error("Failed to delete event:", error);
      window.alert("Failed to delete the event. Please try again.");
    }
  }, [selectedEvent, closeModal]);

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
      const dateStr = formatDate(date);
      return events.filter((event) => event.start === dateStr);
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
            defaultDate={medicalData.scheduledDate}
            onChange={(date) => handleMedicalInputChange("scheduledDate", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
        </div>
      </div>
    );
  }, [formData, handleMedicalInputChange]);

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
            defaultDate={vaccinationData.mfg}
            onChange={(date) => handleVaccinationInputChange("mfg", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="1900-01-01"
            maxDate="today"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker-exp"
            label="Expiration Date"
            defaultDate={vaccinationData.exp}
            onChange={(date) => handleVaccinationInputChange("exp", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
        </div>
        <div>
          <DatePicker
            id="date-picker-start"
            label="Start Date"
            defaultDate={vaccinationData.startDate}
            onChange={(date) => handleVaccinationInputChange("startDate", Array.isArray(date) ? date[0] || new Date() : date || new Date())}
            minDate="today"
            maxDate="9000-12-31"
          />
        </div>
      </div>
    );
  }, [formData, handleVaccinationInputChange]);

  const ViewEventsModal = useMemo(() => {
    if (!viewEventsDate) return null;
    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Events on {new Date(viewEventsDate).toLocaleDateString()}</h3>
        <div className="space-y-3">
          {getEventsForDate(new Date(viewEventsDate)).map((event) => {
            const category = eventCategories[event.extendedProps.calendar];
            return (
              <div
                key={event.id}
                className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex justify-between">
                  <div className="font-medium">{event.title}</div>
                  <div>
                    <span className="text-xs">Type: {event.extendedProps.eventType}</span>
                  </div>
                </div>
                <div className="text-sm">
                  {event.extendedProps.eventType === "medical"
                    ? event.extendedProps.description || "No description"
                    : `Vaccine: ${event.extendedProps.vaccineName || "No vaccine name"}`}
                </div>
                <div className="text-xs font-semibold">{category.label}</div>
                {event.extendedProps.eventType === "vaccination" && (
                  <div className="text-xs">
                    <div>Type: {event.extendedProps.vaccineType}</div>
                    <div>Mfg: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                    <div>Exp: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setFormData((prev) => {
                if (prev.type === "medical") {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      scheduledDate: new Date(viewEventsDate),
                    } as MedicalEventUpdateCreateViewModel,
                  };
                } else {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      startDate: new Date(viewEventsDate),
                    } as VaccinationCampaignsUpdateCreateViewModel,
                  };
                }
              });
              setViewEventsDate(null);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Add New Event
          </button>
          <button onClick={closeModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    );
  }, [viewEventsDate, getEventsForDate, eventCategories, handleEventClick, closeModal]);

  const eventTypeOptions: Option[] = useMemo(() => [
    { value: "medical", label: "Medical Event" },
    { value: "vaccination", label: "Vaccination Campaign" },
  ], []);

  const handleEventTypeChange = useCallback((value: string) => {
    setFormData(
      value === "medical"
        ? {
          type: "medical",
          data: { name: "", description: "", scheduledDate: new Date() },
        }
        : {
          type: "vaccination",
          data: {
            name: "",
            vaccineName: "",
            exp: new Date(),
            mfg: new Date(),
            vaccineType: "",
            startDate: new Date(),
          },
        }
    );
  }, []);

  return (
    <div >
      <div className="m-4">
        <div className="mb-4 flex items-center justify-between">
          <nav className="text-base text-gray-500">
            <ol className="flex items-center">
              <li><span className="mx-2">›</span></li>
              <li className="text-gray-700">Calendar Event</li>
            </ol>
          </nav>
          <button
            onClick={() => handleDateSelect(formatDate(new Date()))}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
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
              onClick={() => setCurrentDate(new Date())}
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
            {getDaysInMonth(currentDate).map((date, index) => (
              <div
                key={index}
                className={`min-h-[120px] border border-gray-200 p-2 cursor-pointer ${date && formatDate(date) === formatDate(new Date()) ? "bg-blue-100  hover:bg-blue-200" : " hover:bg-gray-100"
                  }`}
                onClick={() => date && handleDateSelect(formatDate(date))}
              >
                {date && (
                  <>
                    <div
                      className={`text-sm font-medium mb-2 ${formatDate(date) === formatDate(new Date()) ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-gray-700"
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
                                {event.extendedProps.eventType === "medical" ? (
                                  <>
                                    <p><strong>Description:</strong> {event.extendedProps.description || "No description"}</p>
                                    <p><strong>Date:</strong> {event.start}</p>
                                  </>
                                ) : (
                                  <>
                                    <p><strong>Vaccine Name:</strong> {event.extendedProps.vaccineName || "No vaccine name"}</p>
                                    <p><strong>Vaccine Type:</strong> {event.extendedProps.vaccineType || "No vaccine type"}</p>
                                    <p><strong>EXP:</strong> {event.extendedProps.exp || ""}</p>
                                    <p><strong>MFG:</strong> {event.extendedProps.mfg || ""}</p>
                                    <p><strong>Date:</strong> {event.start}</p>
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
                              className={`flex items-start gap-2 text-xs p-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity
                                          ${category.lightColor}
                                          ${category.textColor}
                                          border-l-4 border-${category.color.split("-")[1]}-500`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-[10px] uppercase tracking-wide mb-1 text-center">
                                  {event.extendedProps.eventType === "medical" ? "Medical" : "Vaccination"}
                                </div>
                                <div className="font-medium truncate text-sm mb-1">{event.title}</div>
                                <div className="text-xs truncate opacity-75">
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
                            setViewEventsDate(formatDate(date));
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
            ))}
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg">
          {viewEventsDate ? (
            ViewEventsModal
          ) : (
            <div className={"space-y-4"}>
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
                      className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg bg-red-50"
                    >
                      Delete Event
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={closeModal} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddOrUpdateEvent}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  >
                    {selectedEvent ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Calendar;