import React, { useState } from "react";
import {
  Clock,
  User,
  Pill,
  Search,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import { ListMedicalRequestViewModel } from "@/types/MedicalRequest";

interface MedicationRequestsTabProps {
  requests: ListMedicalRequestViewModel[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterStartDate: string;
  setFilterStartDate: (date: string) => void;
  filterEndDate: string;
  setFilterEndDate: (date: string) => void;
  onOpenUpdateModal: (request: ListMedicalRequestViewModel) => void;
  onOpenDeleteModal: (request: ListMedicalRequestViewModel) => void;
  onClearFilters: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Đang hoạt động",
  completed: "Hoàn thành",
  expired: "Hết hạn",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  expired: "bg-red-100 text-red-800",
};

const MedicationRequestsTab: React.FC<MedicationRequestsTabProps> = ({
  requests,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  onOpenUpdateModal,
  onOpenDeleteModal,
  onClearFilters,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.medicationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;

    // Date filter logic - improved
    const matchesDateFilter = (() => {
      if (!filterStartDate && !filterEndDate) return true;

      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      const filterStart = filterStartDate ? new Date(filterStartDate) : null;
      const filterEnd = filterEndDate
        ? new Date(filterEndDate + "T23:59:59.999Z")
        : null;

      // If both dates are provided, check for overlap
      if (filterStart && filterEnd) {
        return requestStart <= filterEnd && requestEnd >= filterStart;
      }
      // If only start date is provided
      if (filterStart) {
        return requestEnd >= filterStart;
      }
      // If only end date is provided
      if (filterEnd) {
        return requestStart <= filterEnd;
      }
      return true;
    })();

    return matchesSearch && matchesFilter && matchesDateFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterStartDate, filterEndDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Bộ lọc và tìm kiếm
            </h2>
            {(searchTerm ||
              filterStatus !== "all" ||
              filterStartDate ||
              filterEndDate) && (
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
          {/* Search and Status Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên phụ huynh, học sinh hoặc thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Select
                options={[
                  { value: "all", label: "Tất cả trạng thái" },
                  { value: "active", label: "Đang hoạt động" },
                  { value: "completed", label: "Hoàn thành" },
                  { value: "expired", label: "Hết hạn" },
                ]}
                placeholder="Chọn trạng thái"
                onChange={(value) => setFilterStatus(value)}
                defaultValue={filterStatus}
              />
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
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Đến ngày
                  </label>
                  <Input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 flex items-center space-x-4">
          {/* Legend cho trạng thái */}
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-green-100 rounded-full border border-green-200"></span>
            <span className="text-sm text-gray-700">Đang hoạt động</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-blue-100 rounded-full border border-blue-200"></span>
            <span className="text-sm text-gray-700">Hoàn thành</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-red-100 rounded-full border border-red-200"></span>
            <span className="text-sm text-gray-700">Hết hạn</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {currentRequests.map((request) => {
            const statusKey = (request.status || "").toLowerCase();
            return (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Pill className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.medicationName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mã đơn: {request.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_CLASSES[statusKey] ??
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_LABELS[statusKey] ?? "Không xác định"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Học sinh: {request.studentName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          PH: {request.parentName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {request.timeToAdminister.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500 block">Dạng thuốc:</span>
                      <p className="font-medium text-gray-900">
                        {request.form}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500 block">Liều lượng:</span>
                      <p className="font-medium text-gray-900">
                        {request.dosage}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500 block">Tần suất:</span>
                      <p className="font-medium text-gray-900">
                        {request.frequency} lần/ngày
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-500 block">Còn lại:</span>
                      <p className="font-medium text-gray-900">
                        {request.remainingQuantity}/{request.totalQuantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>
                          {new Date(request.createdTime).toLocaleString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onOpenUpdateModal(request)}
                        variant="default"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Sửa</span>
                      </Button>
                      <Button
                        onClick={() => onOpenDeleteModal(request)}
                        variant="default"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationRequestsTab;
