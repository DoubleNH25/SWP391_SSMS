import React from "react";
import {
  Clock,
  User,
  Pill,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  X,
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
  onOpenConfirmModal: (request: ListMedicalRequestViewModel) => void;
  onOpenUpdateModal: (request: ListMedicalRequestViewModel) => void;
  onOpenDeleteModal: (request: ListMedicalRequestViewModel) => void;
  onClearFilters: () => void;
}

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
  onOpenConfirmModal,
  onOpenUpdateModal,
  onOpenDeleteModal,
  onClearFilters,
}) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
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
                        request.status === "active"
                          ? "bg-green-100 text-green-800"
                          : request.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status === "active"
                        ? "Đang hoạt động"
                        : request.status === "completed"
                        ? "Hoàn thành"
                        : "Hết hạn"}
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
                    <p className="font-medium text-gray-900">{request.form}</p>
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
                      <span>{request.createdTime}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onOpenConfirmModal(request)}
                      variant="default"
                      size="sm"
                      disabled={request.remainingQuantity <= 0}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Đã cho thuốc</span>
                    </Button>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationRequestsTab;
