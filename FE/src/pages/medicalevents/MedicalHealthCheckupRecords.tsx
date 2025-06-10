import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FecthMedicalHealthCheckupRecord,
    FecthUpdateHealthCheckupRecord,
} from "@/services/MedicalRecordService";
import {
    HealthCheckupRecord,
    MedicalHealthCheckupRecord,
} from "@/types/MedicalRecord";
import { Student } from "@/types/Student";
import { FecthStudentById } from "@/services/UserService";
import Label from "@/components/ui/form/Label";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import { Search, Eye, Ear, Calendar, User, Heart, CheckCircle, Clock } from 'lucide-react';
import PageHeader from "@/components/ui/PageHeader";

export default function MedicalHealthCheckupRecords() {
    const [medicalRecord, setMedicalRecord] = useState<
        MedicalHealthCheckupRecord[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const { eventDate } = useParams<{ eventDate: string }>();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [healthCheckupData, setHealthCheckupData] =
        useState<HealthCheckupRecord>({
            vision: "",
            hearing: "",
            dental: "",
            bmi: 0,
            abnormalNote: "",
        });
    const [searchTerm, setSearchTerm] = useState("");
    const [validateMessage, setValidateMessage] = useState({
        vision: "",
        hearing: "",
        dental: "",
        bmi: ""
    });
    const [isCurrentDate, setIsCurrentDate] = useState<boolean>(false);

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

    const validateHealthCheckupData = useCallback(() => {
        let isValid = true;
        const newErrors = {
            vision: "",
            hearing: "",
            dental: "",
            bmi: ""
        };

        if (!healthCheckupData.vision.trim()) {
            newErrors.vision = "Vui lòng nhập kết quả kiểm tra thị lực";
            isValid = false;
        }

        if (!healthCheckupData.hearing.trim()) {
            newErrors.hearing = "Vui lòng nhập kết quả kiểm tra thính lực";
            isValid = false;
        }

        if (!healthCheckupData.dental.trim()) {
            newErrors.dental = "Vui lòng nhập kết quả kiểm tra răng miệng";
            isValid = false;
        }

        if (healthCheckupData.bmi < 0 || healthCheckupData.bmi > 100) {
            newErrors.bmi = "BMI phải nằm trong khoảng 0-100";
            isValid = false;
        }

        setValidateMessage(newErrors);
        return isValid;
    }, [healthCheckupData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHealthCheckupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGetMedicalRecord = useCallback(async () => {
        setLoading(true);
        if (!eventDate) {
            setLoading(false);
            return;
        }
        const data = await FecthMedicalHealthCheckupRecord(eventDate);
        setMedicalRecord(data);
        setLoading(false);
    }, [eventDate]);

    useEffect(() => {
        handleGetMedicalRecord();
    }, [handleGetMedicalRecord]);

    useEffect(() => {
        if (eventDate) {
            const today = new Date();
            const eventDateObj = new Date(eventDate);
            const isToday = today.toDateString() === eventDateObj.toDateString();
            setIsCurrentDate(isToday);
        }
    }, [eventDate]);

    const handleUpdateHealthCheckupRecord = useCallback(
        async (e?: React.MouseEvent) => {
            if (e) e.preventDefault();

            if (!isCurrentDate) {
                toast.warning("Chỉ có thể cập nhật kết quả kiểm tra sức khỏe trong ngày hiện tại");
                return;
            }

            if (!selectedStudent?.id) {
                toast.warning("Vui lòng chọn học sinh trước khi cập nhật");
                return;
            }

            if (!validateHealthCheckupData()) {
                return;
            }

            try {
                setUpdating(true);
                const record = medicalRecord.find(
                    (r) => r.studentId === selectedStudent.id
                );
                if (!record) {
                    return;
                }
                const result = await FecthUpdateHealthCheckupRecord(
                    record.healthCheckUpId,
                    healthCheckupData
                );
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
        },
        [
            selectedStudent,
            medicalRecord,
            healthCheckupData,
            validateHealthCheckupData,
            isCurrentDate,
        ]
    );

    const handleClearForm = () => {
        setHealthCheckupData({
            vision: "",
            hearing: "",
            dental: "",
            bmi: 0,
            abnormalNote: "",
        });
    };

    const handleSelectStudent = (student: Student) => {
        handleClearForm();
        setSelectedStudent(student);
        const record = medicalRecord.find((r) => r.studentId === student.id);
        if (record) {
            setHealthCheckupData({
                vision: record.vision !== "None" ? record.vision : "",
                hearing: record.hearing !== "None" ? record.hearing : "",
                dental: record.dental !== "None" ? record.dental : "",
                bmi: record.bmi !== 0 ? record.bmi : 0,
                abnormalNote: record.abnormalNote !== "None" ? record.abnormalNote : "",
            });
        } else {
            setHealthCheckupData({
                vision: "",
                hearing: "",
                dental: "",
                bmi: 0,
                abnormalNote: "",
            });
        }
    };

    const handleNext = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            if (!selectedStudent) return;
            const currentIndex = filteredStudents.findIndex(
                (student) => student.id === selectedStudent.id
            );
            if (currentIndex < filteredStudents.length - 1) {
                handleSelectStudent(filteredStudents[currentIndex + 1]);
            }
        },
        [selectedStudent, students]
    );

    useEffect(() => {
        handleGetStudent();
    }, [handleGetStudent]);

    const filteredStudents = students.filter((student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (studentId: string) => {
        const record = medicalRecord.find(r => r.studentId === studentId);
        const isChecked = record?.recordDate !== '0001-01-01T00:00:00';

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isChecked
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
                            {medicalRecord.filter(r => r.recordDate !== '0001-01-01T00:00:00').length}
                        </div>
                        <div className="text-emerald-100 text-xs">Đã kiểm tra</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-2 text-white">
                        <div className="text-lg font-bold">
                            {medicalRecord.filter(r => r.recordDate === '0001-01-01T00:00:00').length}
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 min-h-[calc(100vh-200px)]">
                        {/* Student List */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:col-span-1">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <User size={18} />
                                        Danh sách học sinh
                                    </h2>
                                </div>
                                
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tên học sinh..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="overflow-auto">
                                {filteredStudents.map((student, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${selectedStudent?.id === student.id
                                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                            : 'hover:border-l-4 hover:border-l-blue-300'
                                            }`}
                                        onClick={() => handleSelectStudent(student)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{student.fullName}</h3>
                                                <div className="flex items-center gap-3 text-xs text-gray-600">
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
                                            <div className="ml-2">
                                                {getStatusBadge(student.id)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Student Details & Health Form */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:col-span-2">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 mb-2">
                                    Thông tin chi tiết học sinh
                                </h2>

                                {selectedStudent ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-xs text-gray-600 mb-0.5">Tên học sinh</div>
                                            <div className="font-semibold text-gray-900 text-sm">{selectedStudent.fullName}</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-xs text-gray-600 mb-0.5">Y tá phụ trách</div>
                                            <div className="font-semibold text-gray-900 text-sm">
                                                {medicalRecord.find(r => r.studentId === selectedStudent.id)?.nurseName === 'Pending To Update'
                                                    ? 'Chưa phân công'
                                                    : medicalRecord.find(r => r.studentId === selectedStudent.id)?.nurseName || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-xs text-gray-600 mb-0.5">Lớp học</div>
                                            <div className="font-semibold text-gray-900 text-sm">{selectedStudent.studentClass.className}</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 shadow-sm">
                                            <div className="text-xs text-gray-600 mb-0.5">Phòng học</div>
                                            <div className="font-semibold text-gray-900 text-sm">{selectedStudent.studentClass.classRoom}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <User size={32} className="mx-auto mb-1 text-gray-300" />
                                        <p className="text-sm">Chọn một học sinh để xem thông tin chi tiết</p>
                                    </div>
                                )}
                            </div>

                            {selectedStudent && (
                                <div className="p-3 flex-1 overflow-auto">
                                    <div className="space-y-3">
                                        {/* Vision & BMI */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div className="md:col-span-2">
                                                <Label htmlFor="vision" className="flex items-center gap-1">
                                                    <Eye size={14} className="text-blue-500" />
                                                    Thị lực
                                                </Label>
                                                <Input
                                                    id="vision"
                                                    name="vision"
                                                    type="text"
                                                    placeholder="Nhập kết quả kiểm tra mắt"
                                                    value={healthCheckupData.vision}
                                                    onChange={handleInputChange}
                                                    disabled={!isCurrentDate}
                                                    error={!!validateMessage.vision}
                                                />
                                                {validateMessage.vision && (
                                                    <p className="text-red-500 text-xs mt-0.5">{validateMessage.vision}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="bmi">BMI</Label>
                                                <Input
                                                    id="bmi"
                                                    name="bmi"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    placeholder="BMI"
                                                    value={healthCheckupData.bmi}
                                                    onChange={handleInputChange}
                                                    disabled={!isCurrentDate}
                                                    error={!!validateMessage.bmi}
                                                />
                                                {validateMessage.bmi && (
                                                    <p className="text-red-500 text-xs mt-0.5">{validateMessage.bmi}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hearing */}
                                        <div>
                                            <Label htmlFor="hearing" className="flex items-center gap-1">
                                                <Ear size={14} className="text-green-500" />
                                                Thính lực
                                            </Label>
                                            <Input
                                                id="hearing"
                                                name="hearing"
                                                type="text"
                                                placeholder="Nhập kết quả kiểm tra tai"
                                                value={healthCheckupData.hearing}
                                                onChange={handleInputChange}
                                                disabled={!isCurrentDate}
                                                error={!!validateMessage.hearing}
                                            />
                                            {validateMessage.hearing && (
                                                <p className="text-red-500 text-xs mt-0.5">{validateMessage.hearing}</p>
                                            )}
                                        </div>

                                        {/* Dental */}
                                        <div>
                                            <Label htmlFor="dental" className="flex items-center gap-1">
                                                <span className="text-yellow-500">🦷</span>
                                                Răng miệng
                                            </Label>
                                            <Input
                                                id="dental"
                                                name="dental"
                                                type="text"
                                                placeholder="Nhập kết quả kiểm tra răng"
                                                value={healthCheckupData.dental}
                                                onChange={handleInputChange}
                                                disabled={!isCurrentDate}
                                                error={!!validateMessage.dental}
                                            />
                                            {validateMessage.dental && (
                                                <p className="text-red-500 text-xs mt-0.5">{validateMessage.dental}</p>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <Label htmlFor="abnormalNote">Lưu ý bất thường</Label>
                                            <textarea
                                                id="abnormalNote"
                                                value={healthCheckupData.abnormalNote !== "None" ? healthCheckupData.abnormalNote : ""}
                                                onChange={(e) => {
                                                    setHealthCheckupData({
                                                        ...healthCheckupData,
                                                        abnormalNote: e.target.value,
                                                    });
                                                }}
                                                placeholder="Nhập lưu ý sau khi kiểm tra"
                                                rows={2}
                                                disabled={updating || !isCurrentDate}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-3">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className={`px-3 py-1 text-xs font-medium border-2 w-1/3 ${updating || !isCurrentDate ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                                onClick={handleUpdateHealthCheckupRecord}
                                                type="button"
                                                disabled={updating || !isCurrentDate}
                                            >
                                                {updating ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                                        Đang cập nhật...
                                                    </div>
                                                ) : (
                                                    "Cập nhật"
                                                )}
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className={`px-3 py-1 text-xs font-medium border-2 w-1/3 ${updating ? "opacity-50 cursor-not-allowed" : ""
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
