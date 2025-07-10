import { Button } from "@/components/ui/button";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import PageHeader from "@/components/ui/PageHeader";
import {
  DeleteHealthProfile,
  FecthCreateHealthProfile,
  FecthHealthProfileByStudentId,
  FecthUpdateHealthProfileNurse,
} from "@/services/HealthProfileService";
import { FecthStudentById } from "@/services/UserService";
import {
  HealthProfile,
  HealthProfileUpdate,
  Student,
} from "@/types/HealthProfile";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";
import { PencilIcon } from "lucide-react";

export default function UpdateCreateHealthProfile() {
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(
    null
  );
  const [formData, setFormData] = useState<HealthProfileUpdate>({
    vision: "",
    hearing: "",
    dental: "",
    height: 0,
    weight: 0,
    bmi: 0,
    abnormalNote: "",
    vaccinationHistory: "",
  });
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const fetchStudent = useCallback(async (studentId: string) => {
    setLoading(true);
    try {
      const response = await FecthStudentById(studentId);
      setStudent(response);
    } catch {
      // setError(
      //   err instanceof Error && err.message.includes("authenticated")
      //     ? "Vui lòng đăng nhập để xem hồ sơ sức khỏe."
      //     : "Không thể lấy dữ liệu hồ sơ sức khỏe. Vui lòng thử lại sau."
      // );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFormData = useCallback(() => {
    setFormData({
      vision: "",
      hearing: "",
      dental: "",
      height: 0,
      weight: 0,
      bmi: 0,
      abnormalNote: "",
      vaccinationHistory: "",
    });
    setHealthProfile(null);
  }, []);

  const fetchHealthProfile = useCallback(
    async (studentId: string) => {
      setLoading(true);
      try {
        const response = await FecthHealthProfileByStudentId(studentId);
        setHealthProfile(response);
        const data = {
          vision: response?.vision || "",
          hearing: response?.hearing || "",
          dental: response?.dental || "",
          height: response?.height || 0,
          weight: response?.weight || 0,
          bmi: response?.bmi || 0,
          abnormalNote: response?.abnormalNote || "",
          vaccinationHistory: response?.vaccinationHistory || "",
        };
        setFormData(data);
      } catch {
        clearFormData();
      } finally {
        setLoading(false);
      }
    },
    [clearFormData]
  );

  const handleDelete = useCallback(async () => {
    try {
      await DeleteHealthProfile(studentId || "");
      navigate(-1);
      setTimeout(() => {
        showToast.success("Xóa thành công");
      }, 100);
    } catch {
      showToast.error("Xóa thất bại");
    }
  }, [studentId, navigate]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setFormData(
        (prev) =>
          ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
          } as HealthProfileUpdate)
      );
    },
    []
  );

  // Tính BMI tự động khi nhập chiều cao/cân nặng
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightM = formData.height / 100;
      const bmi = formData.weight / (heightM * heightM);
      setFormData((prev) => ({ ...prev, bmi: Number(bmi.toFixed(1)) }));
    }
  }, [formData.height, formData.weight]);

  useEffect(() => {
    if (studentId) {
      fetchHealthProfile(studentId);
      fetchStudent(studentId);
    }
  }, [studentId, fetchHealthProfile, fetchStudent]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        if (healthProfile && studentId) {
          await FecthUpdateHealthProfileNurse(studentId, formData);
          navigate(-1);
          setTimeout(() => {
            showToast.success("Cập nhật thành công");
          }, 100);
        } else if (!healthProfile && studentId) {
          await FecthCreateHealthProfile(studentId, formData);
          navigate(-1);
          setTimeout(() => {
            showToast.success("Tạo hồ sơ sức khỏe thành công");
          }, 100);
        }
      } catch {
        showToast.error("Cập nhật thất bại");
      }
    },
    [formData, studentId, navigate, healthProfile]
  );

  return (
    <>
      {loading && <div>Loading...</div>}
      {student && (
        <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md mx-auto w-3/4 mt-5">
          <PageHeader title="Cập nhật hồ sơ sức khỏe" icon={<PencilIcon />} />
          {!healthProfile && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Học sinh này chưa có hồ sơ sức khỏe. Vui lòng nhập thông tin
                    sức khỏe.
                  </p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 justify-between">
              <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-2">Thông tin học sinh</h2>
                <div className="flex flex-col gap-2">
                  <p>Tên: {student?.fullName}</p>
                  <p>Giới tính: {student?.gender === "Male" ? "Nam" : "Nữ"}</p>
                  <p>
                    Ngày sinh:{" "}
                    {new Date(student?.dateOfBirth || "").toLocaleDateString()}
                  </p>
                  <p>Lớp: {student?.studentClass.className}</p>
                  <p>Phòng học: {student?.studentClass.classRoom}</p>
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold mb-2">
                    Thông tin sức khỏe
                  </h2>
                  <Label>Mắt</Label>
                  <Input
                    type="text"
                    value={formData?.vision || healthProfile?.vision || ""}
                    onChange={handleInputChange}
                    name="vision"
                  />
                  <Label>Tai</Label>
                  <Input
                    type="text"
                    value={formData?.hearing || healthProfile?.hearing || ""}
                    onChange={handleInputChange}
                    name="hearing"
                  />
                  <div className="flex flex-row gap-2">
                    <div className="w-full">
                      <Label>Răng</Label>
                      <Input
                        type="text"
                        value={formData?.dental || healthProfile?.dental || ""}
                        onChange={handleInputChange}
                        name="dental"
                      />
                    </div>
                    <div className="w-1/3">
                      <Label>Chiều cao (cm)</Label>
                      <Input
                        type="text"
                        value={
                          formData?.height !== undefined
                            ? String(formData.height)
                            : healthProfile?.height !== undefined
                            ? String(healthProfile.height)
                            : ""
                        }
                        onChange={handleInputChange}
                        name="height"
                      />
                    </div>
                    <div className="w-1/3">
                      <Label>Cân nặng (kg)</Label>
                      <Input
                        type="text"
                        value={
                          formData?.weight !== undefined
                            ? String(formData.weight)
                            : healthProfile?.weight !== undefined
                            ? String(healthProfile.weight)
                            : ""
                        }
                        onChange={handleInputChange}
                        name="weight"
                      />
                    </div>
                    <div className="w-1/3">
                      <Label>BMI</Label>
                      <Input
                        type="number"
                        value={formData?.bmi || healthProfile?.bmi || ""}
                        name="bmi"
                        disabled
                      />
                    </div>
                  </div>
                  <Label>Chú ý bất thường</Label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={
                      formData?.abnormalNote ||
                      healthProfile?.abnormalNote ||
                      ""
                    }
                    rows={4}
                    onChange={handleInputChange}
                    name="abnormalNote"
                  />
                  <Label>Lịch sử tiêm chủng</Label>
                  <Input
                    type="text"
                    value={
                      formData?.vaccinationHistory ||
                      healthProfile?.vaccinationHistory ||
                      ""
                    }
                    onChange={handleInputChange}
                    name="vaccinationHistory"
                  />
                </div>
              </div>
            </div>
            <div className="text-right mt-2">
              <Button
                type="submit"
                className="mt-4 bg-blue-600 w-[10%] hover:bg-blue-700 text-white py-2 rounded"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              {healthProfile && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="mt-4 bg-red-600 ml-4 w-[10%] hover:bg-red-700 text-white py-2 rounded"
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              )}
              <Button
                onClick={() => navigate(-1)}
                disabled={loading}
                type="button"
                className="mt-4 w-[10%] ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
