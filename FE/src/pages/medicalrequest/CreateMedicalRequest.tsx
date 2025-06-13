import React, { useCallback, useEffect, useState } from "react";
import { Pill, ArrowLeft, Plus } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import MedicationRequestsTab from "@/components/medicalrequest/MedicationRequestsTab";
import MedicationScheduleTab from "@/components/medicalrequest/MedicationScheduleTab";
import MedicationHistoryTab from "@/components/medicalrequest/MedicationHistoryTab";
import AddMedicationModal from "@/components/medicalrequest/AddMedicationModal";
import UpdateMedicationModal from "@/components/medicalrequest/UpdateMedicationModal";
import ConfirmMedicationModal from "@/components/medicalrequest/ConfirmMedicationModal";
import DeleteConfirmationModal from "@/components/medicalrequest/DeleteConfirmationModal";
import { FecthStudentById } from "@/services/UserService";
import { Student } from "@/types/Student";

const CreateMedicalRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("requests");
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmNote, setConfirmNote] = useState("");
    const [selectedRequestForConfirm, setSelectedRequestForConfirm] =
        useState<any>(null);
    const { studentId } = useParams<{ studentId: string }>();
    const [student, setStudent] = useState<Student | null>(null);

    // Delete and Update modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedRequestForAction, setSelectedRequestForAction] =
        useState<any>(null);
    const [updateRequest, setUpdateRequest] = useState<any>({});

    // History filter and pagination states
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    const [historyItemsPerPage, setHistoryItemsPerPage] = useState(6);
    const [historySortOrder, setHistorySortOrder] = useState<"asc" | "desc">(
        "desc"
    );

    // Schedule filter and pagination states
    const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
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

    const [newRequest, setNewRequest] = useState({
        parentName: "",
        phoneNumber: "",
        studentName: "",
        medicationName: "",
        form: "Tablet",
        dosage: "",
        route: "Uống",
        frequency: 1,
        totalQuantity: "",
        timeToAdminister: [""],
        startDate: "",
        endDate: "",
        note: "",
    });

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

    const handleAddTimeSlot = () => {
        setNewRequest((prev) => ({
            ...prev,
            timeToAdminister: [...prev.timeToAdminister, ""],
        }));
    };

    const fecthStudentById = useCallback(async () => {
        setLoading(true);
        try {
            const student = await FecthStudentById(studentId!);
            if (student) {
                setStudent(student);
                setLoading(false);
            } else {
                setError("Student not found");
                throw new Error("Student not found");
            }
        } catch (err) {
            console.error("Failed to fetch student by ID:", err);
            setError("Failed to fetch student by ID");
            setLoading(false);
            return null;
        }
    }, [studentId]);

    useEffect(() => {
        fecthStudentById();
    }, [fecthStudentById]);

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...newRequest.timeToAdminister];
        newTimes[index] = value;
        setNewRequest((prev) => ({ ...prev, timeToAdminister: newTimes }));
    };

    const handleSubmitRequest = () => {
        const request = {
            ...newRequest,
            uid: `MR${String(requests.length + 1).padStart(3, "0")}`,
            medicationRequestId: `REQ-2024-${String(requests.length + 1).padStart(
                3,
                "0"
            )}`,
            studentId: `ST${String(requests.length + 1).padStart(3, "0")}`,
            parentId: `P${String(requests.length + 1).padStart(3, "0")}`,
            remainingQuantity: parseInt(newRequest.totalQuantity),
            status: "active",
            createdBy: "Y tá Minh",
            createdDate: new Date().toISOString().split("T")[0],
        };

        setRequests([...(requests as any), request]);
        setNewRequest({
            parentName: "",
            phoneNumber: "",
            studentName: "",
            medicationName: "",
            form: "Tablet",
            dosage: "",
            route: "Uống",
            frequency: 1,
            totalQuantity: "",
            timeToAdminister: [""],
            startDate: "",
            endDate: "",
            note: "",
        });
        setShowAddForm(false);
    };

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
            toast.success(`Đã xác nhận cho thuốc thành công! Ghi chú: ${note}`);
        } else {
            toast.success("Đã xác nhận cho thuốc thành công!");
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
            toast.success("Đã xóa đơn thuốc thành công!");
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
            toast.success("Đã cập nhật đơn thuốc thành công!");
            setShowUpdateModal(false);
            setSelectedRequestForAction(null);
            setUpdateRequest({});
        }
    };

    // History filter and pagination functions
    const handleHistoryClearFilters = () => {
        setHistorySearchTerm("");
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
        <div>
            <ToastContainer position="top-right" autoClose={3000} />
            {loading && <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>}
            {error && <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>}
            {student && (
                <div className="p-4">
                    <div className="flex items-center gap-3 pb-5">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </Button>
                    </div>
                    <PageHeader
                        title={`Quản lý Thuốc Của Học Sinh ${student?.fullName || "học sinh"} - ${student?.studentCode}`}
                        icon={<Pill className="w-6 h-6 text-blue-600" />}
                        description="Quản lý thông tin thuốc và đơn thuốc của học sinh"
                    />
                    <ToastContainer position="top-right" autoClose={3000} />

                    <div className="flex justify-end mb-6 absolute top-[12rem] right-4">
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Thêm đơn thuốc</span>
                        </Button>
                    </div>

                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-3">
                        <Button
                            onClick={() => setActiveTab("requests")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "requests"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Danh sách đơn thuốc
                        </Button>
                        <Button
                            onClick={() => setActiveTab("schedule")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "schedule"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Lịch uống thuốc
                        </Button>
                        <Button
                            onClick={() => setActiveTab("history")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "history"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Lịch sử uống thuốc
                        </Button>
                    </div>
                    {activeTab === "requests" && (
                        <MedicationRequestsTab
                            requests={requests}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            onOpenConfirmModal={handleOpenConfirmModal}
                            onOpenUpdateModal={handleOpenUpdateModal}
                            onOpenDeleteModal={handleOpenDeleteModal}
                        />
                    )}

                    {activeTab === "schedule" && (
                        <MedicationScheduleTab
                            requests={requests}
                            scheduleSearchTerm={scheduleSearchTerm}
                            setScheduleSearchTerm={setScheduleSearchTerm}
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
            )}

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

            <AddMedicationModal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                newRequest={newRequest}
                setNewRequest={setNewRequest}
                onSubmit={handleSubmitRequest}
                onAddTimeSlot={handleAddTimeSlot}
                onTimeChange={handleTimeChange}
                medicationForms={medicationForms}
                routes={routes}
            />
        </div>
    );
};

export default CreateMedicalRequest;
