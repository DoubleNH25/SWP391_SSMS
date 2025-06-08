import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal } from "@/components/ui/modal/index";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import { MedicalEventUpdateCreateViewModel, MedicalEventViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel, VaccinationCampaignsViewModel } from "@/types/VaccinationCampaigns";
import { CalendarEvent, customFormatDate, customFormatDateOnly, customFormatTime, toLocalISOString } from "@/types/CalendarEvent";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FecthCreateMedicalEvent, FecthDeleteMedicalEvents, FecthMedicalEvent, FecthUpdateMedicalEvent } from '@/services/MedicalEventService';
import { FecthCreateVaccinationCampaign, FecthDeleteVaccinationCampaign, FecthUpdateVaccinationCampaign, FecthVaccinationCampaign } from '@/services/VaccinationCampaignService';
import { Option } from '@/components/ui/form/Select';
import { FecthClass } from "@/services/SchoolClassService";
import MedicalEventForm from "@/components/calendar/MedicalEventForm";
import VaccinationCampaignForm from "@/components/calendar/VaccinationCampaignForm";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import ViewEventsModal from "@/components/calendar/ViewEventsModal";
import DailySchedule from "@/components/calendar/DailySchedule";

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
    data: { name: "", description: "", scheduledDate: "", classIds: [""] },
  });
  const [viewEventsDate, setViewEventsDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
            calendar: event.status,
            description: event.description || "",
            eventType: "medical",
            classIds: event.classIds?.length ? event.classIds as [string] : [""] as [string]
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
            calendar: event.status,
            vaccineType: event.vaccineType || "",
            exp: customFormatDate(event.exp || new Date()),
            mfg: customFormatDate(event.mfg || new Date()),
            vaccineName: event.vaccineName || "",
            eventType: "vaccination",
            classIds: event.classIds?.length ? event.classIds as [string] : [""] as [string]
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
    handleGetClass();
  }, [fetchEvents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownContainer = target.closest('[data-dropdown-container]');
      if (!dropdownContainer && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleGetClass = async () => {
    setLoading(true);
    try {
      const classRooms = await FecthClass();
      const options = classRooms.map(classRoom => ({
        value: classRoom.id,
        label: classRoom.className
      }));
      setClassOptions(options);


      setError(null);
    } catch (err) {
      setError(err.message.includes('authenticated')
        ? 'Please log in to fetch class data.'
        : 'Failed to fetch class data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setViewEventsDate(null);
    setSelectedEvent(null);
    setSelectedClasses([]);
    setValidationErrors({});
    setFormData({
      type: "medical",
      data: { name: "", description: "", scheduledDate: "", classIds: [""] },
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
      setSelectedClasses([]);
      setFormData((prev) => {
        selected.setHours(9, 0);
        if (prev.type === "medical") {
          return {
            type: "medical",
            data: {
              ...prev.data,
              scheduledDate: selected.toISOString(),
              classIds: [""]
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
    async (event: CalendarEvent) => {
      const eventDate = new Date(event.start);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (eventDate < currentDate) {
        toast.error("Cannot edit past events");
        return;
      }

      if (event.extendedProps.calendar !== "Pending") {
        toast.error("Cannot update or delete this event");
        return;
      }

      setSelectedEvent(event);

      // Show loading toast while fetching event details
      const loadingToastId = toast.loading("Loading event details...");

      try {
        // Fetch detailed event data to get classIds
        let eventDetail = null;
        let eventClassIds: string[] = [];

        if (event.extendedProps.eventType === "medical") {
          // Fetch all medical events and find the specific one
          const allMedicalEvents = await FecthMedicalEvent();
          eventDetail = allMedicalEvents.find(e => e.id === event.id);
          if (eventDetail && eventDetail.classIds) {
            eventClassIds = Array.isArray(eventDetail.classIds) ? eventDetail.classIds : [eventDetail.classIds];
          }
        } else {
          // Fetch all vaccination campaigns and find the specific one
          const allVaccinationCampaigns = await FecthVaccinationCampaign();
          eventDetail = allVaccinationCampaigns.find(e => e.id === event.id);
          if (eventDetail && eventDetail.classIds) {
            eventClassIds = Array.isArray(eventDetail.classIds) ? eventDetail.classIds : [eventDetail.classIds];
          }
        }

        // Set selected classes
        setSelectedClasses(eventClassIds);

        // Set form data
        setFormData(
          event.extendedProps.eventType === "medical"
            ? {
              type: "medical",
              data: {
                name: event.title,
                description: event.extendedProps.description || "",
                scheduledDate: new Date(event.start).toISOString(),
                classIds: eventClassIds.length > 0 ? eventClassIds as [string] : [""] as [string]
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
                classIds: eventClassIds.length > 0 ? eventClassIds as [string] : [""] as [string]
              },
            }
        );

        // Dismiss loading toast, clear view events date, and open modal
        toast.dismiss(loadingToastId);
        setViewEventsDate(null); // Clear view events date to show edit form
        openModal();
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.dismiss(loadingToastId);
        toast.error("Failed to load event details");
        // Fallback to basic data without classes
        setSelectedClasses([]);
        setFormData(
          event.extendedProps.eventType === "medical"
            ? {
              type: "medical",
              data: {
                name: event.title,
                description: event.extendedProps.description || "",
                scheduledDate: new Date(event.start).toISOString(),
                classIds: [""]
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
                classIds: [""]
              },
            }
        );
        toast.dismiss(loadingToastId);
        setViewEventsDate(null); // Clear view events date to show edit form
        openModal();
      } finally {
        // No need to setLoading(false) here since we're not using global loading state
      }
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

  const validateFormData = (type: string, data: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (type === "medical") {
      // Validate Medical Event fields
      if (!data.name?.trim()) {
        errors.name = "Event name is required!";
      }
      if (!data.description?.trim()) {
        errors.description = "Description is required!";
      }
      if (!data.scheduledDate) {
        errors.scheduledDate = "Scheduled date is required!";
      }
      if (!selectedClasses || selectedClasses.length === 0) {
        errors.classes = "At least one class must be selected!";
      }

      // Validate scheduled date
      if (data.scheduledDate) {
        const scheduledDate = new Date(data.scheduledDate);
        if (isNaN(scheduledDate.getTime())) {
          errors.scheduledDate = "Invalid scheduled date!";
        } else {
          // Check if date is in the past (only for new events)
          if (!selectedEvent) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            if (scheduledDate < currentDate) {
              errors.scheduledDate = "Cannot create events in the past!";
            }
          }
        }
      }
    } else if (type === "vaccination") {
      // Validate Vaccination Campaign fields
      if (!data.name?.trim()) {
        errors.name = "Campaign name is required!";
      }
      if (!data.vaccineName?.trim()) {
        errors.vaccineName = "Vaccine name is required!";
      }
      if (!data.vaccineType?.trim()) {
        errors.vaccineType = "Vaccine type is required!";
      }
      if (!data.startDate) {
        errors.startDate = "Start date is required!";
      }
      if (!data.exp) {
        errors.exp = "Expiration date is required!";
      }
      if (!data.mfg) {
        errors.mfg = "Manufacturing date is required!";
      }
      if (!selectedClasses || selectedClasses.length === 0) {
        errors.classes = "At least one class must be selected!";
      }

      // Validate dates
      const startDate = new Date(data.startDate);
      const expDate = new Date(data.exp);
      const mfgDate = new Date(data.mfg);

      if (data.startDate && isNaN(startDate.getTime())) {
        errors.startDate = "Invalid start date!";
      }
      if (data.exp && isNaN(expDate.getTime())) {
        errors.exp = "Invalid expiration date!";
      }
      if (data.mfg && isNaN(mfgDate.getTime())) {
        errors.mfg = "Invalid manufacturing date!";
      }

      // Check date logic (only if all dates are valid)
      if (data.mfg && data.exp && !isNaN(mfgDate.getTime()) && !isNaN(expDate.getTime())) {
        if (mfgDate >= expDate) {
          errors.mfg = "Manufacturing date must be before expiration date!";
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (mfgDate > currentDate) {
          errors.mfg = "Manufacturing date cannot be in the future!";
        }

        if (expDate <= currentDate) {
          errors.exp = "Expiration date must be in the future!";
        }
      }

      // Check if start date is in the past (only for new events)
      if (!selectedEvent && data.startDate && !isNaN(startDate.getTime())) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (startDate < currentDate) {
          errors.startDate = "Cannot create events in the past!";
        }
      }
    }

    return errors;
  };

  const handleAddOrUpdateEvent = useCallback(async () => {
    if (loading) return;
    const { type, data } = formData;

    setLoading(true);
    try {
      if (selectedEvent) {
        // Update mode - no validation needed
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
                      calendar: event.extendedProps.calendar,
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
                      calendar: event.extendedProps.calendar,
                    },
                  }
                  : event
              )
            );
            toast.success('Vaccination campaign updated successfully');
          }
        }
      } else {
        // Create mode - validate all fields
        const validationErrors = validateFormData(type, data);
        if (Object.keys(validationErrors).length > 0) {
          setValidationErrors(validationErrors);
          return;
        }

        // Clear validation errors if all fields are valid
        setValidationErrors({});
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
                calendar: response.status || "Pending",
                description: response.description || "",
                eventType: "medical",
                classIds: response.classIds?.length ? response.classIds as [string] : [""] as [string]
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
                calendar: response.status || "Pending",
                vaccineName: response.vaccineName || "",
                vaccineType: response.vaccineType || "",
                exp: customFormatDate(response.exp || new Date()),
                mfg: customFormatDate(response.mfg || new Date()),
                eventType: "vaccination",
                classIds: response.classIds?.length ? response.classIds as [string] : [""] as [string]
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
    if (!selectedEvent || selectedEvent.extendedProps.calendar !== "Pending") {
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

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  }, []);

  const MedicalEventFormComponent = useMemo(() => {
    const medicalData = formData.type === "medical" ? formData.data as MedicalEventUpdateCreateViewModel : null;
    if (!medicalData) return null;

    const handleClassChange = (classIds: string[]) => {
      setSelectedClasses(classIds);
      handleMedicalInputChange("classIds", classIds.length > 0 ? classIds as [string] : [""] as [string]);
    };

    return (
      <MedicalEventForm
        medicalData={medicalData}
        classOptions={classOptions}
        selectedClasses={selectedClasses}
        onInputChange={handleMedicalInputChange}
        onClassChange={handleClassChange}
        validationErrors={validationErrors}
      />
    );
  }, [formData, handleMedicalInputChange, classOptions, selectedClasses, validationErrors]);


  const VaccinationCampaignFormComponent = useMemo(() => {
    const vaccinationData = formData.type === "vaccination" ? formData.data as VaccinationCampaignsUpdateCreateViewModel : null;
    if (!vaccinationData) return null;

    const handleClassChange = (classIds: string[]) => {
      setSelectedClasses(classIds);
      handleVaccinationInputChange("classIds", classIds.length > 0 ? classIds as [string] : [""] as [string]);
    };

    return (
      <VaccinationCampaignForm
        vaccinationData={vaccinationData}
        classOptions={classOptions}
        selectedClasses={selectedClasses}
        onInputChange={handleVaccinationInputChange}
        onClassChange={handleClassChange}
        validationErrors={validationErrors}
      />
    );
  }, [formData, handleVaccinationInputChange, classOptions, selectedClasses, validationErrors]);

  const ViewEventsModalComponent = useMemo(() => {
    return (
      <ViewEventsModal
        viewEventsDate={viewEventsDate}
        events={events}
        loading={loading}
        onEventClick={handleEventClick}
        onClose={closeModal}
        onAddNewEvent={() => setViewEventsDate(null)}
        onSetFormData={setFormData}
        classOptions={classOptions}
      />
    );
  }, [viewEventsDate, events, loading, handleEventClick, closeModal]);

  const DailyScheduleComponent = useMemo(() => {
    return (
      <DailySchedule
        selectedDate={selectedDate}
        events={events}
        loading={loading}
        onEventClick={handleEventClick}
        onOpenModal={openModal}
        onSetFormData={setFormData}
        classOptions={classOptions}
      />
    );
  }, [selectedDate, events, loading, handleEventClick, openModal, classOptions]);

  const isFormValid = useMemo(() => {
    if (selectedEvent) {
      return true;
    }
    const { type, data } = formData;

    if (type === "medical") {
      return (
        data.name?.trim() &&
        data.description?.trim() &&
        data.scheduledDate &&
        selectedClasses.length > 0
      );
    } else if (type === "vaccination") {
      return (
        data.name?.trim() &&
        data.vaccineName?.trim() &&
        data.vaccineType?.trim() &&
        data.startDate &&
        data.exp &&
        data.mfg &&
        selectedClasses.length > 0
      );
    }

    return false;
  }, [formData, selectedClasses, selectedEvent]);

  const eventTypeOptions: Option[] = useMemo(() => [
    { value: "medical", label: "Medical Event" },
    { value: "vaccination", label: "Vaccination Campaign" },
  ], []);

  const handleEventTypeChange = useCallback((value: string) => {
    setSelectedClasses([]);
    setFormData(
      value === "medical"
        ? {
          type: "medical",
          data: {
            name: "",
            description: "",
            scheduledDate: new Date().toISOString(),
            classIds: [""]
          },
        } : {
          type: "vaccination",
          data: {
            name: "",
            vaccineName: "",
            exp: new Date().toISOString(),
            mfg: new Date().toISOString(),
            vaccineType: "",
            startDate: new Date().toISOString(),
            classIds: [""]
          },
        }
    );
  }, []);

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} className="z-9999" />
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
            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate || ""}
              events={events}
              classOptions={classOptions}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
              onViewMoreEvents={(date) => {
                setViewEventsDate(date);
                openModal();
              }}
              onNavigateMonth={navigateMonth}
              onToday={() => {
                setCurrentDate(new Date());
                setSelectedDate(customFormatDateOnly(new Date()));
              }}
            />

            <div className="lg:w-1/3">{DailyScheduleComponent}</div>
          </div>

          <Modal isOpen={isOpen} onClose={closeModal}
            className={`${formData.type === "medical" ? "" : "max-w-3xl"} 
          max-w-lg w-full p-6 bg-white rounded-lg shadow-lg`}>
            {viewEventsDate ? (
              ViewEventsModalComponent
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
                {formData.type === "medical" ? MedicalEventFormComponent : VaccinationCampaignFormComponent}
                <div
                  className={`flex mt-6 pt-4 border-t border-gray-200 ${selectedEvent ? "justify-between" : "justify-end"
                    }`}
                >
                  {selectedEvent && (
                    <div>
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
                      disabled={loading || !isFormValid}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
