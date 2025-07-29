import { CalendarEvent, eventCategories } from "@/types/CalendarEvent";
import { DateUtils } from "@/utils/DateUtils";
import { MedicalEventUpdateCreateViewModel } from "@/types/MedicalEvent";
import { VaccinationCampaignsUpdateCreateViewModel } from "@/types/VaccinationCampaigns";
import { showToast } from "../ui/Toast";
import { Search, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface DailyScheduleProps {
  selectedDate: string | null;
  events: CalendarEvent[];
  loading: boolean;
  onEventClick: (event: CalendarEvent) => void;
  onOpenModal: () => void;
  onSetFormData: (formData: FormDataType | ((prev: FormDataType) => FormDataType)) => void;
  classOptions: { value: string; label: string }[];
  isAdmin?: boolean;
  onDateSearch?: (date: string) => void;
}
type FormDataType =
  | { type: "medical"; data: MedicalEventUpdateCreateViewModel }
  | { type: "vaccination"; data: VaccinationCampaignsUpdateCreateViewModel };

const DailySchedule = ({
  selectedDate,
  events,
  loading,
  onEventClick,
  onOpenModal,
  onSetFormData,
  classOptions,
  isAdmin = false,
  onDateSearch
}: DailyScheduleProps) => {
  const [searchDate, setSearchDate] = useState(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });

  // Sync searchDate with selectedDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      // Convert selectedDate to YYYY-MM-DD format for date input
      const date = new Date(selectedDate);
      const formattedDate = date.toISOString().split('T')[0];
      setSearchDate(formattedDate);
    }
  }, [selectedDate]);

  if (!selectedDate) return null;

  const handleDateSearch = () => {
    if (onDateSearch && searchDate) {
      // Convert YYYY-MM-DD to the format used by the app
      const date = new Date(searchDate);
      const formattedDate = DateUtils.customFormatDate(date);
      onDateSearch(formattedDate);
    }
  };

  const eventsForDate = events
    .filter(event => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      const targetDate = new Date(selectedDate);

      // Set time to 00:00:00 for date comparison only
      eventStartDate.setHours(0, 0, 0, 0);
      eventEndDate.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      // Check if target date is within the event's date range (inclusive)
      return targetDate >= eventStartDate && targetDate <= eventEndDate;
    })
    .slice()
    .sort((a, b) => {
      const statusPriority = { Approved: 3, Pending: 2, Rejected: 1 };
      const priorityA = statusPriority[a.extendedProps?.calendar] || 0;
      const priorityB = statusPriority[b.extendedProps?.calendar] || 0;

      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }

      // If same status, sort by time
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
  const handleAddEvent = () => {
    const selected = new Date(selectedDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selected < currentDate) {
      showToast.error("Không thể tạo sự kiện trong quá khứ!");
      return;
    }

    onSetFormData((prev) => {
      const newDate = new Date(selectedDate);
      newDate.setHours(9, 0);

      if (prev.type === "medical") {
        return {
          ...prev,
          data: {
            ...prev.data,
            scheduledDate: DateUtils.customFormatDateForBackend(newDate),
          } as MedicalEventUpdateCreateViewModel,
        };
      } else {
        return {
          ...prev,
          data: {
            ...prev.data,
            startDate: DateUtils.customFormatDateForBackend(newDate),
          } as VaccinationCampaignsUpdateCreateViewModel,
        };
      }
    });

    onOpenModal();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4">
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            Lịch cho {new Date(selectedDate).toLocaleDateString()}
          </h3>
          {!isAdmin && (
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              disabled={loading}
            >
              Thêm sự kiện
            </button>
          )}
        </div>

        {/* Date Search Section */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">Tìm theo ngày:</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleDateSearch}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center gap-1"
          >
            <Search className="w-4 h-4" />
            Tìm
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {eventsForDate.length > 0 ? (
          eventsForDate.map((event) => {
            const category = eventCategories[event.extendedProps.calendar];
            return (
              <div
                key={event.id}
                className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${category.lightColor} ${category.textColor} border-l-4 border-${category.color.split("-")[1]}-500`}
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between">
                  <div className="font-medium text-base">{event.title}</div>
                  <div>
                    <span className="text-xs">Loại: {event.extendedProps.eventType === "medical" ? "Kiểm tra sức khỏe" : "Chiến dịch tiêm chủng"}</span>
                  </div>
                </div>

                <div className="text-sm mt-1 ml-2">
                  {event.extendedProps.eventType === "medical"
                    ? event.extendedProps.description || "Không có mô tả"
                    : `Vaccine: ${event.extendedProps.vaccineName || "Không có tên vaccine"}`}
                </div>

                {event.extendedProps.eventType === "vaccination" && (
                  <div className="text-sm">
                    <div className="mt-1 ml-2">Loại vaccine: {event.extendedProps.vaccineType}</div>
                    <div className="mt-1 ml-2">Ngày sản xuất: {new Date(event.extendedProps.mfg!).toLocaleDateString()}</div>
                    <div className="mt-1 ml-2">Ngày hết hạn: {new Date(event.extendedProps.exp!).toLocaleDateString()}</div>
                    <div className="mt-1 ml-2">Ngày bắt đầu: {new Date(event.start).toLocaleDateString()}</div>
                    <div className="mt-1 ml-2">Ngày kết thúc: {new Date(event.end).toLocaleDateString()}</div>
                  </div>
                )}

                <div className="text-sm mt-1 ml-2">
                  <span>Thời gian:</span> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm mt-1 ml-2">
                  <span>Lớp: </span>
                  {(() => {
                    const validClassIds = event.extendedProps.classIds?.filter(id => id && id.trim() !== "") || [];
                    return validClassIds.length > 0 ? (
                      validClassIds.map((classId, index) => {
                        const classOption = classOptions.find(option => option.value === classId);
                        const className = classOption ? classOption.label : `Class ${classId}`;
                        return (
                          <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-2">
                            {className}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-gray-500">
                        Không có lớp nào
                      </span>
                    );
                  })()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-sm">Không có sự kiện nào cho ngày này.</div>
        )}
      </div>
    </div>
  );
};

export default DailySchedule;
