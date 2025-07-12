import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/modal/index";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import {
  MedicalEventUpdateCreateViewModel,
  MedicalEventViewModel,
} from "@/types/MedicalEvent";
import {
  VaccinationCampaignsUpdateCreateViewModel,
  VaccinationCampaignsViewModel,
} from "@/types/VaccinationCampaigns";
import { CalendarEvent } from "@/types/CalendarEvent";
import { DateUtils } from "@/utils/DateUtils";
import { toast } from "react-toastify";
import {
  FecthCreateMedicalEvent,
  FecthDeleteMedicalEvents,
  FecthMedicalEvent,
  FecthUpdateMedicalEvent,
} from "@/services/MedicalEventService";
import {
  FecthCreateVaccinationCampaign,
  FecthDeleteVaccinationCampaign,
  FecthUpdateVaccinationCampaign,
  FecthVaccinationCampaign,
} from "@/services/VaccinationCampaignService";
import { Option } from "@/components/ui/form/Select";
import { FecthClass } from "@/services/SchoolClassService";
import MedicalEventForm from "@/components/calendar/MedicalEventForm";
import VaccinationCampaignForm from "@/components/calendar/VaccinationCampaignForm";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import ViewEventsModal from "@/components/calendar/ViewEventsModal";
import DailySchedule from "@/components/calendar/DailySchedule";
import PageHeader from "@/components/ui/PageHeader";
import { CalendarDays } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

