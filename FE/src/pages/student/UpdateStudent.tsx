import DatePicker from "@/components/ui/form/DateField";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import Select from "@/components/ui/form/Select";
import { FecthClass } from "@/services/SchoolClassService";
import { FecthStudentById, FecthUpdateStudents } from "@/services/UserService";
import { StudentUpdate } from "@/types/Student";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";
import { DateUtils } from "@/utils/DateUtils";

export default function UpdateStudents() {
  const { studentId } = useParams<{ studentId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentUpdate>({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    classId: "",
    image: null,
  });

  const options = useMemo(
    () => [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
    },
    [setFormData]
  );

  const handleClassChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, classId: value }));
    },
    [setFormData]
  );

  const handleSelectChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, gender: value }));
    },
    [setFormData]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [setFormData]
  );

  const loadUser = useCallback(async () => {
    if (!studentId) {
      setError("Student ID is required.");
      return;
    }
    try {
      const user = await FecthStudentById(studentId);
      if (user) {
        const newFormData = {
          fullName: user.fullName,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          classId: user.classId,
          image: null,
        };
        setFormData(newFormData);
        setError(null);
      } else {
        throw new Error("Student not found");
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("authenticated")
          ? "Please log in to view student data."
          : "Failed to load student data. Please try again."
      );
    }
  }, [studentId]);

  const handleGetClass = useCallback(async () => {
    try {
      const classRooms = await FecthClass();
      const options = classRooms.map((classRoom) => ({
        value: classRoom.id,
        label: classRoom.className,
      }));
      setClassOptions(options);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("authenticated")
          ? "Please log in to fetch parent data."
          : "Failed to fetch parent data. Please try again."
      );
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;

      setLoading(true);
      try {
        await Promise.all([loadUser(), handleGetClass()]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (studentId) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [studentId, loadUser, handleGetClass]);

  function prepareStudentUpdateData(data: StudentUpdate): StudentUpdate {
    return {
      ...data,
      dateOfBirth: DateUtils.customFormatDateOnly(data.dateOfBirth),
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (!formData.fullName || !formData.gender || !formData.classId) {
        throw new Error("Please fill in all required fields");
      }
      if (!studentId) {
        setError("Student ID is required.");
        return;
      }
      const payload = prepareStudentUpdateData(formData);
      const success = await FecthUpdateStudents(studentId, payload);
      if (success) {
        navigate("/dashboard/student");
        showToast.success("Cập nhật thành công");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred, please try again.";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/student");
  };

  return (
    <div className="p-6 bg-white">
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : error ? (
        <div
          role="alert"
          className="text-center text-red-600 p-4 bg-red-50 rounded-lg border border-red-200"
        >
          <p>{error}</p>
          {error.includes("authenticated") ? (
            <button
              onClick={() => navigate("/login")}
              aria-label="Đăng nhập để tiếp tục"
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              Đăng nhập
            </button>
          ) : (
            <button
              onClick={() => {
                setError(null);
                loadUser();
                handleGetClass();
              }}
              aria-label="Thử lại tải dữ liệu học sinh"
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="px-6 py-5">
            <h3 className="text-xl font-semibold text-gray-800">
              Cập nhật học sinh
            </h3>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="p-4 border-t border-gray-100">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="input-name"
                      className="text-gray-700 font-medium"
                    >
                      Họ và tên
                    </Label>
                    <Input
                      type="text"
                      name="fullName"
                      id="input-name"
                      onChange={handleInputChange}
                      value={formData.fullName}
                      placeholder="Nhập họ và tên"
                      className="mt-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Giới tính</Label>
                    <Select
                      options={[{ value: "Male", label: "Nam" }, { value: "Female", label: "Nữ" }]}
                      placeholder="Chọn giới tính"
                      onChange={handleSelectChange}
                      defaultValue={formData.gender}
                      className="mt-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <DatePicker
                      id="date-picker"
                      label="Ngày sinh"
                      placeholder="Chọn ngày sinh"
                      defaultDate={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                          : undefined
                      }
                      onChange={(dates, currentDateString) => {
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: currentDateString,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="input-class"
                      className="text-gray-700 font-medium"
                    >
                      Lớp học
                    </Label>
                    <SearchableSelect
                      options={classOptions}
                      defaultValue={formData.classId}
                      placeholder="Chọn lớp học"
                      onChange={handleClassChange}
                      className="mt-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Tải lên ảnh
                    </Label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-sm transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 hover:file:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
              <div className="text-right mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  disabled={loading}
                  className="ml-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
