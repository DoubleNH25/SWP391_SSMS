import React from "react";
import { Clock, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";

interface MedicationRequest {
  uid: string;
  medicationRequestId: string;
  studentId: string;
  parentId: string;
  parentName: string;
  phoneNumber: string;
  medicationName: string;
  form: string;
  dosage: string;
  route: string;
  frequency: number;
  totalQuantity: number;
  remainingQuantity: number;
  timeToAdminister: string[];
  startDate: string;
  endDate: string;
  note: string;
  status: string;
  createdBy: string;
  createdDate: string;
  studentName: string;
}



interface MedicationScheduleTabProps {
  requests: MedicationRequest[];
  scheduleSearchTerm: string;
  setScheduleSearchTerm: (term: string) => void;
  scheduleStartDate: string;
  setScheduleStartDate: (date: string) => void;
  scheduleEndDate: string;
  setScheduleEndDate: (date: string) => void;
  scheduleCurrentPage: number;
  setScheduleCurrentPage: (page: number) => void;
  scheduleItemsPerPage: number;
  setScheduleItemsPerPage: (items: number) => void;
  scheduleSortOrder: "asc" | "desc";
  setScheduleSortOrder: (order: "asc" | "desc") => void;
  onOpenConfirmModal: (request: MedicationRequest) => void;
  onClearFilters: () => void;
  onSort: () => void;
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MedicationScheduleTab: React.FC<MedicationScheduleTabProps> = ({
  requests,
  scheduleSearchTerm,
  setScheduleSearchTerm,
  scheduleStartDate,
  setScheduleStartDate,
  scheduleEndDate,
  setScheduleEndDate,
  scheduleCurrentPage,
  setScheduleCurrentPage,
  scheduleItemsPerPage,
  scheduleSortOrder,
  onOpenConfirmModal,
  onClearFilters,
  onSort,
  onItemsPerPageChange,
}) => {
  // Get schedule data (flatten timeToAdminister for each request)
  const scheduleData = requests
    .filter((req) => {
      if (req.status !== "active") return false;

      // Date filter logic for schedule - improved
      if (scheduleStartDate || scheduleEndDate) {
        const requestStart = new Date(req.startDate);
        const requestEnd = new Date(req.endDate);
        const filterStart = scheduleStartDate ? new Date(scheduleStartDate) : null;
        const filterEnd = scheduleEndDate ? new Date(scheduleEndDate + "T23:59:59.999Z") : null;

        if (filterStart && filterEnd) {
          return requestStart <= filterEnd && requestEnd >= filterStart;
        } else if (filterStart) {
          return requestEnd >= filterStart;
        } else if (filterEnd) {
          return requestStart <= filterEnd;
        }
      }
      return true;
    })
    .flatMap((request) =>
      request.timeToAdminister.map((time) => ({
        id: `${request.uid}-${time}`,
        time: time,
        studentName: request.studentName,
        medicationName: request.medicationName,
        dosage: request.dosage,
        requestId: request.uid,
        remainingQuantity: request.remainingQuantity,
      }))
    );

  // Filter schedule data
  const filteredSchedule = scheduleData.filter((item) => {
    const matchesSearch =
      item.studentName
        .toLowerCase()
        .includes(scheduleSearchTerm.toLowerCase()) ||
      item.medicationName
        .toLowerCase()
        .includes(scheduleSearchTerm.toLowerCase()) ||
      item.time.includes(scheduleSearchTerm);
    return matchesSearch;
  });

  // Sort filtered schedule
  const sortedSchedule = [...filteredSchedule].sort((a, b) => {
    const timeA = a.time;
    const timeB = b.time;
    return scheduleSortOrder === "asc"
      ? timeA.localeCompare(timeB)
      : timeB.localeCompare(timeA);
  });

  // Schedule pagination calculations
  const scheduleTotalItems = sortedSchedule.length;
  const scheduleTotalPages =
    Math.ceil(scheduleTotalItems / scheduleItemsPerPage) || 1;
  const scheduleStartIndex = (scheduleCurrentPage - 1) * scheduleItemsPerPage;
  const scheduleEndIndex = scheduleStartIndex + scheduleItemsPerPage;
  const paginatedSchedule = sortedSchedule.slice(
    scheduleStartIndex,
    scheduleEndIndex
  );

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Bộ lọc và tìm kiếm
            </h2>
            {(scheduleSearchTerm || scheduleStartDate || scheduleEndDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Search and Sort Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên học sinh, thuốc hoặc thời gian..."
                value={scheduleSearchTerm}
                onChange={(e) => {
                  setScheduleSearchTerm(e.target.value);
                  setScheduleCurrentPage(1);
                }}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Button
                onClick={onSort}
                variant="outline"
                className="w-full h-10 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Sắp xếp</span>
                {scheduleSortOrder === "asc" ? (
                  <span className="text-xs">↑</span>
                ) : (
                  <span className="text-xs">↓</span>
                )}
              </Button>
            </div>
          </div>

          {/* Date Filter Row */}
          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Lọc theo thời gian</span>
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Từ ngày
                  </label>
                  <Input
                    type="date"
                    value={scheduleStartDate}
                    onChange={(e) => setScheduleStartDate(e.target.value)}
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Đến ngày
                  </label>
                  <Input
                    type="date"
                    value={scheduleEndDate}
                    onChange={(e) => setScheduleEndDate(e.target.value)}
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {(scheduleSearchTerm || scheduleStartDate || scheduleEndDate) && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Search className="w-4 h-4" />
                <span>
                  Hiển thị <span className="font-medium text-gray-900">{scheduleTotalItems}</span> kết quả
                  {scheduleSearchTerm && (
                    <span> cho "<span className="font-medium text-gray-900">{scheduleSearchTerm}</span>"</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Lịch cho thuốc hôm nay
          </h2>
          <div className="text-sm text-gray-500">
            Tổng: {scheduleTotalItems} lần cho thuốc
          </div>
        </div>

        {paginatedSchedule.length > 0 ? (
          <div className="space-y-4">
            {paginatedSchedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {item.time}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.medicationName} - {item.dosage}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const request = requests.find(
                      (req) => req.uid === item.requestId
                    );
                    if (request) onOpenConfirmModal(request);
                  }}
                  variant="default"
                  disabled={item.remainingQuantity <= 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Xác nhận đã cho thuốc
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có lịch cho thuốc
            </h3>
            <p className="text-gray-600">
              {scheduleSearchTerm
                ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm."
                : "Chưa có lịch cho thuốc nào cho hôm nay."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {scheduleTotalItems > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {scheduleStartIndex + 1}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {Math.min(
                  scheduleCurrentPage * scheduleItemsPerPage,
                  scheduleTotalItems
                )}
              </span>{" "}
              của{" "}
              <span className="font-medium">{scheduleTotalItems}</span>{" "}
              kết quả
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Hiển thị</span>
                <select
                  value={scheduleItemsPerPage}
                  onChange={onItemsPerPageChange}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                </select>
                <span className="text-sm text-gray-700">mục</span>
              </div>

              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <Button
                  onClick={() =>
                    setScheduleCurrentPage(scheduleCurrentPage - 1)
                  }
                  disabled={scheduleCurrentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Trang trước</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>

                {Array.from(
                  { length: scheduleTotalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setScheduleCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      scheduleCurrentPage === page
                        ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  onClick={() =>
                    setScheduleCurrentPage(scheduleCurrentPage + 1)
                  }
                  disabled={scheduleCurrentPage === scheduleTotalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Trang sau</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationScheduleTab;
