import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { eventCategories } from "@/types/CalendarEvent";
import PageHeader from "@/components/ui/PageHeader";
import { MedicalHealthCheckupRecord } from "@/types/MedicalRecord";
import {
  ConselingSchedulesAND,
  ConselingSchedules,
  ConselingSchedulesANDUpdate,
} from "@/types/ConselingSchedules";
import {
  FecthMedicalHealthCheckupRecordAbnormal,
  FecthConselingSchedules,
  FecthUpdateConselingSchedules,
} from "@/services/MedicalRecordService";
import { FecthCreateConselingSchedule } from "@/services/HealthProfileService";
import { DateUtils } from "@/utils/DateUtils";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import DatePicker from "@/components/ui/form/DateField";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/Toast";
import { Tooltip } from "@material-tailwind/react";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

const CalendarDay: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abnormal students state
  const [abnormalStudents, setAbnormalStudents] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [sentStudents, setSentStudents] = useState<ConselingSchedulesAND[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Manager counseling schedules state
  const [conselingSchedules, setConselingSchedules] = useState<
    ConselingSchedulesAND[]
  >([]);
  const [filteredSchedules, setFilteredSchedules] = useState<
    ConselingSchedulesAND[]
  >([]);

  const [selectedScheduleItem, setSelectedScheduleItem] =
    useState<ConselingSchedulesAND | null>(null);
  const [scheduleFormData, setScheduleFormData] =
    useState<ConselingSchedulesANDUpdate>({
      conselingScheduleId: "",
      scheduledTime: "",
    });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Filter states for schedules
  const [scheduleSearchQuery, setScheduleSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Tab state
  const [activeTab, setActiveTab] = useState<"abnormal" | "schedules">(
    "abnormal"
  );

  // Additional state for abnormal students modal
  const [selectedStudent, setSelectedStudent] =
    useState<MedicalHealthCheckupRecord | null>(null);
  const [formData, setFormData] = useState<ConselingSchedules>({
    studentId: "",
    healthCheckupId: "",
    note: "",
    requestedDate: "",
  });
  const [consultDate, setConsultDate] = useState<string>("");
  const [consultTime, setConsultTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update modal date/time states
  const [updateDate, setUpdateDate] = useState<string>("");
  const [updateTime, setUpdateTime] = useState<string>("");

  // Fetch abnormal students data
  const fetchAbnormalStudents = async () => {
    try {
      setIsLoading(true);
      const [abnormalData, sentData] = await Promise.all([
        FecthMedicalHealthCheckupRecordAbnormal(),
        FecthConselingSchedules(),
      ]);
      setAbnormalStudents(abnormalData);
      setSentStudents(sentData);
    } catch (error) {
      console.error("Error fetching abnormal students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openConsultModal = (student: MedicalHealthCheckupRecord) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      healthCheckupId: student.healthCheckUpId || "",
      note: "",
      requestedDate: "",
    });
    setConsultDate("");
    setConsultTime("");
    setIsModalOpen(true);
  };

  const closeConsultModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormData({
      studentId: "",
      healthCheckupId: "",
      note: "",
      requestedDate: "",
    });
    setConsultDate("");
    setConsultTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if selected time is still available
    if (consultTime && isTimeSlotOccupied(consultTime, selectedDate)) {
      showToast.error(
        "Thời gian đã chọn không còn trống. Vui lòng chọn thời gian khác!"
      );
      return;
    }

    // Combine date and time
    let requestDate = "";
    if (consultDate && consultTime) {
      const combinedDateTime = new Date(`${consultDate}T${consultTime}`);
      requestDate = DateUtils.customFormatDateForBackend(combinedDateTime);
    }
    if (!formData.studentId || !formData.healthCheckupId || !requestDate) {
      showToast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        studentId: formData.studentId,
        healthCheckupId: formData.healthCheckupId,
        note: formData.note,
        requestedDate: requestDate,
      } as ConselingSchedules;
      console.log("data", data);
      await FecthCreateConselingSchedule(data);
      showToast.success("Đặt lịch tư vấn thành công!");
      await fetchConselingSchedules();
      closeConsultModal();
    } catch (err) {
      showToast.error("Đặt lịch tư vấn thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Filter abnormal students
  const filteredStudents = useMemo(() => {
    return abnormalStudents.filter((student) => {
      // Exclude students who already have counseling scheduled
      const isSent = sentStudents.some(
        (sent) => sent.healthCheckupId === student.healthCheckUpId
      );
      if (isSent) return false;

      const matchName = student.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchName;
    });
  }, [abnormalStudents, sentStudents, searchTerm]);

  // Get events for selected date (including counseling schedules)
  const getEventsForDate = useCallback(
    (date: Date) => {
      const dateStr = DateUtils.customFormatDateOnly(date);

      // Get regular events
      const regularEvents = events.filter(
        (event: any) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      );

      // Get counseling schedules for this date
      const counselingEvents = conselingSchedules
        .filter((schedule) => {
          const scheduleDate = DateUtils.customFormatDateOnly(
            schedule.meetingDate
          );
          return (
            scheduleDate === dateStr &&
            (schedule.status === "Approved" ||
              schedule.status === "Pending" ||
              schedule.status === "Rejected")
          );
        })
        .map((schedule) => {
          // Extract time in HH:mm format directly from the meeting date
          const timeStr = DateUtils.customFormatTime(schedule.meetingDate);

          return {
            id: `counseling-${schedule.id}`,
            title: `Tư vấn: ${schedule.studentName}`,
            time: timeStr,
            type: "counseling",
            status: schedule.status,
            data: schedule,
          };
        });

      return [...regularEvents, ...counselingEvents];
    },
    [events, conselingSchedules]
  );

  // Check if a time slot is occupied
  const isTimeSlotOccupied = useCallback(
    (time: string, date: Date) => {
      const eventsForDate = getEventsForDate(date);
      return eventsForDate.some((event: any) => event.time === time);
    },
    [getEventsForDate]
  );

  // Sync currentMonth with selectedDate when selectedDate changes
  useEffect(() => {
    if (
      selectedDate.getMonth() !== currentMonth.getMonth() ||
      selectedDate.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      );
    }
  }, [selectedDate]);

  // Fetch counseling schedules
  const fetchConselingSchedules = useCallback(async () => {
    try {
      const data = await FecthConselingSchedules();
      setConselingSchedules(data);
      setSentStudents(data); // Update sent students as well
    } catch (error) {
      console.error("Error fetching counseling schedules:", error);
    }
  }, []);

  // Handle schedule item click
  const handleScheduleItemClick = (item: ConselingSchedulesAND) => {
    setSelectedScheduleItem(item);

    // Parse existing meeting date to set initial values
    const meetingDate = new Date(item.meetingDate);
    const dateStr = DateUtils.customFormatDateOnly(meetingDate);
    const timeStr = DateUtils.customFormatTime(meetingDate);

    // Set separate date and time states
    setUpdateDate(dateStr);
    setUpdateTime(timeStr);

    // Also set the combined datetime for backward compatibility
    const year = meetingDate.getFullYear();
    const month = String(meetingDate.getMonth() + 1).padStart(2, "0");
    const day = String(meetingDate.getDate()).padStart(2, "0");
    const hours = String(meetingDate.getHours()).padStart(2, "0");
    const minutes = String(meetingDate.getMinutes()).padStart(2, "0");
    const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;

    setScheduleFormData({
      conselingScheduleId: item.id,
      scheduledTime: datetimeLocal,
    });
    setIsScheduleModalOpen(true);
  };

  // Handle schedule modal close
  const handleScheduleModalClose = () => {
    setIsScheduleModalOpen(false);
    setSelectedScheduleItem(null);
    setUpdateDate("");
    setUpdateTime("");
  };

  // Handle schedule form submit
  const handleScheduleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (!scheduleFormData.conselingScheduleId) {
          showToast.error("Vui lòng chọn lịch tư vấn!");
          return;
        }

        if (!updateDate || !updateTime) {
          showToast.error("Vui lòng chọn ngày và thời gian tư vấn!");
          return;
        }

        // Check if selected time is still available (excluding current schedule)
        const selectedDateTime = new Date(`${updateDate}T${updateTime}`);
        if (updateTime && isTimeSlotOccupied(updateTime, selectedDateTime)) {
          // Check if it's not the same schedule being updated
          const existingEvents = getEventsForDate(selectedDateTime).filter(
            (event: any) =>
              event.time === updateTime && event.type === "counseling"
          );
          const isCurrentSchedule = existingEvents.some(
            (event: any) =>
              event.data.id === scheduleFormData.conselingScheduleId
          );

          if (!isCurrentSchedule) {
            showToast.error(
              "Thời gian đã chọn không còn trống. Vui lòng chọn thời gian khác!"
            );
            return;
          }
        }

        // Combine date and time
        const combinedDateTime = new Date(`${updateDate}T${updateTime}`);
        if (isNaN(combinedDateTime.getTime())) {
          showToast.error("Thời gian không hợp lệ!");
          return;
        }

        const formattedData = {
          conselingScheduleId: scheduleFormData.conselingScheduleId,
          scheduledTime: DateUtils.customFormatDateForBackend(combinedDateTime),
        };
        await FecthUpdateConselingSchedules(formattedData);
        showToast.success("Cập nhật lịch tư vấn thành công!");
        setIsScheduleModalOpen(false);
        fetchConselingSchedules();
      } catch (error: any) {
        console.error("Error submitting form:", error);
        if (error.response?.data) {
          showToast.error(
            error.response.data.message || "Cập nhật lịch tư vấn thất bại!"
          );
        } else {
          showToast.error("Cập nhật lịch tư vấn thất bại!");
        }
      }
    },
    [
      scheduleFormData,
      updateDate,
      updateTime,
      isTimeSlotOccupied,
      getEventsForDate,
    ]
  );

  // Filter counseling schedules
  useEffect(() => {
    let filtered = [...conselingSchedules];

    // Apply search filter
    if (scheduleSearchQuery) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.studentName
            .toLowerCase()
            .includes(scheduleSearchQuery.toLowerCase()) ||
          schedule.parentName
            .toLowerCase()
            .includes(scheduleSearchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (schedule) => schedule.status === selectedStatus
      );
    }

    // Apply sorting (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.meetingDate).getTime();
      const dateB = new Date(b.meetingDate).getTime();
      return dateB - dateA;
    });

    setFilteredSchedules(filtered);
  }, [conselingSchedules, scheduleSearchQuery, selectedStatus]);

  // Fetch data on component mount
  useEffect(() => {
    fetchAbnormalStudents();
    fetchConselingSchedules();
  }, []);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const isToday =
        date === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();
      const isSelected =
        date === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
      });
    }

    // Next month's leading days
    const remainingSlots = 42 - days.length;
    for (let date = 1; date <= remainingSlots; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }

    return days;
  };

  const timeSlots = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  // Get available time slots for selected date
  const getAvailableTimeSlots = useCallback(() => {
    return timeSlots.filter((time) => !isTimeSlotOccupied(time, selectedDate));
  }, [selectedDate, isTimeSlotOccupied]);

  // Get available time slots for update date
  const getAvailableTimeSlotsForUpdate = useCallback(() => {
    if (!updateDate) return timeSlots;
    const updateDateTime = new Date(updateDate);
    return timeSlots.filter((time) => {
      // Check if time slot is occupied
      const isOccupied = isTimeSlotOccupied(time, updateDateTime);
      if (!isOccupied) return true;

      // If occupied, check if it's the current schedule being updated
      const existingEvents = getEventsForDate(updateDateTime).filter(
        (event: any) => event.time === time && event.type === "counseling"
      );
      const isCurrentSchedule = existingEvents.some(
        (event: any) => event.data.id === scheduleFormData.conselingScheduleId
      );

      return isCurrentSchedule; // Allow if it's the same schedule
    });
  }, [
    updateDate,
    isTimeSlotOccupied,
    getEventsForDate,
    scheduleFormData.conselingScheduleId,
  ]);

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate.getTime() - 86400000);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate.getTime() + 86400000);
    setSelectedDate(nextDay);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai",
  ];
  const dayNames = [
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
    "Chủ Nhật",
  ];

  return (
    <div>
      <PageHeader
        title="Lịch tư vấn"
        icon={<CalendarDays className="w-6 h-6 mt-2 text-blue-600" />}
        description="Quản lý và theo dõi các hoạt động tư vấn sức khỏe đối với các học sinh bất thường"
      />

      <div className="flex flex-col lg:flex-row h-100vh bg-gray-50 w-full gap-4 mb-3">
        {/* Main Calendar Area */}
        <div className="flex-1 lg:w-[70%] shadow-lg rounded-lg bg-white overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {`${selectedDate.getDate()} ${
                    monthNames[selectedDate.getMonth()]
                  } ${selectedDate.getFullYear()}`}
                </h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {
                    dayNames[
                      selectedDate.getDay() === 0 ? 6 : selectedDate.getDay()
                    ]
                  }
                </span>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-3 mb-3 sm:mb-0">
                {/* Regular Event Categories */}
                {Object.entries(eventCategories).map(([key, category]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm text-gray-700 font-medium">
                      {category.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={handlePrevDay}
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="px-3 py-2 text-sm text-gray-700 border-x border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Hôm nay
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={handleNextDay}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Time Schedule */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="relative">
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-20 text-sm text-gray-600 text-right pr-4 py-4 font-medium bg-gray-50 border-r border-gray-200">
                      {time}
                    </div>
                    <div className="flex-1 min-h-[60px] relative p-2">
                      {(() => {
                        // Get all events for this time slot
                        const eventsForTimeSlot = getEventsForDate(
                          selectedDate
                        ).filter((event: any) => event.time === time);

                        // Also check for counseling schedules that match this exact time
                        const counselingForTimeSlot = conselingSchedules.filter(
                          (schedule) => {
                            const scheduleDate = DateUtils.customFormatDateOnly(
                              schedule.meetingDate
                            );
                            const selectedDateStr =
                              DateUtils.customFormatDateOnly(selectedDate);
                            const scheduleTime = DateUtils.customFormatTime(
                              schedule.meetingDate
                            );

                            return (
                              scheduleDate === selectedDateStr &&
                              scheduleTime === time &&
                              (schedule.status === "Approved" ||
                                schedule.status === "Pending" ||
                                schedule.status === "Rejected")
                            );
                          }
                        );

                        // Combine both event sources
                        const allEvents = [
                          ...eventsForTimeSlot,
                          ...counselingForTimeSlot.map((schedule) => ({
                            id: `counseling-${schedule.id}`,
                            title: `Tư vấn: ${schedule.studentName}`,
                            time: time,
                            type: "counseling",
                            status: schedule.status,
                            data: schedule,
                          })),
                        ];

                        // Remove duplicates based on ID
                        const uniqueEvents = allEvents.filter(
                          (event, index, self) =>
                            index === self.findIndex((e) => e.id === event.id)
                        );

                        if (uniqueEvents.length === 0) {
                          return (
                            <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                              Trống
                            </div>
                          );
                        }

                        return uniqueEvents.map((event: any, idx: number) => {
                          // Create detailed tooltip content
                          const tooltipContent =
                            event.type === "counseling" ? (
                              <div className="p-2 max-w-xs">
                                <div className="font-semibold text-white mb-2">
                                  Chi tiết lịch tư vấn
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <strong>Học sinh:</strong>{" "}
                                    {event.data.studentName}
                                  </div>
                                  <div>
                                    <strong>Phụ huynh:</strong>{" "}
                                    {event.data.parentName}
                                  </div>
                                  <div>
                                    <strong>Thời gian:</strong>{" "}
                                    {DateUtils.customFormatDate(
                                      event.data.meetingDate
                                    )}
                                  </div>
                                  <div>
                                    <strong>Trạng thái:</strong>{" "}
                                    {event.status === "Pending"
                                      ? "Chờ duyệt"
                                      : event.status === "Approved"
                                      ? "Đã duyệt"
                                      : "Từ chối"}
                                  </div>
                                  {event.data.note && (
                                    <div>
                                      <strong>Ghi chú của nhà trường:</strong>{" "}
                                      {event.data.note}
                                    </div>
                                  )}
                                  {event.data.parentRejectNote && (
                                    <div>
                                      <strong>Ghi chú của phụ huynh:</strong>{" "}
                                      {event.data.parentRejectNote}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-300 mt-2">
                                    Nhấn để chỉnh sửa
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2">
                                <div className="font-semibold text-white mb-1">
                                  Sự kiện
                                </div>
                                <div className="text-sm">
                                  <div>
                                    <strong>Tiêu đề:</strong> {event.title}
                                  </div>
                                  <div>
                                    <strong>Thời gian:</strong> {event.time}
                                  </div>
                                </div>
                              </div>
                            );

                          return (
                            <Tooltip
                              key={event.id || idx}
                              content={tooltipContent}
                              placement="top"
                              className="bg-gray-800 text-white shadow-lg rounded-lg border-0"
                            >
                              <div
                                className={`absolute left-2 top-2 right-2 bottom-2 p-2 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                                  event.type === "counseling"
                                    ? event.status === "Pending"
                                      ? "bg-yellow-100 border-l-4 border-yellow-600"
                                      : event.status === "Rejected"
                                      ? "bg-red-100 border-l-4 border-red-600"
                                      : "bg-green-100 border-l-4 border-green-600"
                                    : "bg-blue-100 border-l-4 border-blue-600"
                                }`}
                                onClick={() => {
                                  if (event.type === "counseling") {
                                    handleScheduleItemClick(event.data);
                                  }
                                }}
                              >
                                <div
                                  className={`font-medium text-sm text-center text-gray-500`}
                                >
                                  {event.title}
                                </div>
                              </div>
                            </Tooltip>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[30%] lg:min-w-[300px] shadow-lg rounded-lg bg-white overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Mini Calendar */}
            <div className="p-4 border-b border-gray-200">
              {/* Mini Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="font-semibold text-gray-900">
                  {`${
                    monthNames[currentMonth.getMonth()]
                  } ${currentMonth.getFullYear()}`}
                </h3>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Mini Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        const newSelectedDate = new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day.date
                        );
                        setSelectedDate(newSelectedDate);
                      }
                    }}
                    className={`
                      text-center text-sm py-2 rounded-lg transition-all duration-200 font-medium
                      ${
                        day.isCurrentMonth
                          ? day.isToday
                            ? "bg-blue-600 text-white"
                            : day.isSelected
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-900 hover:bg-gray-100"
                          : "text-gray-400 hover:text-gray-500"
                      }
                    `}
                  >
                    {day.date}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("abnormal")}
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                    activeTab === "abnormal"
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Danh sách học sinh bất thường</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-hidden">
              {activeTab === "abnormal" ? (
                <>
                  {/* Search for Abnormal Students */}
                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm học sinh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Search for Counseling Schedules */}
                  <div className="mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm lịch tư vấn..."
                        value={scheduleSearchQuery}
                        onChange={(e) => setScheduleSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      {scheduleSearchQuery && (
                        <button
                          onClick={() => setScheduleSearchQuery("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="mb-3">
                    <Select
                      options={[
                        { value: "all", label: "Tất cả trạng thái" },
                        { value: "Pending", label: "Chờ duyệt" },
                        { value: "Approved", label: "Đã duyệt" },
                        { value: "Rejected", label: "Từ chối" },
                      ]}
                      defaultValue={selectedStatus}
                      onChange={(value) => setSelectedStatus(value)}
                      className="w-full text-sm"
                      placeholder="Chọn trạng thái"
                    />
                  </div>
                </>
              )}

              {/* Content Area */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                {activeTab === "abnormal" ? (
                  // Abnormal Students Content
                  isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-sm">
                        {searchTerm
                          ? "Không tìm thấy học sinh nào"
                          : "Không có học sinh bất thường"}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredStudents.slice(0, 8).map((student) => {
                        const studentTooltipContent = (
                          <div className="p-2 max-w-sm">
                            <div className="font-semibold text-white mb-2">
                              Thông tin sức khỏe bất thường
                            </div>
                            <div className="space-y-1 text-sm">
                              <div>
                                <strong>Học sinh:</strong> {student.studentName}
                              </div>
                              <div>
                                <strong>ID:</strong> #{student.studentId}
                              </div>
                              <div>
                                <strong>Ngày khám:</strong>{" "}
                                {DateUtils.customFormatDate(student.recordDate)}
                              </div>
                              <div>
                                <strong>BMI:</strong> {student.bmi}
                              </div>
                              <div>
                                <strong>Thị lực:</strong> {student.vision}
                              </div>
                              <div>
                                <strong>Thính lực:</strong> {student.hearing}
                              </div>
                              <div>
                                <strong>Răng miệng:</strong> {student.dental}
                              </div>
                              {student.abnormalNote && (
                                <div>
                                  <strong>Ghi chú bất thường:</strong>{" "}
                                  {student.abnormalNote}
                                </div>
                              )}
                              <div className="text-xs text-gray-300 mt-2">
                                Nhấn để tạo lịch tư vấn
                              </div>
                            </div>
                          </div>
                        );

                        return (
                          <Tooltip
                            key={student.healthCheckUpId || student.studentId}
                            content={studentTooltipContent}
                            placement="left"
                            className="bg-gray-800 text-white shadow-lg rounded-lg border-0"
                          >
                            <div
                              onClick={() => openConsultModal(student)}
                              className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <div className="font-medium text-red-900 text-sm mb-1">
                                {student.studentName}
                              </div>
                              <div className="text-xs text-red-700 mb-2 line-clamp-2">
                                {student.abnormalNote || "Không có ghi chú"}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  BMI: {student.bmi}
                                </span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  TL: {student.vision}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {DateUtils.customFormatDateOnly(
                                  student.recordDate
                                )}
                              </div>
                            </div>
                          </Tooltip>
                        );
                      })}
                      {filteredStudents.length > 8 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-500">
                            Và {filteredStudents.length - 8} học sinh khác...
                          </span>
                        </div>
                      )}
                    </div>
                  )
                ) : // Counseling Schedules Content
                isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">
                      {scheduleSearchQuery || selectedStatus !== "all"
                        ? "Không tìm thấy lịch tư vấn nào"
                        : "Không có lịch tư vấn nào"}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSchedules.slice(0, 6).map((schedule) => {
                      const sidebarTooltipContent = (
                        <div className="p-2 max-w-sm">
                          <div className="font-semibold text-white mb-2">
                            Thông tin chi tiết
                          </div>
                          <div className="space-y-1 text-sm">
                            <div>
                              <strong>Học sinh:</strong> {schedule.studentName}
                            </div>
                            <div>
                              <strong>Phụ huynh:</strong> {schedule.parentName}
                            </div>
                            <div>
                              <strong>ID:</strong> #{schedule.id}
                            </div>
                            <div>
                              <strong>Ngày hẹn:</strong>{" "}
                              {DateUtils.customFormatDate(schedule.meetingDate)}
                            </div>
                            <div>
                              <strong>Trạng thái:</strong>{" "}
                              {schedule.status === "Pending"
                                ? "Chờ duyệt"
                                : schedule.status === "Approved"
                                ? "Đã duyệt"
                                : "Từ chối"}
                            </div>
                            {schedule.note && (
                              <div>
                                <strong>Ghi chú:</strong> {schedule.note}
                              </div>
                            )}
                            <div className="text-xs text-gray-300 mt-2">
                              Nhấn để chỉnh sửa thời gian
                            </div>
                          </div>
                        </div>
                      );

                      return (
                        <Tooltip
                          key={schedule.id}
                          content={sidebarTooltipContent}
                          placement="left"
                          className="bg-gray-800 text-white shadow-lg rounded-lg border-0"
                        >
                          <div
                            onClick={() => handleScheduleItemClick(schedule)}
                            className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium text-gray-900 text-sm">
                                {schedule.studentName}
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium text-gray-500`}
                              >
                                {schedule.status === "Pending"
                                  ? "Chờ duyệt"
                                  : schedule.status === "Approved"
                                  ? "Đã duyệt"
                                  : "Từ chối"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              <UserIcon className="w-3 h-3 inline mr-1" />
                              {schedule.parentName}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              <CalendarIcon className="w-3 h-3 inline mr-1" />
                              {DateUtils.customFormatDateOnly(
                                schedule.meetingDate
                              )}
                            </div>
                            {schedule.note && (
                              <div className="text-xs text-gray-500 line-clamp-2">
                                {schedule.note}
                              </div>
                            )}
                          </div>
                        </Tooltip>
                      );
                    })}
                    {filteredSchedules.length > 6 && (
                      <div className="text-center py-2">
                        <span className="text-xs text-gray-500">
                          Và {filteredSchedules.length - 6} lịch khác...
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeConsultModal}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-xl w-full"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Tư vấn cho học sinh
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Học sinh
              </Label>
              <div className="text-gray-900 font-medium">
                {selectedStudent?.studentName}
              </div>
            </div>
            <div>
              <Label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="note"
              >
                Ghi chú tư vấn
              </Label>
              <textarea
                id="note"
                className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="note"
                placeholder="Nhập mô tả về tư vấn..."
                value={formData.note}
                onChange={handleTextAreaChange}
              />
            </div>
            <div className="flex gap-5 justify-between">
              <div>
                <DatePicker
                  id="date-picker"
                  minDate={DateUtils.customFormatDateOnly(new Date())}
                  maxDate="9999-12-31"
                  label="Ngày tư vấn"
                  placeholder="Select a date"
                  defaultDate={consultDate ? new Date(consultDate) : undefined}
                  onChange={(dates, currentDateString) => {
                    console.log(dates);
                    setConsultDate(currentDateString);
                  }}
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian tư vấn
                </Label>
                <select
                  className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={consultTime}
                  onChange={(e) => setConsultTime(e.target.value)}
                  required
                >
                  <option value="">Chọn thời gian</option>
                  {getAvailableTimeSlots().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {getAvailableTimeSlots().length === 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        Không có thời gian trống trong ngày này. Vui lòng chọn
                        ngày khác.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={closeConsultModal}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || getAvailableTimeSlots().length === 0}
              >
                {isSubmitting ? "Đang gửi..." : "Đặt lịch tư vấn"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Counseling Schedule Management Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={handleScheduleModalClose}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-md w-full"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Cập nhật lịch tư vấn
            </h2>
            {selectedScheduleItem && (
              <div className="space-y-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Học sinh
                  </Label>
                  <p className="text-gray-900 font-medium">
                    {selectedScheduleItem.studentName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Phụ huynh
                  </Label>
                  <p className="text-gray-900 font-medium">
                    {selectedScheduleItem.parentName}
                  </p>
                </div>
                <div className="flex gap-5 justify-between">
                  <div>
                    <DatePicker
                      id="update-date-picker"
                      minDate={DateUtils.customFormatDateOnly(new Date())}
                      maxDate="9999-12-31"
                      label="Ngày tư vấn"
                      placeholder="Chọn ngày"
                      defaultDate={
                        updateDate ? new Date(updateDate) : undefined
                      }
                      onChange={(_, currentDateString) => {
                        setUpdateDate(currentDateString);
                        // Reset time when date changes
                        setUpdateTime("");
                      }}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian tư vấn
                    </Label>
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={updateTime}
                      onChange={(e) => setUpdateTime(e.target.value)}
                      required
                    >
                      <option value="">Chọn thời gian</option>
                      {getAvailableTimeSlotsForUpdate().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {updateDate &&
                      getAvailableTimeSlotsForUpdate().length === 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-700">
                              Không có thời gian trống trong ngày này. Vui lòng
                              chọn ngày khác.
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Warning when cannot update */}
                {selectedScheduleItem?.status !== "Pending" && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700">
                        {selectedScheduleItem?.status === "Approved"
                          ? "Lịch tư vấn đã được duyệt, không thể cập nhật."
                          : "Lịch tư vấn đã bị từ chối, không thể cập nhật."}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    type="button"
                    onClick={handleScheduleModalClose}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      selectedScheduleItem?.status !== "Pending" ||
                      (!!updateDate &&
                        getAvailableTimeSlotsForUpdate().length === 0)
                    }
                    className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarDay;
