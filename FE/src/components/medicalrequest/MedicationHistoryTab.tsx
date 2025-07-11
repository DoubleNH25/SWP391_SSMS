import React from "react";
import {
  Clock,
  User,
  Pill,
  FileText,
  Search,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import { DateUtils } from "@/utils/DateUtils";

export interface MedicationHistoryRecord {
  id: number;
  studentName: string;
  medicationName: string;
  dosage: string;
  administeredTime: string;
  administeredBy: string;
  note: string;
  status: string;
}

interface MedicationHistoryTabProps {
  medicationHistory: MedicationHistoryRecord[];
  historySearchTerm: string;
  setHistorySearchTerm: (term: string) => void;
  historyStartDate: string;
  setHistoryStartDate: (date: string) => void;
  historyEndDate: string;
  setHistoryEndDate: (date: string) => void;
  historyCurrentPage: number;
  setHistoryCurrentPage: (page: number) => void;
  historyItemsPerPage: number;
  setHistoryItemsPerPage: (items: number) => void;
  historySortOrder: "asc" | "desc";
  setHistorySortOrder: (order: "asc" | "desc") => void;
  onClearFilters: () => void;
  onSort: () => void;
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MedicationHistoryTab: React.FC<MedicationHistoryTabProps> = ({
  medicationHistory,
  historySearchTerm,
  setHistorySearchTerm,
  historyStartDate,
  setHistoryStartDate,
  historyEndDate,
  setHistoryEndDate,
  historyCurrentPage,
  setHistoryCurrentPage,
  historyItemsPerPage,
  historySortOrder,
  onClearFilters,
  onSort,
  onItemsPerPageChange,
}) => {
  // Filter and paginate medication history
  const filteredHistory = medicationHistory.filter((record) => {
    const matchesSearch =
      record.studentName
        .toLowerCase()
        .includes(historySearchTerm.toLowerCase()) ||
      record.medicationName
        .toLowerCase()
        .includes(historySearchTerm.toLowerCase()) ||
      record.administeredBy
        .toLowerCase()
        .includes(historySearchTerm.toLowerCase()) ||
      record.note.toLowerCase().includes(historySearchTerm.toLowerCase());

    // Date filter logic for history - improved using DateUtils
    const matchesDateFilter = (() => {
      if (!historyStartDate && !historyEndDate) return true;

      // Try to parse the administeredTime using DateUtils
      let recordDate: Date;
      try {
        // First try to parse as ISO string or standard format
        recordDate = DateUtils.toLocalDate(record.administeredTime);

        // If that fails, try Vietnamese locale format parsing
        if (isNaN(recordDate.getTime())) {
          const vietnameseFormatMatch = record.administeredTime.match(
            /(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s*(\d{1,2}):(\d{2}):(\d{2})/
          );
          if (vietnameseFormatMatch) {
            const [, day, month, year, hour, minute, second] =
              vietnameseFormatMatch;
            recordDate = new Date(
              `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}T${hour.padStart(2, "0")}:${minute}:${second}`
            );
          }
        }

        // If still invalid, skip this record
        if (isNaN(recordDate.getTime())) return true;
      } catch (error) {
        return true; // Skip invalid dates
      }

      const filterStart = historyStartDate
        ? new Date(historyStartDate + "T00:00:00")
        : null;
      const filterEnd = historyEndDate
        ? new Date(historyEndDate + "T23:59:59.999Z")
        : null;

      if (filterStart && filterEnd) {
        return recordDate >= filterStart && recordDate <= filterEnd;
      } else if (filterStart) {
        return recordDate >= filterStart;
      } else if (filterEnd) {
        return recordDate <= filterEnd;
      }
      return true;
    })();

    return matchesSearch && matchesDateFilter;
  });

  // Sort filtered history using DateUtils
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    try {
      const dateA = DateUtils.toLocalDate(a.administeredTime).getTime();
      const dateB = DateUtils.toLocalDate(b.administeredTime).getTime();
      return historySortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } catch (error) {
      // Fallback to string comparison if date parsing fails
      return historySortOrder === "asc"
        ? a.administeredTime.localeCompare(b.administeredTime)
        : b.administeredTime.localeCompare(a.administeredTime);
    }
  });

  // Pagination calculations
  const historyTotalItems = sortedHistory.length;
  const historyTotalPages =
    Math.ceil(historyTotalItems / historyItemsPerPage) || 1;
  const historyStartIndex = (historyCurrentPage - 1) * historyItemsPerPage;
  const historyEndIndex = historyStartIndex + historyItemsPerPage;
  const paginatedHistory = sortedHistory.slice(
    historyStartIndex,
    historyEndIndex
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
            {(historySearchTerm || historyStartDate || historyEndDate) && (
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
                placeholder="Tìm kiếm theo tên học sinh, thuốc, người thực hiện hoặc ghi chú..."
                value={historySearchTerm}
                onChange={(e) => {
                  setHistorySearchTerm(e.target.value);
                  setHistoryCurrentPage(1);
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
                {historySortOrder === "asc" ? (
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
                    value={historyStartDate}
                    onChange={(e) => setHistoryStartDate(e.target.value)}
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Đến ngày
                  </label>
                  <Input
                    type="date"
                    value={historyEndDate}
                    onChange={(e) => setHistoryEndDate(e.target.value)}
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {(historySearchTerm || historyStartDate || historyEndDate) && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Search className="w-4 h-4" />
                <span>
                  Hiển thị{" "}
                  <span className="font-medium text-gray-900">
                    {historyTotalItems}
                  </span>{" "}
                  kết quả
                  {historySearchTerm && (
                    <span>
                      {" "}
                      cho "
                      <span className="font-medium text-gray-900">
                        {historySearchTerm}
                      </span>
                      "
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Lịch sử cho thuốc
            </h2>
            <div className="text-sm text-gray-600">
              Tổng:{" "}
              <span className="font-medium text-gray-900">
                {historyTotalItems}
              </span>{" "}
              lần cho thuốc
            </div>
          </div>
        </div>

        <div className="p-6">
          {paginatedHistory.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedHistory.map((record) => (
                <div
                  key={record.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {record.studentName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.medicationName}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Hoàn thành
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Pill className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Liều lượng</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {record.dosage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Thời gian</span>
                      </div>
                      <span className="font-medium text-gray-900 text-right">
                        {record.administeredTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Người thực hiện</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {record.administeredBy}
                      </span>
                    </div>
                    {record.note && record.note !== "Không có ghi chú" && (
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                              Ghi chú
                            </span>
                            <p className="text-gray-900 mt-1">{record.note}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có lịch sử cho thuốc
              </h3>
              <p className="text-gray-600">
                Lịch sử cho thuốc sẽ hiển thị ở đây sau khi bạn xác nhận cho
                thuốc cho học sinh.
              </p>
            </div>
          )}

          {/* Pagination */}
          {historyTotalItems > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">{historyStartIndex + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(
                    historyCurrentPage * historyItemsPerPage,
                    historyTotalItems
                  )}
                </span>{" "}
                của <span className="font-medium">{historyTotalItems}</span> kết
                quả
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Hiển thị</span>
                  <select
                    value={historyItemsPerPage}
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
                      setHistoryCurrentPage(historyCurrentPage - 1)
                    }
                    disabled={historyCurrentPage === 1}
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
                    { length: historyTotalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setHistoryCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        historyCurrentPage === page
                          ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    onClick={() =>
                      setHistoryCurrentPage(historyCurrentPage + 1)
                    }
                    disabled={historyCurrentPage === historyTotalPages}
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
    </div>
  );
};

export default MedicationHistoryTab;
