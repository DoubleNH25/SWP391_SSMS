import React, { useState, useEffect } from "react";
import { Pill, ArrowLeft } from "lucide-react";
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
import {
  FecthMedicalRequest,
  FecthCreateMedicalRequest,
  FecthCreateMedicalAdministration,
} from "@/services/MedicalRequest";
import { ListMedicalRequestViewModel } from "@/types/MedicalRequest";
import { MedicationHistoryRecord } from "@/components/medicalrequest/MedicationHistoryTab";
import AddMedicationModal from "@/components/medicalrequest/AddMedicationModal";
import { Student } from "@/types/Student";
import { DecodeJWT } from "@/utils/DecodeJWT";
import ApiClient from "@/utils/ApiBase";

const ManagerMedicalRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmNote, setConfirmNote] = useState("");
  const [selectedRequestForConfirm, setSelectedRequestForConfirm] =
    useState<ListMedicalRequestViewModel | null>(null);

  // Delete and Update modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRequestForAction, setSelectedRequestForAction] =
    useState<ListMedicalRequestViewModel | null>(null);
  const [updateRequest, setUpdateRequest] = useState<
    Partial<ListMedicalRequestViewModel>
  >({});

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

  const [requests, setRequests] = useState<ListMedicalRequestViewModel[]>([]);
  const [medicationHistory, setMedicationHistory] = useState<
    MedicationHistoryRecord[]
  >([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<{ value: string; label: string }[]>(
    []
  );
  // Xoá khai báo và setMedicines, setForms nếu không dùng ở đâu nữa

  // Đảm bảo chỉ có 1 lần khai báo:
  const user = DecodeJWT() as {
    sub?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    [key: string]: string | undefined;
  } | null;
  const isParent =
    user &&
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ===
      "Parent";

  // Thêm state lưu parentId đã fetch
  const [selectedParentIdForModal, setSelectedParentIdForModal] =
    useState<string>("");

  // Thêm hàm fetchMedicationHistory mới
  const fetchMedicationHistory = async (date?: string) => {
    setLoading(true);
    try {
      let url = "/medical-request/history/completed";
      if (date) {
        url += `/${date}`;
      } else {
        url += "/today";
      }
      const res = await ApiClient<{
        success: boolean;
        data: { completedAdministrations: MedicationHistoryRecord[] };
      }>({
        method: "GET",
        endpoint: url,
      });
      // Xử lý response format từ API
      if (
        res?.data?.success &&
        Array.isArray(res.data.data?.completedAdministrations)
      ) {
        setMedicationHistory(res.data.data.completedAdministrations);
      } else {
        setMedicationHistory([]);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Lỗi khi lấy lịch sử uống thuốc");
      setMedicationHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchMedicationHistory khi vào tab 'history' hoặc filter ngày thay đổi
  useEffect(() => {
    if (activeTab === "history") {
      if (
        historyStartDate &&
        historyEndDate &&
        historyStartDate === historyEndDate
      ) {
        fetchMedicationHistory(historyStartDate);
      } else if (historyStartDate) {
        fetchMedicationHistory(historyStartDate); // Ưu tiên ngày bắt đầu
      } else {
        fetchMedicationHistory(); // Lấy hôm nay
      }
    }
    // eslint-disable-next-line
  }, [activeTab, historyStartDate, historyEndDate]);

  useEffect(() => {
    setLoading(true);
    FecthMedicalRequest()
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi lấy danh sách đơn thuốc");
        setLoading(false);
      });
  }, []);

  // Lấy danh sách học sinh, thuốc, dạng thuốc
  useEffect(() => {
    if (isParent) {
      ApiClient<Student[]>({
        method: "GET",
        endpoint: "/parents/students",
      })
        .then((response) => {
          setStudents(
            response.data.map((s) => ({ value: s.id, label: s.fullName }))
          );
        })
        .catch((err) => {
          console.error("Lỗi khi gọi API /api/parents/students:", err);
        });
    } else {
      setStudents(requests.map((r) => ({ value: r.id, label: r.studentName })));
      // Nếu là nurse, lấy parentId từ selectedStudent khi mở modal
      if (selectedStudent && selectedStudent.parentId) {
        // setParentId(selectedStudent.parentId); // This line is removed
      }
    }
  }, [isParent, requests, selectedStudent]);

  // Khi chọn học sinh, gọi ngầm API lấy parentId
  // XÓA HÀM handleSelectStudent vì không được sử dụng
  // XÓA các biến/hàm thừa khác nếu không được gọi ở đâu trong file

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

  const handleAdministerMedication = (requestId: string, note?: string) => {
    setRequests(
      requests.map((req) => {
        if (
          req.id === requestId &&
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

  const handleOpenConfirmModal = (request: ListMedicalRequestViewModel) => {
    setSelectedRequestForConfirm(request);
    setConfirmNote("");
    setShowConfirmModal(true);
  };

  const handleConfirmAdministration = async () => {
    if (selectedRequestForConfirm) {
      try {
        // Gọi API để record medication administration
        await FecthCreateMedicalAdministration({
          medicalRequestId: selectedRequestForConfirm.id,
          doseGiven: selectedRequestForConfirm.dosage,
          wasTaken: true,
          administeredAt: new Date(),
          notes: confirmNote || "Không có ghi chú",
        });

        // Update local state
        handleAdministerMedication(selectedRequestForConfirm.id, confirmNote);

        // Add to medication history
        const historyRecord: MedicationHistoryRecord = {
          id: Date.now().toString(),
          medicalRequestId: selectedRequestForConfirm.id,
          studentId: "", // Không có trong ListMedicalRequestViewModel
          studentName: selectedRequestForConfirm.studentName,
          studentClass: "", // Không có trong ListMedicalRequestViewModel
          medicationName: selectedRequestForConfirm.medicationName,
          form: selectedRequestForConfirm.form,
          route: "", // Không có trong ListMedicalRequestViewModel
          plannedDosage: selectedRequestForConfirm.dosage,
          actualDoseGiven: selectedRequestForConfirm.dosage,
          scheduledTime: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          wasTaken: true,
          notes: confirmNote || "Không có ghi chú",
          administratorId: "current-user",
          administratorName: "Y tá Minh",
          status: "Success",
        };

        setMedicationHistory((prev) => [historyRecord, ...prev]);

        // Auto switch to history tab to show the new record
        setActiveTab("history");

        setShowConfirmModal(false);
        setSelectedRequestForConfirm(null);
        setConfirmNote("");
      } catch (error) {
        console.error("Failed to record medication administration:", error);
        showToast.error("Không thể xác nhận cho thuốc. Vui lòng thử lại.");
      }
    }
  };

  // Delete and Update modal functions
  const handleOpenDeleteModal = (request: ListMedicalRequestViewModel) => {
    setSelectedRequestForAction(request);
    setShowDeleteModal(true);
  };

  const handleOpenUpdateModal = (request: ListMedicalRequestViewModel) => {
    setSelectedRequestForAction(request);
    setUpdateRequest({
      parentName: request.parentName,
      studentName: request.studentName,
      medicationName: request.medicationName,
      form: request.form,
      dosage: request.dosage,
      frequency: request.frequency,
      totalQuantity: request.totalQuantity,
      timeToAdminister: [...request.timeToAdminister],
      startDate: request.startDate,
      endDate: request.endDate,
      status: request.status,
    });
    setShowUpdateModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequestForAction) {
      setRequests(
        requests.filter((req) => req.id !== selectedRequestForAction.id)
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
          req.id === selectedRequestForAction.id
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
    setHistorySortOrder(historySortOrder === "asc" ? "desc" : "asc");
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

  // Nút thêm đơn thuốc: chỉ mở modal khi đã có cả student và parentId
  // Remove the handleOpenAddModal function entirely

  const handleAddMedication = async (
    data: import("@/types/MedicalRequest").MedicalRequestCreateUpdateViewModel
  ) => {
    setLoading(true);
    try {
      await FecthCreateMedicalRequest(data);
      showToast.success("Tạo đơn thuốc thành công!");
      await FecthMedicalRequest().then(setRequests);
      setShowAddModal(false);
    } catch {
      showToast.error("Tạo đơn thuốc thất bại!");
    }
    setLoading(false);
  };

  // Trước khi render AddMedicationModal, tạo biến medicines/forms là [] nếu là parent
  const medicines: { value: string; label: string }[] = [];
  const forms: { value: string; label: string }[] = [];

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
            {/* XÓA nút Thêm đơn thuốc ở đây */}
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
              {...(!isParent
                ? {
                    searchTerm: searchTerm || "",
                    setSearchTerm,
                    filterStatus: filterStatus || "",
                    setFilterStatus,
                    filterStartDate: filterStartDate || "",
                    setFilterStartDate,
                    filterEndDate: filterEndDate || "",
                    setFilterEndDate,
                    onClearFilters: handleRequestsClearFilters,
                  }
                : {
                    searchTerm: "",
                    setSearchTerm: () => {},
                    filterStatus: "",
                    setFilterStatus: () => {},
                    filterStartDate: "",
                    setFilterStartDate: () => {},
                    filterEndDate: "",
                    setFilterEndDate: () => {},
                    onClearFilters: () => {},
                  })}
              onOpenUpdateModal={handleOpenUpdateModal}
              onOpenDeleteModal={handleOpenDeleteModal}
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
      />

      <AddMedicationModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStudent(null);
          setSelectedParentIdForModal("");
        }}
        onSubmit={(data: Record<string, unknown>) =>
          handleAddMedication(
            data as unknown as import("@/types/MedicalRequest").MedicalRequestCreateUpdateViewModel
          )
        }
        students={students}
        medicines={medicines}
        forms={forms}
        selectedStudent={selectedStudent}
        parentId={selectedParentIdForModal}
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
