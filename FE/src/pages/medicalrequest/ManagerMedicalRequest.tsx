import React, { useState } from "react";
import { Pill, ArrowLeft, Plus } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MedicationRequestsTab from "@/components/medicalrequest/MedicationRequestsTab";
import MedicationScheduleTab from "@/components/medicalrequest/MedicationScheduleTab";
import MedicationHistoryTab from "@/components/medicalrequest/MedicationHistoryTab";
import UpdateMedicationModal from "@/components/medicalrequest/UpdateMedicationModal";
import ConfirmMedicationModal from "@/components/medicalrequest/ConfirmMedicationModal";
import DeleteConfirmationModal from "@/components/medicalrequest/DeleteConfirmationModal";
import { showToast } from "@/components/ui/Toast";

const ManagerMedicalRequest = () => {
  const [loading, ] = useState(false);
  const [error, ] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("requests");
  const [, setShowMultiMedicationModal] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmNote, setConfirmNote] = useState("");
  const [selectedRequestForConfirm, setSelectedRequestForConfirm] =
    useState<any>(null);

  // Delete and Update modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRequestForAction, setSelectedRequestForAction] =
    useState<any>(null);
  const [updateRequest, setUpdateRequest] = useState<any>({});

  // History filter and pagination states
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historyItemsPerPage, setHistoryItemsPerPage] = useState(6);
  const [historySortOrder, setHistorySortOrder] = useState<"asc" | "desc">(
    "desc"
  );

  // Schedule filter and pagination states
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const [scheduleStartDate, setScheduleStartDate] = useState("");
  const [scheduleEndDate, setScheduleEndDate] = useState("");
  const [scheduleCurrentPage, setScheduleCurrentPage] = useState(1);
  const [scheduleItemsPerPage, setScheduleItemsPerPage] = useState(6);
  const [scheduleSortOrder, setScheduleSortOrder] = useState<"asc" | "desc">(
    "asc"
  );
  const navigate = useNavigate();

  const [medicationHistory, setMedicationHistory] = useState<any[]>([
    // Sample data for demo
    {
      id: 1,
      studentName: "Nguyễn Minh An",
      medicationName: "Paracetamol 250mg",
      dosage: "2 viên/lần",
      administeredTime: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(
        "vi-VN"
      ),
      administeredBy: "Y tá Lan",
      note: "Học sinh đã uống thuốc sau bữa ăn trưa",
      status: "Đã hoàn thành",
    },
    {
      id: 2,
      studentName: "Trần Thị Hương",
      medicationName: "Vitamin C 500mg",
      dosage: "5ml/lần",
      administeredTime: new Date(
        Date.now() - 2 * 60 * 60 * 1000
      ).toLocaleString("vi-VN"),
      administeredBy: "Y tá Minh",
      note: "Đã lắc đều trước khi cho uống",
      status: "Đã hoàn thành",
    },
    {
      id: 3,
      studentName: "Lê Văn Đức",
      medicationName: "Amoxicillin 125mg",
      dosage: "1 viên/lần",
      administeredTime: new Date(
        Date.now() - 4 * 60 * 60 * 1000
      ).toLocaleString("vi-VN"),
      administeredBy: "Y tá Lan",
      note: "Cho uống với nước ấm",
      status: "Đã hoàn thành",
    },
    {
      id: 4,
      studentName: "Phạm Thị Mai",
      medicationName: "Siro ho",
      dosage: "10ml/lần",
      administeredTime: new Date(
        Date.now() - 6 * 60 * 60 * 1000
      ).toLocaleString("vi-VN"),
      administeredBy: "Y tá Minh",
      note: "Học sinh ho nhiều, đã cho uống đúng liều",
      status: "Đã hoàn thành",
    },
    {
      id: 5,
      studentName: "Hoàng Văn Nam",
      medicationName: "Thuốc nhỏ mắt",
      dosage: "2 giọt/mắt",
      administeredTime: new Date(
        Date.now() - 8 * 60 * 60 * 1000
      ).toLocaleString("vi-VN"),
      administeredBy: "Y tá Lan",
      note: "Đã vệ sinh mắt trước khi nhỏ thuốc",
      status: "Đã hoàn thành",
    },
    {
      id: 6,
      studentName: "Vũ Thị Linh",
      medicationName: "Paracetamol 250mg",
      dosage: "1 viên/lần",
      administeredTime: new Date(
        Date.now() - 10 * 60 * 60 * 1000
      ).toLocaleString("vi-VN"),
      administeredBy: "Y tá Minh",
      note: "Học sinh sốt nhẹ, đã cho uống thuốc hạ sốt",
      status: "Đã hoàn thành",
    },
    {
      id: 7,
      studentName: "Đặng Minh Tuấn",
      medicationName: "Vitamin D3",
      dosage: "1 viên/lần",
      administeredTime: new Date(
        Date.now() - 12 * 60 * 60 * 1000
      ).toLocaleString("vi-VN"),
      administeredBy: "Y tá Lan",
      note: "Bổ sung vitamin theo chỉ định bác sĩ",
      status: "Đã hoàn thành",
    },
  ]);

  // Sample data
  const [requests, setRequests] = useState([
    {
      uid: "MR001",
      medicationRequestId: "REQ-2024-001",
      studentId: "ST001",
      parentId: "P001",
      parentName: "Nguyễn Thị Lan",
      phoneNumber: "0912345678",
      medicationName: "Paracetamol 250mg",
      form: "Tablet",
      dosage: "2 viên/lần",
      route: "Uống",
      frequency: 2,
      totalQuantity: 60,
      remainingQuantity: 45,
      timeToAdminister: ["07:00", "19:00"],
      startDate: "2024-06-10",
      endDate: "2024-06-20",
      note: "Cho uống sau bữa ăn",
      status: "active",
      createdBy: "Y tá Minh",
      createdDate: "2024-06-10",
      studentName: "Nguyễn Minh An",
    },
    {
      uid: "MR002",
      medicationRequestId: "REQ-2024-002",
      studentId: "ST002",
      parentId: "P002",
      parentName: "Trần Văn Hùng",
      phoneNumber: "0987654321",
      medicationName: "Vitamin C 500mg",
      form: "Syrup",
      dosage: "5ml/lần",
      route: "Uống",
      frequency: 1,
      totalQuantity: 100,
      remainingQuantity: 85,
      timeToAdminister: ["12:00"],
      startDate: "2024-06-12",
      endDate: "2024-06-25",
      note: "Lắc đều trước khi uống",
      status: "active",
      createdBy: "Y tá Lan",
      createdDate: "2024-06-12",
      studentName: "Trần Thị Hương",
    },
  ]);

  const medicationForms = [
    "Viên nén",
    "Siro",
    "Thuốc nhỏ mắt",
    "Kem bôi",
    "Viên con nhộng",
    "Thuốc tiêm",
    "Thuốc mỡ",
    "Thuốc đặt",
    "Thuốc hít",
    "Vắc-xin",
    "Khác",
  ];
  const routes = ["Uống", "Chích", "Ngậm", "Bôi ngoài da", "Nhỏ mắt", "Khác"];

  const handleAdministerMedication = (requestId: string, note?: string) => {
    setRequests(
      requests.map((req) => {
        if (
          req.uid === requestId &&
          req.form !== "Cream" &&
          req.form !== "EyeDrop"
        ) {
          const dosageAmount = parseInt(req.dosage.match(/\d+/)?.[0] || "1");
          return {
            ...req,
            remainingQuantity: Math.max(
              0,
              req.remainingQuantity - dosageAmount
            ),
          };
        }
        return req;
      })
    );

    // Show success toast with note if provided
    if (note) {
      showToast.success(`Đã xác nhận cho thuốc thành công! Ghi chú: ${note}`);
    } else {
      showToast.success("Đã xác nhận cho thuốc thành công!");
    }
  };

  const handleOpenConfirmModal = (request: any) => {
    setSelectedRequestForConfirm(request);
    setConfirmNote("");
    setShowConfirmModal(true);
  };

  const handleConfirmAdministration = () => {
    if (selectedRequestForConfirm) {
      handleAdministerMedication(selectedRequestForConfirm.uid, confirmNote);

      // Add to medication history
      const historyRecord = {
        id: Date.now(),
        studentName: selectedRequestForConfirm.studentName,
        medicationName: selectedRequestForConfirm.medicationName,
        dosage: selectedRequestForConfirm.dosage,
        administeredTime: new Date().toLocaleString("vi-VN"),
        administeredBy: "Y tá Minh",
        note: confirmNote || "Không có ghi chú",
        status: "Đã hoàn thành",
      };

      setMedicationHistory((prev) => [historyRecord, ...prev]);

      // Auto switch to history tab to show the new record
      setActiveTab("history");

      setShowConfirmModal(false);
      setSelectedRequestForConfirm(null);
      setConfirmNote("");
    }
  };

  // Delete and Update modal functions
  const handleOpenDeleteModal = (request: any) => {
    setSelectedRequestForAction(request);
    setShowDeleteModal(true);
  };

  const handleOpenUpdateModal = (request: any) => {
    setSelectedRequestForAction(request);
    setUpdateRequest({
      parentName: request.parentName,
      phoneNumber: request.phoneNumber,
      studentName: request.studentName,
      medicationName: request.medicationName,
      form: request.form,
      dosage: request.dosage,
      route: request.route,
      frequency: request.frequency,
      totalQuantity: request.totalQuantity,
      timeToAdminister: [...request.timeToAdminister],
      startDate: request.startDate,
      endDate: request.endDate,
      note: request.note,
    });
    setShowUpdateModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequestForAction) {
      setRequests(
        requests.filter((req) => req.uid !== selectedRequestForAction.uid)
      );
      showToast.success("Đã xóa đơn thuốc thành công!");
      setShowDeleteModal(false);
      setSelectedRequestForAction(null);
    }
  };

  const handleConfirmUpdate = () => {
    if (selectedRequestForAction) {
      setRequests(
        requests.map((req) =>
          req.uid === selectedRequestForAction.uid
            ? { ...req, ...updateRequest }
            : req
        )
      );
      showToast.success("Đã cập nhật đơn thuốc thành công!");
      setShowUpdateModal(false);
      setSelectedRequestForAction(null);
      setUpdateRequest({});
    }
  };

  // Requests filter functions
  const handleRequestsClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  // History filter and pagination functions
  const handleHistoryClearFilters = () => {
    setHistorySearchTerm("");
    setHistoryStartDate("");
    setHistoryEndDate("");
    setHistoryCurrentPage(1);
  };

  const handleHistoryItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setHistoryItemsPerPage(Number(e.target.value));
    setHistoryCurrentPage(1);
  };

  const handleHistorySort = () => {
    setHistorySortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Schedule filter and pagination functions
  const handleScheduleClearFilters = () => {
    setScheduleSearchTerm("");
    setScheduleStartDate("");
    setScheduleEndDate("");
    setScheduleCurrentPage(1);
  };

  const handleScheduleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setScheduleItemsPerPage(Number(e.target.value));
    setScheduleCurrentPage(1);
  };

  const handleScheduleSort = () => {
    setScheduleSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-600 bg-red-50 px-4 py-2 rounded-md">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>

            <Button
              onClick={() => setShowMultiMedicationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              <Plus className="w-4 h-4" />
              Thêm đơn thuốc
            </Button>
          </div>

          <PageHeader
            title="Quản lý Thuốc Của Học Sinh"
            icon={<Pill className="w-6 h-6 text-blue-600" />}
            description="Quản lý thông tin thuốc và đơn thuốc của học sinh"
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-0 bg-white border border-gray-200 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "requests"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Danh sách đơn thuốc
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "schedule"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Lịch uống thuốc
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Lịch sử uống thuốc
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {activeTab === "requests" && (
            <MedicationRequestsTab
              requests={requests}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterStartDate={filterStartDate}
              setFilterStartDate={setFilterStartDate}
              filterEndDate={filterEndDate}
              setFilterEndDate={setFilterEndDate}
              onOpenConfirmModal={handleOpenConfirmModal}
              onOpenUpdateModal={handleOpenUpdateModal}
              onOpenDeleteModal={handleOpenDeleteModal}
              onClearFilters={handleRequestsClearFilters}
            />
          )}

          {activeTab === "schedule" && (
            <MedicationScheduleTab
              requests={requests}
              scheduleSearchTerm={scheduleSearchTerm}
              setScheduleSearchTerm={setScheduleSearchTerm}
              scheduleStartDate={scheduleStartDate}
              setScheduleStartDate={setScheduleStartDate}
              scheduleEndDate={scheduleEndDate}
              setScheduleEndDate={setScheduleEndDate}
              scheduleCurrentPage={scheduleCurrentPage}
              setScheduleCurrentPage={setScheduleCurrentPage}
              scheduleItemsPerPage={scheduleItemsPerPage}
              setScheduleItemsPerPage={setScheduleItemsPerPage}
              scheduleSortOrder={scheduleSortOrder}
              setScheduleSortOrder={setScheduleSortOrder}
              onOpenConfirmModal={handleOpenConfirmModal}
              onClearFilters={handleScheduleClearFilters}
              onSort={handleScheduleSort}
              onItemsPerPageChange={handleScheduleItemsPerPageChange}
            />
          )}

          {activeTab === "history" && (
            <MedicationHistoryTab
              medicationHistory={medicationHistory}
              historySearchTerm={historySearchTerm}
              setHistorySearchTerm={setHistorySearchTerm}
              historyStartDate={historyStartDate}
              setHistoryStartDate={setHistoryStartDate}
              historyEndDate={historyEndDate}
              setHistoryEndDate={setHistoryEndDate}
              historyCurrentPage={historyCurrentPage}
              setHistoryCurrentPage={setHistoryCurrentPage}
              historyItemsPerPage={historyItemsPerPage}
              setHistoryItemsPerPage={setHistoryItemsPerPage}
              historySortOrder={historySortOrder}
              setHistorySortOrder={setHistorySortOrder}
              onClearFilters={handleHistoryClearFilters}
              onSort={handleHistorySort}
              onItemsPerPageChange={handleHistoryItemsPerPageChange}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmMedicationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        selectedRequest={selectedRequestForConfirm}
        confirmNote={confirmNote}
        setConfirmNote={setConfirmNote}
        onConfirm={handleConfirmAdministration}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedRequest={selectedRequestForAction}
        onConfirm={handleConfirmDelete}
      />

      <UpdateMedicationModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        updateRequest={updateRequest}
        setUpdateRequest={setUpdateRequest}
        onConfirm={handleConfirmUpdate}
        medicationForms={medicationForms}
        routes={routes}
      />

      {/* <MultiMedicationModal
        isOpen={showMultiMedicationModal}
        onClose={() => setShowMultiMedicationModal(false)}
        selectedStudent={null}
        onSubmit={handleMultiMedicationSubmit}
      /> */}
    </div>
  );
};

export default ManagerMedicalRequest;
