import { CalendarEvent, eventCategories } from "@/types/CalendarEvent";
import { DateUtils } from "@/utils/DateUtils";
import { Tooltip } from "@material-tailwind/react";
import { Button } from "../ui/button";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: string;
  events: CalendarEvent[];
  onDateSelect: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onViewMoreEvents: (date: string) => void;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onToday: () => void;
  classOptions: { value: string; label: string }[];
  isAdmin?: boolean;
  onDateView?: (date: string) => void;
}

const CalendarGrid = ({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onEventClick,
  onViewMoreEvents,
  onNavigateMonth,
  onToday,
  classOptions,
  isAdmin = false,
  onDateView,
}: CalendarGridProps) => {
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Helper: check if a date is within an event's range
  const isDateInEventRange = (date: Date, event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    // Normalize time for all-day events
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
  };

  // Modified: get all events that span this date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isDateInEventRange(date, event));
  };

  // Kiểm tra event có phải là ngày bắt đầu không
  const isEventStartDate = (event: CalendarEvent, date: Date) => {
    const start = new Date(event.start);
    return (
      DateUtils.customFormatDateOnly(start) ===
      DateUtils.customFormatDateOnly(date)
    );
  };

  return (
    <div className="lg:w-2/3 bg-white rounded-lg shadow-lg border-2 border-gray-200">
      {/* Calendar Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onNavigateMonth("prev")}
            className="p-2 hover:bg-gray-200 bg-gray-100 rounded-lg"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <h2 className="text-xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            onClick={() => onNavigateMonth("next")}
            className="p-2 hover:bg-gray-200 bg-gray-100 rounded-lg"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>

        {/* Legend */}
        <div className="flex gap-4">
          {Object.entries(eventCategories).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${category.color}`} />
              <span className="text-sm text-gray-900 font-bold">
                {category.label}
              </span>
            </div>
          ))}
        </div>

        <Button
          onClick={onToday}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Hôm nay
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 bg-gray-50">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-3 text-center font-semibold text-gray-700 border-b border-gray-200"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {getDaysInMonth(currentDate).map((date, index) => {
          const isPast =
            date &&
            new Date(DateUtils.customFormatDateOnly(date)) <
              new Date(DateUtils.customFormatDateOnly(new Date()));
          const isToday =
            date &&
            DateUtils.customFormatDateOnly(date) ===
              DateUtils.customFormatDateOnly(new Date());
          const isSelected =
            date && DateUtils.customFormatDateOnly(date) === selectedDate;

          return (
            <div
              key={index}
              className={`min-h-[120px] border border-gray-200 p-2 cursor-pointer ${
                isPast
                  ? "bg-gray-100 hover:bg-gray-200"
                  : isAdmin
                  ? "bg-gray-50"
                  : ""
              } ${
                isSelected && isPast
                  ? "bg-gray-200"
                  : isSelected
                  ? "bg-blue-100 hover:bg-blue-200"
                  : isPast
                  ? "hover:bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                if (date) {
                  const formattedDate = DateUtils.customFormatDate(date);
                  // If admin or past date, only allow viewing events
                  if (isAdmin || isPast) {
                    if (onDateView) {
                      onDateView(formattedDate);
                    }
                  } else {
                    // For non-admin and future dates, allow creating events
                    onDateSelect(formattedDate);
                  }
                }
              }}
            >
              {date && (
                <>
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday
                        ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        : isPast
                        ? "text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {getEventsForDate(date)
                      .filter((event) => isEventStartDate(event, date))
                      .slice(0, 2)
                      .map((event) => {
                        const category =
                          eventCategories[event.extendedProps.calendar] ||
                          eventCategories.Pending;
                        return (
                          <Tooltip
                            key={event.id}
                            className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                            content={
                              <div className="text-left text-gray-900 text-sm">
                                <div className="font-semibold mb-1">
                                  {event.title}
                                </div>
                                <p>
                                  <strong>Thời gian:</strong>{" "}
                                  {new Date(event.start).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                  {" - "}
                                  {new Date(event.end).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {event.extendedProps.eventType === "medical" ? (
                                  <>
                                    <p>
                                      <strong>Mô tả:</strong>{" "}
                                      {event.extendedProps.description ||
                                        "Không có mô tả"}
                                    </p>
                                    <p>
                                      <strong>Ngày:</strong>{" "}
                                      {DateUtils.customFormatDateOnly(
                                        new Date(event.start)
                                      )}
                                    </p>
                                    <p>
                                      <strong>Lớp:</strong>{" "}
                                      {(() => {
                                        const validClassIds =
                                          event.extendedProps.classIds?.filter(
                                            (id) => id && id.trim() !== ""
                                          ) || [];
                                        return validClassIds.length > 0 ? (
                                          validClassIds.map(
                                            (classId, index) => {
                                              const classOption =
                                                classOptions.find(
                                                  (option) =>
                                                    option.value === classId
                                                );
                                              const className = classOption
                                                ? classOption.label
                                                : `Class ${classId}`;
                                              return (
                                                <span
                                                  key={index}
                                                  className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-1"
                                                >
                                                  {className}
                                                </span>
                                              );
                                            }
                                          )
                                        ) : (
                                          <span className="text-gray-500">
                                            Không có lớp
                                          </span>
                                        );
                                      })()}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p>
                                      <strong>Tên Vaccine:</strong>{" "}
                                      {event.extendedProps.vaccineName ||
                                        "Không có tên vaccine"}
                                    </p>
                                    <p>
                                      <strong>Loại Vaccine:</strong>{" "}
                                      {event.extendedProps.vaccineType ||
                                        "Không có loại vaccine"}
                                    </p>
                                    <p>
                                      <strong>Ngày hết hạn:</strong>{" "}
                                      {DateUtils.customFormatDateOnly(
                                        new Date(event.extendedProps.exp!)
                                      )}
                                    </p>
                                    <p>
                                      <strong>Ngày sản xuất:</strong>{" "}
                                      {DateUtils.customFormatDateOnly(
                                        new Date(event.extendedProps.mfg!)
                                      )}
                                    </p>
                                    <p>
                                      <strong>Ngày bắt đầu:</strong>{" "}
                                      {DateUtils.customFormatDateOnly(
                                        new Date(event.start)
                                      )}
                                    </p>
                                    <p>
                                      <strong>Ngày kết thúc:</strong>{" "}
                                      {DateUtils.customFormatDateOnly(
                                        new Date(event.end)
                                      )}
                                    </p>
                                    <p>
                                      <strong>Lớp:</strong>{" "}
                                      {(() => {
                                        const validClassIds =
                                          event.extendedProps.classIds?.filter(
                                            (id) => id && id.trim() !== ""
                                          ) || [];
                                        return validClassIds.length > 0 ? (
                                          validClassIds.map(
                                            (classId, index) => {
                                              const classOption =
                                                classOptions.find(
                                                  (option) =>
                                                    option.value === classId
                                                );
                                              const className = classOption
                                                ? classOption.label
                                                : `Class ${classId}`;
                                              return (
                                                <span
                                                  key={index}
                                                  className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mr-1"
                                                >
                                                  {className}
                                                </span>
                                              );
                                            }
                                          )
                                        ) : (
                                          <span className="text-gray-500">
                                            Không có lớp nào
                                          </span>
                                        );
                                      })()}
                                    </p>
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
                                onEventClick(event);
                              }}
                              className={`flex items-start gap-2 text-xs p-2 rounded-md cursor-pointer opacity-80 transition-opacity ${
                                category.lightColor
                              } ${category.textColor} border-l-4 border-${
                                category.color.split("-")[1]
                              }-500`}
                              style={{
                                display: "inline-block",
                                width: (() => {
                                  const start = new Date(event.start);
                                  const end = new Date(event.end);
                                  const span =
                                    Math.floor(
                                      (new Date(
                                        DateUtils.customFormatDateOnly(end)
                                      ).getTime() -
                                        new Date(
                                          DateUtils.customFormatDateOnly(start)
                                        ).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) + 1;
                                  const remainingInWeek = 7 - date.getDay();
                                  const actualSpan = Math.min(
                                    span,
                                    remainingInWeek
                                  );
                                  return `calc(${actualSpan} * 100%)`;
                                })(),
                                borderRadius: "6px",
                                backgroundColor: category.color,
                                color: "#1a1a1a", // Đổi màu chữ đậm hơn
                                fontWeight: 600,
                                padding: "6px 8px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Đổ bóng nhẹ
                              }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-[10px] uppercase tracking-wide mb-1 text-center">
                                  {event.extendedProps.eventType === "medical"
                                    ? "Kiểm tra sức khỏe"
                                    : "Chiến dịch tiêm chủng"}
                                </div>
                                <div className="font-semibold text-sm mb-1 text-black">
                                  {event.title}
                                </div>
                                <div className="text-xs truncate text-gray-800">
                                  {new Date(event.start).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}{" "}
                                  -{" "}
                                  {new Date(event.end).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  {" | "}
                                  {event.extendedProps.eventType === "medical"
                                    ? event.extendedProps.description ||
                                      "Không có mô tả"
                                    : event.extendedProps.vaccineName ||
                                      "Không có tên vaccine"}
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
                          onViewMoreEvents(
                            DateUtils.customFormatDateOnly(date)
                          );
                        }}
                      >
                        +{getEventsForDate(date).length - 2} thêm
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
  );
};

export default CalendarGrid;
