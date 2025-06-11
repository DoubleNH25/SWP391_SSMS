import { Button } from "@/components/ui/button";
import Label from "@/components/ui/form/Label";
import PageHeader from "@/components/ui/PageHeader";
import { FecthMedicalVaccinationRecord, FecthUpdateVaccinationRecord } from "@/services/MedicalRecordService";
import { customFormatDateForBackend } from "@/types/CalendarEvent";
import { FecthStudentById } from "@/services/UserService";
import type { MedicalVaccinationRecord, VaccinationRecord } from "@/types/MedicalRecord";
import { Student } from "@/types/Student";
import { Search, User,CheckCircle, Clock, Heart } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MedicalVaccinationRecord() {
    const [medicalRecord, setMedicalRecord] = useState<MedicalVaccinationRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const { eventDate } = useParams<{ eventDate: string}>();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [vaccinationData, setVaccinationData] = useState<VaccinationRecord>({
        resultNote: "",
        vaccinatedAt: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [isCurrentDate, setIsCurrentDate] = useState<boolean>(false);

    const handleGetMedicalRecord = useCallback(async () => {
        setLoading(true);
        if (!eventDate) {
            setLoading(false);
            return;
        }
        const data = await FecthMedicalVaccinationRecord(eventDate);
        setMedicalRecord(data);
        setLoading(false);
    }, [eventDate]);

    const handleGetStudent = useCallback(async () => {
        if (!medicalRecord) {
            setLoading(false);
            return;
        }
        const data = await Promise.all(
            medicalRecord.map(async (record) => {
                const student = await FecthStudentById(record.studentId);
                return student;
            })
        );
        setStudents(data as Student[]);
    }, [medicalRecord]);

    useEffect(() => {
        if (eventDate) {
            const today = new Date();
            const eventDateObj = new Date(eventDate);
            const isToday = today.toDateString() === eventDateObj.toDateString();
            setIsCurrentDate(isToday);
        }
    }, [eventDate]);

    const handleUpdateVaccinationRecord = useCallback(async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        if (!isCurrentDate) {
            toast.warning("Chỉ có thể cập nhật kết quả tiêm vaccine trong ngày hiện tại");
            return;
        }

        if (!selectedStudent?.id) {
            return;
        }
        setUpdating(true);
        try {
            const record = medicalRecord.find(r => r.studentId === selectedStudent.id);
            if (!record) {
                return;
            }
            vaccinationData.vaccinatedAt = customFormatDateForBackend(new Date());
            const result = await FecthUpdateVaccinationRecord(record.id, vaccinationData);
            if (result) {
                toast.success("Cập nhật thành công");
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật");
        } finally {
            setUpdating(false);
        }
    }, [selectedStudent, medicalRecord, vaccinationData, isCurrentDate]);

    const handleNext = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;
        const currentIndex = filteredStudents.findIndex(student => student.id === selectedStudent.id);
        if (currentIndex < filteredStudents.length - 1) {
            handleSelectStudent(filteredStudents[currentIndex + 1]);
        }
    }, [selectedStudent, students]);

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        const record = medicalRecord.find(r => r.studentId === student.id);
        if (record) {
            setVaccinationData({
                resultNote: record.resultNote !== "None" ? record.resultNote : "",
                vaccinatedAt: record.vaccinatedAt || ""
            });
        } else {
            setVaccinationData({
                resultNote: "",
                vaccinatedAt: ""
            });
        }
    };

    useEffect(() => {
        handleGetMedicalRecord();
    }, [eventDate, handleGetMedicalRecord]);

    useEffect(() => {
        handleGetStudent();
    }, [handleGetStudent]);

    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (studentId: string) => {
        const record = medicalRecord.find(r => r.studentId === studentId);
        const isChecked = record?.vaccinatedAt !== '0001-01-01T00:00:00';
        
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isChecked 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            {isChecked ? <CheckCircle size={12} /> : <Clock size={12} />}
            {isChecked ? 'Đã kiểm tra' : 'Chưa kiểm tra'}
          </span>
        );
      };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-2">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <PageHeader
                    title="Sự kiện kiểm tra sức khỏe"
                    icon={<Heart className="w-6 h-6 text-red-600" />}
                    description={`Ngày ${new Date(eventDate || "").toLocaleDateString("vi-VN")}`}
                />

                <div className="flex items-center justify-end gap-3 mb-6 absolute right-[1rem] top-[6rem]">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-2 text-white">
                        <div className="text-lg font-bold">{students.length}</div>
                        <div className="text-blue-100 text-xs">Tổng học sinh</div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-2 text-white">
                        <div className="text-lg font-bold">
                            {medicalRecord.filter(r => r.vaccinatedAt !== '0001-01-01T00:00:00').length}
                        </div>
                        <div className="text-emerald-100 text-xs">Đã kiểm tra</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-2 text-white">
                        <div className="text-lg font-bold">
                            {medicalRecord.filter(r => r.vaccinatedAt === '0001-01-01T00:00:00').length}
                        </div>
                        <div className="text-amber-100 text-xs">Chưa kiểm tra</div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[calc(100vh-200px)]">
                        {/* Student List */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:col-span-1">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <User size={20} />
                                        Danh sách học sinh
                                    </h2>
                                </div>
                                
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên học sinh..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="overflow-auto">
                                {filteredStudents.map((student, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                                            selectedStudent?.id === student.id 
                                                ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                                                : 'hover:border-l-4 hover:border-l-blue-300'
                                        }`}
                                        onClick={() => handleSelectStudent(student)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">{student.fullName}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        Lớp: {" "}
                                                        {student.studentClass.className}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        Phòng: {" "}
                                                        {student.studentClass.classRoom}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {getStatusBadge(student.id)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Student Details & Vaccination Form */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:col-span-2">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-3">
                                    Thông tin chi tiết học sinh
                                </h2>
                                
                                {selectedStudent ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-sm text-gray-600 mb-1">Tên học sinh</div>
                                            <div className="font-semibold text-gray-900">{selectedStudent.fullName}</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-sm text-gray-600 mb-1">Tên vaccine</div>
                                            <div className="font-semibold text-gray-900">
                                                {medicalRecord.find(r => r.studentId === selectedStudent.id)?.vaccineName || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-sm text-gray-600 mb-1">Lớp học</div>
                                            <div className="font-semibold text-gray-900">{selectedStudent.studentClass.className}</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-sm text-gray-600 mb-1">Phòng học</div>
                                            <div className="font-semibold text-gray-900">{selectedStudent.studentClass.classRoom}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <User size={40} className="mx-auto mb-2 text-gray-300" />
                                        <p>Chọn một học sinh để xem thông tin chi tiết</p>
                                    </div>
                                )}
                            </div>

                            {selectedStudent && (
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {/* Notes */}
                                        <div>
                                            <Label htmlFor="resultNote">Ghi chú sau khi tiêm</Label>
                                            <textarea
                                                id="resultNote"
                                                value={vaccinationData.resultNote !== "None" ? vaccinationData.resultNote : ""}
                                                onChange={(e) => {
                                                    setVaccinationData({ ...vaccinationData, resultNote: e.target.value });
                                                }}
                                                placeholder="Nhập ghi chú sau khi tiêm"
                                                rows={2}
                                                disabled={updating || !isCurrentDate}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className={`px-3 py-1.5 text-xs font-medium border-2 w-1/3 ${
                                                    updating || !isCurrentDate ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                onClick={handleUpdateVaccinationRecord}
                                                type="button"
                                                disabled={updating || !isCurrentDate}
                                            >
                                                {updating ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Đang cập nhật...
                                                    </div>
                                                ) : (
                                                    "Cập nhật"
                                                )}
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className={`px-3 py-1.5 text-xs font-medium border-2 w-1/3 ${
                                                    updating ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                                onClick={handleNext}
                                                type="button"
                                                disabled={updating}
                                            >
                                                Tiếp theo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
