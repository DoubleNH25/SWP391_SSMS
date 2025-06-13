import React from "react";
import {
  Clock,
  User,
  Phone,
  Pill,
  FileText,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";

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

interface MedicationRequestsTabProps {
  requests: MedicationRequest[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onOpenConfirmModal: (request: MedicationRequest) => void;
  onOpenUpdateModal: (request: MedicationRequest) => void;
  onOpenDeleteModal: (request: MedicationRequest) => void;
}

const MedicationRequestsTab: React.FC<MedicationRequestsTabProps> = ({
  requests,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onOpenConfirmModal,
  onOpenUpdateModal,
  onOpenDeleteModal,
}) => {
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.medicationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Bộ lọc tìm kiếm
            </h2>
            {(searchTerm || filterStatus !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên phụ huynh, học sinh hoặc thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                options={[
                  { value: "all", label: "Tất cả" },
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
        </div>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.uid}
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
                        Mã đơn: {request.medicationRequestId}
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
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {request.phoneNumber}
                    </p>
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
                    <span className="text-gray-500 block">
                      Dạng thuốc:
                    </span>
                    <p className="font-medium text-gray-900">
                      {request.form}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500 block">
                      Liều lượng:
                    </span>
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

                {request.note && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Ghi chú:
                        </p>
                        <p className="text-sm text-yellow-700">
                          {request.note}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>Tạo bởi: {request.createdBy}</span>
                      <div className="mt-1">
                        <span className="mx-2">•</span>
                        <span>{request.createdDate}</span>
                      </div>
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