type FormData =
  | { type: "medical"; data: MedicalEventUpdateCreateViewModel }
  | { type: "vaccination"; data: VaccinationCampaignsUpdateCreateViewModel };

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    DateUtils.customFormatDateOnly(new Date())
  );
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    type: "medical",
    data: { name: "", description: "", scheduledDate: "", classIds: [""] },
  });
  const [viewEventsDate, setViewEventsDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [medicalEventsRaw, vaccinationCampaignsRaw] = await Promise.all([
        FecthMedicalEvent(),
        FecthVaccinationCampaign(),
      ]);

      const medicalEvents: CalendarEvent[] = (
        Array.isArray(medicalEventsRaw) ? medicalEventsRaw : []
      ).map((event: MedicalEventViewModel) => ({
        id: event.id ?? "",
        title: event.name ?? "",
        start: DateUtils.customFormatDate(event.scheduledDate || new Date()),
        allDay: false,
        extendedProps: {
          calendar: event.status,
          description: event.description || "",
          eventType: "medical",
          classIds: event.classIds?.length
            ? (event.classIds as [string])
            : ([""] as [string]),
        },
      }));

      const vaccinationEvents: CalendarEvent[] = (
        Array.isArray(vaccinationCampaignsRaw) ? vaccinationCampaignsRaw : []
      ).map((event: VaccinationCampaignsViewModel) => ({
        id: event.id ?? "",
        title: event.name ?? "",
        start: DateUtils.customFormatDate(event.startDate || new Date()),
        allDay: false,
        extendedProps: {
          calendar: event.status,
          vaccineType: event.vaccineType || "",
          exp: DateUtils.customFormatDate(event.exp || new Date()),
          mfg: DateUtils.customFormatDate(event.mfg || new Date()),
          vaccineName: event.vaccineName || "",
          eventType: "vaccination",
          classIds: event.classIds?.length
            ? (event.classIds as [string])
            : ([""] as [string]),
        },
      }));
      setEvents([...medicalEvents, ...vaccinationEvents]);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
      setError(
        errorMessage.includes("authenticated")
          ? "Vui lòng đăng nhập để xem sự kiện."
          : "Không thể tải sự kiện. Vui lòng thử lại."
      );
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
      const dropdownContainer = target.closest("[data-dropdown-container]");
      if (!dropdownContainer && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleGetClass = async () => {
    setLoading(true);
    try {
      const classRooms = await FecthClass();
      const options = classRooms.map((classRoom) => ({
        value: classRoom.id,
        label: classRoom.className,
      }));
      setClassOptions(options);
      setError(null);
    } catch (err) {
      setError(
        (err as Error).message.includes("authenticated")
          ? "Vui lòng đăng nhập để xem dữ liệu lớp học."
          : "Không thể tải dữ liệu lớp học. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleDateSelect = useCallback((date: string) => {
    const selected = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selected < currentDate) {
      showToast.error("Không thể tạo sự kiện trong quá khứ!");
      return;
    }

    setSelectedDate(DateUtils.customFormatDateOnly(date));
    setSelectedClasses([]);
    setFormData((prev) => {
      selected.setHours(9, 0);
      if (prev.type === "medical") {
        return {
          type: "medical",
          data: {
            ...prev.data,
            scheduledDate: DateUtils.customFormatDateForBackend(selected),
            classIds: [""],
          } as MedicalEventUpdateCreateViewModel,
        };
      } else {
        return {
          type: "vaccination",
          data: {
            ...prev.data,
            startDate: DateUtils.customFormatDateForBackend(selected),
          } as VaccinationCampaignsUpdateCreateViewModel,
        };
      }
    });
  }, []);

  const handleEventClick = useCallback(
    async (event: CalendarEvent) => {
      const eventDate = new Date(event.start);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (event.extendedProps.calendar === "Approved") {
        if (event.extendedProps.eventType === "medical") {
          navigate(`/dashboard/medical-health-checkup-record/${event.start}/${event.id}`);
        } else {
          navigate(`/dashboard/medical-vaccination-record/${event.start}/${event.id}`);
        }
        return;
      }

      if (eventDate < currentDate) {
        showToast.error("Không thể chỉnh sửa sự kiện trong quá khứ");
        return;
      }

      if (event.extendedProps.calendar !== "Pending") {
        showToast.error("Không thể cập nhật hoặc xóa sự kiện này");
        return;
      }

      setSelectedEvent(event);

      // Show loading toast while fetching event details
      const loadingToastId = toast.loading("Đang tải thông tin sự kiện...");

      try {
        // Fetch detailed event data to get classIds
        let eventDetail = null;
        let eventClassIds: string[] = [];

        if (event.extendedProps.eventType === "medical") {
          // Fetch all medical events and find the specific one
          const allMedicalEvents = await FecthMedicalEvent();
          eventDetail = allMedicalEvents.find((e) => e.id === event.id);
          if (eventDetail && eventDetail.classIds) {
            eventClassIds = Array.isArray(eventDetail.classIds)
              ? eventDetail.classIds
              : [eventDetail.classIds];
          }
        } else {
          // Fetch all vaccination campaigns and find the specific one
          const allVaccinationCampaigns = await FecthVaccinationCampaign();
          eventDetail = allVaccinationCampaigns.find((e) => e.id === event.id);
          if (eventDetail && eventDetail.classIds) {
            eventClassIds = Array.isArray(eventDetail.classIds)
              ? eventDetail.classIds
              : [eventDetail.classIds];
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
                scheduledDate: DateUtils.customFormatDateForBackend(new Date(event.start)),
                classIds:
                  eventClassIds.length > 0
                    ? (eventClassIds as [string])
                    : [""],
              },
            }
            : {
              type: "vaccination",
              data: {
                name: event.title,
                vaccineName: event.extendedProps.vaccineName || "",
                vaccineType: event.extendedProps.vaccineType || "",
                exp: DateUtils.customFormatDateForBackend(new Date(event.extendedProps.exp || new Date())),
                mfg: DateUtils.customFormatDateForBackend(new Date(event.extendedProps.mfg || new Date())),
                startDate: DateUtils.customFormatDateForBackend(new Date(event.start)),
                classIds:
                  eventClassIds.length > 0
                    ? (eventClassIds as [string])
                    : [""],
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
        showToast.error("Không thể tải thông tin sự kiện");
        // Fallback to basic data without classes
        setSelectedClasses([]);
        setFormData(
          event.extendedProps.eventType === "medical"
            ? {
              type: "medical",
              data: {
                name: event.title,
                description: event.extendedProps.description || "",
                scheduledDate: DateUtils.customFormatDateForBackend(new Date(event.start)),
                classIds: [""],
              },
            }
            : {
              type: "vaccination",
              data: {
                name: event.title,
                vaccineName: event.extendedProps.vaccineName || "",
                vaccineType: event.extendedProps.vaccineType || "",
                exp: DateUtils.customFormatDateForBackend(new Date(event.extendedProps.exp || new Date())),
                mfg: DateUtils.customFormatDateForBackend(new Date(event.extendedProps.mfg || new Date())),
                startDate: DateUtils.customFormatDateForBackend(new Date(event.start)),
                classIds: [""],
              },
            }
        );
        toast.dismiss(loadingToastId);
        setViewEventsDate(null); // Clear view events date to show edit form
        openModal();
      }
    },
    [navigate, openModal]
  );

  const handleMedicalInputChange = useCallback(
    (field: keyof MedicalEventUpdateCreateViewModel, value: string) => {
      // Clear validation error for this field when user starts typing
      if (validationErrors[field]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      
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
    },
    [validationErrors]
  );

  const handleVaccinationInputChange = useCallback(
    (field: keyof VaccinationCampaignsUpdateCreateViewModel, value: string) => {
      // Clear validation error for this field when user starts typing
      if (validationErrors[field]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
      
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
    },
    [validationErrors]
  );

  function prepareMedicalData(
    data: MedicalEventUpdateCreateViewModel
  ): MedicalEventUpdateCreateViewModel {
    return {
      ...data,
      scheduledDate: DateUtils.customFormatDateForBackend(data.scheduledDate),
    };
  }

  function prepareVaccinationCampaignData(
    data: VaccinationCampaignsUpdateCreateViewModel
  ): VaccinationCampaignsUpdateCreateViewModel {
    return {
      ...data,
      exp: DateUtils.customFormatDateForBackend(data.exp),
      mfg: DateUtils.customFormatDateForBackend(data.mfg),
      startDate: DateUtils.customFormatDateForBackend(data.startDate),
    };
  }

  const validateFormData = useCallback(
    (
      type: string,
      data:
        | MedicalEventUpdateCreateViewModel
        | VaccinationCampaignsUpdateCreateViewModel
    ): Record<string, string> => {
      const errors: Record<string, string> = {};
      
      // Validate classes selection for both types
      if (!selectedClasses || selectedClasses.length === 0 || (selectedClasses.length === 1 && selectedClasses[0] === "")) {
        errors.classes = "Phải chọn ít nhất một lớp!";
      }
      
      if (type === "medical") {
        // Validate Medical Event fields
        if (!data.name?.trim()) {
          errors.name = "Tên sự kiện là bắt buộc!";
        }
        if (!(data as MedicalEventUpdateCreateViewModel).description?.trim()) {
          errors.description = "Mô tả là bắt buộc!";
        }
        if (!(data as MedicalEventUpdateCreateViewModel).scheduledDate) {
          errors.scheduledDate = "Ngày dự kiến là bắt buộc!";
        }

        // Validate scheduled date
        if ((data as MedicalEventUpdateCreateViewModel).scheduledDate) {
          const scheduledDate = new Date(
            (data as MedicalEventUpdateCreateViewModel).scheduledDate
          );
          if (isNaN(scheduledDate.getTime())) {
            errors.scheduledDate = "Ngày dự kiến không hợp lệ!";
          } else {
            // Check if date is in the past (only for new events)
            if (!selectedEvent) {
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);
              if (scheduledDate < currentDate) {
                errors.scheduledDate = "Không thể tạo sự kiện trong quá khứ!";
              }
            }
          }
        }
      } else if (type === "vaccination") {
        // Validate Vaccination Campaign fields
        if (!data.name?.trim()) {
          errors.name = "Tên chiến dịch là bắt buộc!";
        }
        if (
          !(
            data as VaccinationCampaignsUpdateCreateViewModel
          ).vaccineName?.trim()
        ) {
          errors.vaccineName = "Tên vaccine là bắt buộc!";
        }
        if (
          !(
            data as VaccinationCampaignsUpdateCreateViewModel
          ).vaccineType?.trim()
        ) {
          errors.vaccineType = "Loại vaccine là bắt buộc!";
        }
        if (!(data as VaccinationCampaignsUpdateCreateViewModel).startDate) {
          errors.startDate = "Ngày bắt đầu là bắt buộc!";
        }
        if (!(data as VaccinationCampaignsUpdateCreateViewModel).exp) {
          errors.exp = "Ngày hết hạn là bắt buộc!";
        }
        if (!(data as VaccinationCampaignsUpdateCreateViewModel).mfg) {
          errors.mfg = "Ngày sản xuất là bắt buộc!";
        }

        // Validate dates
        const startDate = new Date(
          (data as VaccinationCampaignsUpdateCreateViewModel).startDate
        );
        const expDate = new Date(
          (data as VaccinationCampaignsUpdateCreateViewModel).exp
        );
        const mfgDate = new Date(
          (data as VaccinationCampaignsUpdateCreateViewModel).mfg
        );

        if (
          (data as VaccinationCampaignsUpdateCreateViewModel).startDate &&
          isNaN(startDate.getTime())
        ) {
          errors.startDate = "Ngày bắt đầu không hợp lệ!";
        }
        if (
          (data as VaccinationCampaignsUpdateCreateViewModel).exp &&
          isNaN(expDate.getTime())
        ) {
          errors.exp = "Ngày hết hạn không hợp lệ!";
        }
        if (
          (data as VaccinationCampaignsUpdateCreateViewModel).mfg &&
          isNaN(mfgDate.getTime())
        ) {
          errors.mfg = "Ngày sản xuất không hợp lệ!";
        }

        // Check date logic (only if all dates are valid)
        if (
          (data as VaccinationCampaignsUpdateCreateViewModel).mfg &&
          (data as VaccinationCampaignsUpdateCreateViewModel).exp &&
          !isNaN(mfgDate.getTime()) &&
          !isNaN(expDate.getTime())
        ) {
          if (mfgDate >= expDate) {
            errors.mfg = "Ngày sản xuất phải trước ngày hết hạn!";
          }

          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          if (mfgDate > currentDate) {
            errors.mfg = "Ngày sản xuất không thể trong tương lai!";
          }

          if (expDate <= currentDate) {
            errors.exp = "Ngày hết hạn phải trong tương lai!";
          }
        }

        // Check if start date is in the past (only for new events)
        if (
          !selectedEvent &&
          (data as VaccinationCampaignsUpdateCreateViewModel).startDate &&
          !isNaN(startDate.getTime())
        ) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          if (startDate < currentDate) {
            errors.startDate = "Không thể tạo sự kiện trong quá khứ!";
          }
        }
      }

      return errors;
    },
    [selectedClasses, selectedEvent]
  );

  const handleAddOrUpdateEvent = useCallback(async () => {
    if (loading) return;
    const { type, data } = formData;

    // Always validate first, even for updates
    const validationErrors = validateFormData(type, data);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    // Clear validation errors if all fields are valid
    setValidationErrors({});
    setLoading(true);
    
    try {
      if (selectedEvent) {
        // Update mode
        if (type === "medical") {
          const payload = prepareMedicalData(data);
          console.log(payload);
          const success = await FecthUpdateMedicalEvent(
            selectedEvent.id,
            payload
          );
          if (success) {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === selectedEvent.id
                  ? {
                    ...event,
                    title: data.name,
                    start: DateUtils.customFormatDate(data.scheduledDate),
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
            showToast.success("Cập nhật lịch kiểm tra sức khỏe thành công");
          }
        } else {
          const payload = prepareVaccinationCampaignData(data);
          const success = await FecthUpdateVaccinationCampaign(
            selectedEvent.id,
            payload
          );
          if (success) {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === selectedEvent.id
                  ? {
                    ...event,
                    title: data.name,
                    start: DateUtils.customFormatDate(data.startDate),
                    allDay: false,
                    extendedProps: {
                      ...event.extendedProps,
                      vaccineName: data.vaccineName || "",
                      vaccineType: data.vaccineType || "",
                      exp: DateUtils.customFormatDate(data.exp),
                      mfg: DateUtils.customFormatDate(data.mfg),
                      calendar: event.extendedProps.calendar,
                    },
                  }
                  : event
              )
            );
            showToast.success("Cập nhật chiến dịch tiêm chủng thành công");
          }
        }
      } else {
        // Create mode
        if (type === "medical") {
          const payload = prepareMedicalData(data);
          const response = await FecthCreateMedicalEvent(payload);
          setEvents((prev) => [
            ...prev,
            {
              id: response.id ?? "",
              title: response.name ?? "",
              start: DateUtils.customFormatDate(response.scheduledDate || new Date()),
              allDay: false,
              extendedProps: {
                calendar: response.status || "Pending",
                description: response.description || "",
                eventType: "medical",
                classIds: response.classIds?.length
                  ? (response.classIds as [string])
                  : ([""] as [string]),
              },
            },
          ]);
          showToast.success("Tạo lịch kiểm tra sức khỏe thành công");
        } else {
          const payload = prepareVaccinationCampaignData(data);
          const response = await FecthCreateVaccinationCampaign(payload);
          setEvents((prev) => [
            ...prev,
            {
              id: response.id ?? "",
              title: response.name ?? "",
              start: DateUtils.customFormatDate(response.startDate || new Date()),
              allDay: false,
              extendedProps: {
                calendar: response.status || "Pending",
                vaccineName: response.vaccineName || "",
                vaccineType: response.vaccineType || "",
                exp: DateUtils.customFormatDate(response.exp || new Date()),
                mfg: DateUtils.customFormatDate(response.mfg || new Date()),
                eventType: "vaccination",
                classIds: response.classIds?.length
                  ? (response.classIds as [string])
                  : ([""] as [string]),
              },
            },
          ]);
          showToast.success("Tạo chiến dịch tiêm chủng thành công");
        }
      }
      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
      showToast.error(`Không thể lưu sự kiện: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [formData, selectedEvent, closeModal, loading, validateFormData]);

  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent || selectedEvent.extendedProps.calendar !== "Pending") {
      showToast.error("Không thể xóa sự kiện này");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const success =
        selectedEvent.extendedProps.eventType === "medical"
          ? await FecthDeleteMedicalEvents(selectedEvent.id)
          : await FecthDeleteVaccinationCampaign(selectedEvent.id);
      if (success) {
        setEvents((prev) =>
          prev.filter((event) => event.id !== selectedEvent.id)
        );
        showToast.success("Xóa sự kiện thành công");
      }
      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
      showToast.error(`Không thể xóa sự kiện: ${errorMessage}`);
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
    const medicalData =
      formData.type === "medical"
        ? (formData.data as MedicalEventUpdateCreateViewModel)
        : null;
    if (!medicalData) return null;

    const handleClassChange = (classIds: string[]) => {
      // Clear class validation error when user selects classes
      if (validationErrors.classes) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.classes;
          return newErrors;
        });
      }
      
      setSelectedClasses(classIds);
      handleMedicalInputChange(
        "classIds",
        classIds.length > 0
          ? (classIds as unknown as string)
          : ([""] as unknown as string)
      );
    };

    return (
      <MedicalEventForm
        medicalData={medicalData}
        classOptions={classOptions}
        selectedClasses={selectedClasses}
        onInputChange={
          handleMedicalInputChange as (
            field: keyof MedicalEventUpdateCreateViewModel,
            value: string | Date | string[]
          ) => void
        }
        onClassChange={handleClassChange}
        validationErrors={validationErrors}
      />
    );
  }, [
    formData,
    handleMedicalInputChange,
    classOptions,
    selectedClasses,
    validationErrors,
  ]);

  const VaccinationCampaignFormComponent = useMemo(() => {
    const vaccinationData =
      formData.type === "vaccination"
        ? (formData.data as VaccinationCampaignsUpdateCreateViewModel)
        : null;
    if (!vaccinationData) return null;

    const handleClassChange = (classIds: string[]) => {
      // Clear class validation error when user selects classes
      if (validationErrors.classes) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.classes;
          return newErrors;
        });
      }
      
      setSelectedClasses(classIds);
      handleVaccinationInputChange(
        "classIds",
        classIds.length > 0
          ? (classIds as unknown as string)
          : ([""] as unknown as string)
      );
    };

    return (
      <VaccinationCampaignForm
        vaccinationData={vaccinationData}
        classOptions={classOptions}
        selectedClasses={selectedClasses}
        onInputChange={
          handleVaccinationInputChange as (
            field: keyof VaccinationCampaignsUpdateCreateViewModel,
            value: string | Date | string[]
          ) => void
        }
        onClassChange={handleClassChange}
        validationErrors={validationErrors}
      />
    );
  }, [
    formData,
    handleVaccinationInputChange,
    classOptions,
    selectedClasses,
    validationErrors,
  ]);

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
  }, [
    viewEventsDate,
    classOptions,
    events,
    loading,
    handleEventClick,
    closeModal,
  ]);

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
  }, [
    selectedDate,
    events,
    loading,
    handleEventClick,
    openModal,
    classOptions,
  ]);

  const isFormValid = useMemo(() => {
    if (selectedEvent) {
      return true;
    }
    const { type, data } = formData;

    // Check if at least one class is selected (not empty)
    const hasValidClasses = selectedClasses && selectedClasses.length > 0 && 
      !(selectedClasses.length === 1 && selectedClasses[0] === "");

    if (type === "medical") {
      return (
        data.name?.trim() &&
        data.description?.trim() &&
        data.scheduledDate &&
        hasValidClasses
      );
    } else if (type === "vaccination") {
      return (
        data.name?.trim() &&
        data.vaccineName?.trim() &&
        data.vaccineType?.trim() &&
        data.startDate &&
        data.exp &&
        data.mfg &&
        hasValidClasses
      );
    }

    return false;
  }, [formData, selectedClasses, selectedEvent]);

  const eventTypeOptions: Option[] = useMemo(
    () => [
      { value: "medical", label: "Kiểm tra sức khỏe" },
      { value: "vaccination", label: "Chiến dịch tiêm chủng" },
    ],
    []
  );

  const handleEventTypeChange = useCallback((value: string) => {
    setSelectedClasses([]);
    setFormData(
      value === "medical"
        ? {
          type: "medical",
          data: {
            name: "",
            description: "",
            scheduledDate: DateUtils.customFormatDateForBackend(new Date()),
            classIds: [""],
          },
        }
        : {
          type: "vaccination",
          data: {
            name: "",
            vaccineName: "",
            exp: DateUtils.customFormatDateForBackend(new Date()),
            mfg: DateUtils.customFormatDateForBackend(new Date()),
            vaccineType: "",
            startDate: DateUtils.customFormatDateForBackend(new Date()),
            classIds: [""],
          },
        }
    );
  }, []);

  return (
    <div className="p-4">
      <PageHeader
        title="Lịch kiểm tra sức khỏe và tiêm chủng"
        icon={<CalendarDays className="w-6 h-6 text-purple-600" />}
        description="Quản lý và theo dõi các hoạt động kiểm tra sức khỏe và tiêm chủng trong trường"
      />
      {loading && !events.length ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div
            role="alert"
            className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-red-600 mb-4">{error}</p>
            {error.includes("authenticated") ? (
              <button
                onClick={() => (window.location.href = "/login")}
                aria-label="Đăng nhập để xem sự kiện"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Đăng nhập
              </button>
            ) : (
              <button
                onClick={fetchEvents}
                aria-label="Thử lại"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
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
                setSelectedDate(DateUtils.customFormatDateOnly(new Date()));
              }}
            />

            <div className="lg:w-1/3">{DailyScheduleComponent}</div>
          </div>

          <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className={`${formData.type === "medical" ? "" : "max-w-3xl"} 
          max-w-lg w-full p-6 bg-white rounded-lg shadow-lg`}
          >
            {viewEventsDate ? (
              ViewEventsModalComponent
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
                </h3>
                <div className="mb-4">
                  <Label className="block text-sm font-semibold text-gray-700 mb-1">
                    Loại sự kiện *
                  </Label>
                  <Select
                    options={eventTypeOptions}
                    placeholder="Chọn loại sự kiện"
                    onChange={handleEventTypeChange}
                    defaultValue={formData.type}
                    disabled={selectedEvent !== null}
                  />
                </div>
                {formData.type === "medical"
                  ? MedicalEventFormComponent
                  : VaccinationCampaignFormComponent}
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
                        Xóa sự kiện
                      </button>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddOrUpdateEvent}
                      disabled={loading || !isFormValid}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedEvent ? "Cập nhật" : "Tạo mới"}
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
