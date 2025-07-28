import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Search,
  Eye,
  Ear,
  User,
  Heart,
  CheckCircle,
  Clock,
  ArrowLeft,
  Ruler,
  Weight,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { showToast } from "@/components/ui/Toast";
import { DecodeJWT } from "@/utils/DecodeJWT";

export default function MedicalHealthCheckupRecords() {
  const [medicalRecord, setMedicalRecord] = useState<
    MedicalHealthCheckupRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const { eventDate, id } = useParams<{ eventDate: string; id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [healthCheckupData, setHealthCheckupData] =
    useState<HealthCheckupRecord>({
      vision: "",
      hearing: "",
      height: 0,
      weight: 0,
      dental: "",
      bmi: 0,
      abnormalNote: "",
      checkingStatus: "Normal",
    });
  const navigaton = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [validateMessage, setValidateMessage] = useState({
    vision: "",
    hearing: "",
    dental: "",
    bmi: "",
    height: "",
    weight: "",
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

  // Validation functions for all health fields
  const validateVision = (vision: string) => {
    if (!vision.trim()) return "Thị lực không được để trống";

    // Kiểm tra format thị lực (ví dụ: 20/20, 20/40, 6/6, etc.)
    const visionPattern = /^(\d+\/\d+|\d+\.\d+|\d+)$/;
    if (!visionPattern.test(vision.trim())) {
      return "Định dạng thị lực không hợp lệ (VD: 20/20, 6/6, 0.8)";
    }

    return "";
  };

  const validateHearing = (hearing: string) => {
    if (!hearing.trim()) return "Thính lực không được để trống";

    const validHearingValues = [
      "Bình thường",
      "Tốt",
      "Khá",
      "Trung bình",
      "Kém",
      "Điếc",
      "Normal",
      "Good",
      "Fair",
      "Poor",
      "Deaf",
      "Không có vấn đề",
      "Có vấn đề nhẹ",
      "Cần kiểm tra thêm",
    ];

    if (
      !validHearingValues.some((value) =>
        hearing.toLowerCase().includes(value.toLowerCase())
      )
    ) {
      return "Giá trị thính lực không hợp lệ";
    }

    return "";
  };

  const validateDental = (dental: string) => {
    if (!dental.trim()) return "Tình trạng răng miệng không được để trống";

    const validDentalValues = [
      "Tốt",
      "Bình thường",
      "Khá",
      "Cần chăm sóc",
      "Có sâu răng",
      "Good",
      "Normal",
      "Fair",
      "Needs care",
      "Has cavities",
      "Không có vấn đề",
      "Cần điều trị",
      "Đã điều trị",
    ];

    if (
      !validDentalValues.some((value) =>
        dental.toLowerCase().includes(value.toLowerCase())
      )
    ) {
      return "Giá trị răng miệng không hợp lệ";
    }

    return "";
  };

  const validateHeight = (height: number) => {
    if (height <= 0) return "Chiều cao phải lớn hơn 0";
    if (height < 50 || height > 250) return "Chiều cao phải từ 50-250 cm";
    return "";
  };

  const validateWeight = (weight: number) => {
    if (weight <= 0) return "Cân nặng phải lớn hơn 0";
    if (weight < 10 || weight > 200) return "Cân nặng phải từ 10-200 kg";
    return "";
  };

  const validateHealthCheckupData = useCallback(() => {
    let isValid = true;
    const newErrors = {
      vision: "",
      hearing: "",
      dental: "",
      bmi: "",
      height: "",
      weight: "",
    };

    const visionError = validateVision(healthCheckupData.vision);
    if (visionError) {
      newErrors.vision = visionError;
      isValid = false;
    }

    const hearingError = validateHearing(healthCheckupData.hearing);
    if (hearingError) {
      newErrors.hearing = hearingError;
      isValid = false;
    }

    const dentalError = validateDental(healthCheckupData.dental);
    if (dentalError) {
      newErrors.dental = dentalError;
      isValid = false;
    }

    const heightError = validateHeight(healthCheckupData.height);
    if (heightError) {
      newErrors.height = heightError;
      isValid = false;
    }

    const weightError = validateWeight(healthCheckupData.weight);
    if (weightError) {
      newErrors.weight = weightError;
      isValid = false;
    }

    if (healthCheckupData.bmi < 0 || healthCheckupData.bmi > 100) {
      newErrors.bmi = "BMI phải nằm trong khoảng 0-100";
      isValid = false;
    }

    setValidateMessage(newErrors);
    return isValid;
  }, [healthCheckupData]);

  const calculateBMI = (weight: number, height: number): number => {
    if (weight <= 0 || height <= 0) return 0;
    // BMI = weight(kg) / (height(m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 100) / 100; // Round to 2 decimal places
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberFields = ["height", "weight", "bmi"];

    setHealthCheckupData((prev) => {
      const newData = {
        ...prev,
        [name]: numberFields.includes(name) ? Number(value) : value
      };

      // Auto-calculate BMI when height or weight changes
      if (name === "height" || name === "weight") {
        const newHeight = name === "height" ? Number(value) : prev.height;
        const newWeight = name === "weight" ? Number(value) : prev.weight;
        newData.bmi = calculateBMI(newWeight, newHeight);
      }

      return newData;
    });
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "vision":
        error = validateVision(value);
        break;
      case "hearing":
        error = validateHearing(value);
        break;
      case "dental":
        error = validateDental(value);
        break;
      case "height":
        error = validateHeight(Number(value));
        break;
      case "weight":
        error = validateWeight(Number(value));
        break;
    }

    if (error) {
      setValidateMessage((prev) => ({ ...prev, [name]: error }));
    } else {
      setValidateMessage((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGetMedicalRecord = useCallback(async () => {
    setLoading(true);
    if (!eventDate || !id) {
      setLoading(false);
      return;
    }
    const data = await FecthMedicalHealthCheckupRecord(id, eventDate);
    setMedicalRecord(data);
    setLoading(false);
  }, [eventDate, id]);

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

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.preventDefault();
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

  const handleUpdateHealthCheckupRecord = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) e.preventDefault();

      if (!isCurrentDate) {
        showToast.warning(
          "Chỉ có thể cập nhật kết quả kiểm tra sức khỏe trong ngày hiện tại"
        );
        return;
      }

      if (!selectedStudent?.id) {
        showToast.warning("Vui lòng chọn học sinh trước khi cập nhật");
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
          showToast.error("Không thể cập nhật kết quả kiểm tra sức khỏe");
          return;
        }
        if (!record.healthCheckUpId) {
          showToast.error("Không thể cập nhật kết quả kiểm tra sức khỏe");
          return;
        }
        console.log(healthCheckupData);
        const result = await FecthUpdateHealthCheckupRecord(
          record.healthCheckUpId,
          healthCheckupData
        );
        if (result) {
          showToast.success("Cập nhật thành công");
          // Cập nhật local state
          setMedicalRecord((prev) =>
            prev.map((r) =>
              r.studentId === selectedStudent.id
                ? {
                  ...r,
                  ...healthCheckupData,
                  recordDate: new Date().toISOString(),
                }
                : r
            )
          );
          handleNext();
        } else {
          showToast.error("Cập nhật thất bại");
        }
      } catch (error) {
        showToast.error("Có lỗi xảy ra khi cập nhật");
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
      handleNext,
      handleGetMedicalRecord,
    ]
  );

  const handleClearForm = () => {
    setHealthCheckupData({
      vision: "",
      hearing: "",
      dental: "",
      height: 0,
      weight: 0,
      bmi: 0,
      abnormalNote: "",
      checkingStatus: "Normal",
    });
  };

  const handleSelectStudent = (student: Student) => {
    handleClearForm();
    setSelectedStudent(student);
    const record = medicalRecord.find((r) => r.studentId === student.id);
    if (record) {
      const height = record.height !== 0 ? record.height : 0;
      const weight = record.weight !== 0 ? record.weight : 0;
      const calculatedBMI = calculateBMI(weight, height);
      
      setHealthCheckupData({
        vision: record.vision !== "None" ? record.vision : "",
        hearing: record.hearing !== "None" ? record.hearing : "",
        dental: record.dental !== "None" ? record.dental : "",
        bmi: calculatedBMI,
        height: height,
        weight: weight,
        abnormalNote: record.abnormalNote !== "None" ? record.abnormalNote : "",
        checkingStatus:
          record.checkingStatus === "Abnormal" ? "Abnormal" : "Normal",
      });
    } else {
      setHealthCheckupData({
        vision: "",
        hearing: "",
        dental: "",
        bmi: 0,
        abnormalNote: "",
        height: 0,
        weight: 0,
        checkingStatus: "Normal",
      });
    }
  };

  useEffect(() => {
    handleGetStudent();
  }, [handleGetStudent]);

  const filteredStudents = students.filter((student) =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (studentId: string) => {
    const record = medicalRecord.find((r) => r.studentId === studentId);
    const isChecked = record?.recordDate !== "0001-01-01T00:00:00";
    const isAbnormal = record?.checkingStatus === "Abnormal";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${isChecked
          ? isAbnormal
            ? "bg-red-100 text-red-700 border-red-300"
            : "bg-emerald-100 text-emerald-700 border-emerald-200"
          : "bg-amber-100 text-amber-700 border-amber-200"
          }`}
      >
        {isChecked ? (
          isAbnormal ? (
            <>
              <span className="text-red-500">⚠</span> Bất thường
            </>
          ) : (
            <>
              <CheckCircle size={12} /> Đã kiểm tra
            </>
          )
        ) : (
          <>
            <Clock size={12} /> Chưa kiểm tra
          </>
        )}
      </span>
    );
  };

  const payload = DecodeJWT();
  const useName =
    payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-2">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-3 px-4 my-5">
          <Button
            variant="outline"
            onClick={() => navigaton(-1)}
            className="flex items-center gap-2 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>
        <PageHeader
          title="Sự kiện kiểm tra sức khỏe"
          icon={<Heart className="w-6 h-6 text-red-600" />}
          description={`Ngày ${new Date(eventDate || "").toLocaleDateString(
            "vi-VN"
          )}`}
        />
        <div className="flex items-center justify-end gap-3 mb-6 absolute right-[1rem] top-[6rem]">
          <div className="w-28 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-2 text-white text-center">
            <div className="text-lg font-bold">{students.length}</div>
            <div className="text-blue-100 text-xs">Tổng học sinh</div>
          </div>
          <div className="w-28 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-2 text-white text-center">
            <div className="text-lg font-bold">
              {
                medicalRecord.filter(
                  (r) => r.recordDate !== "0001-01-01T00:00:00"
                ).length
              }
            </div>
            <div className="text-emerald-100 text-xs">Đã kiểm tra</div>
          </div>

          <div className="w-28 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-2 text-white text-center">
            <div className="text-lg font-bold">
              {
                medicalRecord.filter(
                  (r) => r.recordDate === "0001-01-01T00:00:00"
                ).length
              }
            </div>
            <div className="text-amber-100 text-xs">Chưa kiểm tra</div>
          </div>

          <div className="w-28 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-2 text-white text-center">
            <div className="text-lg font-bold">
              {
                medicalRecord.filter((r) => r.checkingStatus === "Abnormal")
                  .length
              }
            </div>
            <div className="text-red-100 text-xs">Bất thường</div>
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
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
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
                {filteredStudents.map((student, index) => {
                  const record = medicalRecord.find(
                    (r) => r.studentId === student.id
                  );
                  return (
                    <div
                      key={index}
                      className={`p-2 border-b border-gray-100 cursor-pointer transition-all duration-200 ${selectedStudent?.id === student.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : record?.checkingStatus === "Abnormal"
                          ? "bg-red-50 hover:border-l-4 hover:border-l-red-300"
                          : "hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-300"
                        }`}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                            {student.fullName} - {student.studentCode}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              Lớp: {student.studentClass.className}
                            </span>
                            <span className="flex items-center gap-1">
                              Phòng: {student.studentClass.classRoom}
                            </span>
                          </div>
                        </div>
                        <div className="ml-2">{getStatusBadge(student.id)}</div>
                      </div>
                    </div>
                  );
                })}
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
                      <div className="text-xs text-gray-600 mb-0.5">
                        Tên học sinh
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {selectedStudent.fullName}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-gray-600 mb-0.5">
                        Y tá phụ trách
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {medicalRecord.find(
                          (r) => r.studentId === selectedStudent.id
                        )?.nurseName === "Pending To Update"
                          ? `${useName}`
                          : medicalRecord.find(
                            (r) => r.studentId === selectedStudent.id
                          )?.nurseName || "N/A"}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-gray-600 mb-0.5">
                        Lớp học
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {selectedStudent.studentClass.className}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="text-xs text-gray-600 mb-0.5">
                        Phòng học
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {selectedStudent.studentClass.classRoom}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <User size={32} className="mx-auto mb-1 text-gray-300" />
                    <p className="text-sm">
                      Chọn một học sinh để xem thông tin chi tiết
                    </p>
                  </div>
                )}
              </div>

              {selectedStudent && (
                <div className="p-3 flex-1 overflow-auto">
                  <div className="space-y-3">
                    {/* Vision & BMI */}
                    <div className="">
                      <div className="">
                        <Label
                          htmlFor="vision"
                          className="flex items-center gap-1"
                        >
                          <Eye size={14} className="text-blue-500" />
                          Thị lực
                        </Label>
                        <Input
                          id="vision"
                          name="vision"
                          type="text"
                          placeholder="VD: 20/20, 6/6, 0.8"
                          value={healthCheckupData.vision}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          disabled={!isCurrentDate}
                          error={!!validateMessage.vision}
                        />
                        {validateMessage.vision && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {validateMessage.vision}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          Định dạng: 20/20, 6/6, 0.8 (thị lực chuẩn)
                        </p>
                      </div>
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <Label
                          htmlFor="height"
                          className="flex items-center gap-1"
                        >
                          <Ruler size={14} className="text-purple-500" />
                          Chiều cao (cm)
                        </Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          min="50"
                          max="250"
                          placeholder="VD: 170"
                          value={healthCheckupData.height}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          disabled={!isCurrentDate}
                          error={!!validateMessage.height}
                        />
                        {validateMessage.height && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {validateMessage.height}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          Phạm vi: 50-250 cm
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor="weight"
                          className="flex items-center gap-1"
                        >
                          <Weight size={14} className="text-orange-500" />
                          Cân nặng (kg)
                        </Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          min="10"
                          max="200"
                          placeholder="VD: 65"
                          value={healthCheckupData.weight}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          disabled={!isCurrentDate}
                          error={!!validateMessage.weight}
                        />
                        {validateMessage.weight && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {validateMessage.weight}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          Phạm vi: 10-200 kg
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="bmi">BMI</Label>
                        <Input
                          id="bmi"
                          name="bmi"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Tự động tính"
                          value={healthCheckupData.bmi}
                          onChange={handleInputChange}
                          disabled={true}
                          error={!!validateMessage.bmi}
                        />
                        {validateMessage.bmi && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {validateMessage.bmi}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Hearing */}
                    <div>
                      <Label
                        htmlFor="hearing"
                        className="flex items-center gap-1"
                      >
                        <Ear size={14} className="text-green-500" />
                        Thính lực
                      </Label>
                                              <Input
                          id="hearing"
                          name="hearing"
                          type="text"
                          placeholder="VD: Bình thường, Tốt, Khá"
                          value={healthCheckupData.hearing}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          disabled={!isCurrentDate}
                          error={!!validateMessage.hearing}
                        />
                                              {validateMessage.hearing && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {validateMessage.hearing}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          Bình thường, Tốt, Khá, Trung bình, Kém, Điếc
                        </p>
                      </div>

                    {/* Dental */}
                    <div>
                      <Label
                        htmlFor="dental"
                        className="flex items-center gap-1"
                      >
                        <span className="text-yellow-500">🦷</span>
                        Răng miệng
                      </Label>
                                              <Input
                          id="dental"
                          name="dental"
                          type="text"
                          placeholder="VD: Tốt, Bình thường, Có sâu răng"
                          value={healthCheckupData.dental}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          disabled={!isCurrentDate}
                          error={!!validateMessage.dental}
                        />
                                              {validateMessage.dental && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {validateMessage.dental}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">
                          Tốt, Bình thường, Khá, Cần chăm sóc, Có sâu răng
                        </p>
                      </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="abnormalNote">Lưu ý bất thường</Label>
                      <textarea
                        id="abnormalNote"
                        value={
                          healthCheckupData.abnormalNote !== "None"
                            ? healthCheckupData.abnormalNote
                            : ""
                        }
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
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hasAbnormal"
                          checked={
                            healthCheckupData.checkingStatus === "Abnormal"
                          }
                          onChange={(e) => {
                            setHealthCheckupData((prev) => ({
                              ...prev,
                              checkingStatus: e.target.checked
                                ? "Abnormal"
                                : "Normal",
                            }));
                          }}
                          disabled={updating || !isCurrentDate}
                          className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
                        />
                        <label
                          htmlFor="hasAbnormal"
                          className="ml-2 text-sm font-medium text-gray-700"
                        >
                          Có bất thường
                        </label>
                      </div>

                      {healthCheckupData.checkingStatus === "Abnormal" && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          Cần theo dõi
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="default"
                        size="sm"
                        className={`px-3 py-1 text-xs font-medium border-2 w-1/3 ${updating || !isCurrentDate
                          ? "opacity-50 cursor-not-allowed"
                          : ""
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
