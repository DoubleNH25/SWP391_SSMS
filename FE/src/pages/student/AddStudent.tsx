import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FecthCreateStudents, FecthParents } from "@/services/UserService";
import { StudentCreate } from "@/types/Student";
import DatePicker from "@/components/ui/form/DateField";
import SearchableSelect from "@/components/ui/form/SearchableSelect";
import { showToast } from "@/components/ui/Toast";
import { FecthClass } from "@/services/SchoolClassService";
import { SchoolClass } from "@/types/SchoolClass";
import { DateUtils } from "@/utils/DateUtils";

export default function AddStudent() {
  const [error, setError] = useState<string | null>(null);
  const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    parentId: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    classId: string;
    image: File | null;
  }>({
    parentId: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    classId: "",
    image: null
  });
  const navigate = useNavigate();

  const handleGetParent = useCallback(async () => {
    setLoading(true);
    try {
      const parents = await FecthParents();
      const options = parents.map(parent => ({
        value: parent.id,
        label: parent.fullName
      }));
      setParentOptions(options);
      setError(null);
    } catch (err) {
      setError(err instanceof Error && err.message.includes('authenticated')
        ? 'Vui lòng đăng nhập để tải dữ liệu phụ huynh.'
        : 'Không thể tải dữ liệu phụ huynh. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetClass = useCallback(async () => {
    setLoading(true);
    const classes = await FecthClass();
    const options = classes.map((classItem: SchoolClass) => ({
      value: classItem.id,
      label: classItem.className
    }));
    setClassOptions(options);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleGetParent();
    handleGetClass();
  }, [handleGetClass, handleGetParent]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [setFormData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  }, [setFormData]);

  const handleParentChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, parentId: value }));
  }, [setFormData]);

  const handleClassChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, classId: value }));
  }, [setFormData]);

  const options = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  function prepareStudentData(data: StudentCreate): StudentCreate {
    return {
      ...data,
      dateOfBirth: DateUtils.customFormatDateOnly(data.dateOfBirth)
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName
      || !formData.gender
      || !formData.classId
      || !formData.dateOfBirth) {
      setError("Tất cả các trường đều bắt buộc.");
      return;
    }
    setLoading(true);
    try {
      const submitData: StudentCreate = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        classId: formData.classId,
        image: formData.image,
      };
      const payload = prepareStudentData(submitData);
      const success = await FecthCreateStudents(formData.parentId, payload);
      if (success) {
        navigate("/dashboard/student");
        showToast.success("Cập nhật thành công");
      } else {
        throw new Error('Creation failed');
      }
    } catch (err) {
      setError(`Không thể tạo học sinh: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
      showToast.error(`Không thể tạo học sinh: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/student");
  }

  return (
    <div className="p-6 bg-white">
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : error ? (
        <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
          <p>{error}</p>
          {error.includes('authenticated') ? (
            <button
              onClick={() => window.location.href = '/login'}
              aria-label="Đăng nhập để tiếp tục"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng nhập
            </button>
          ) : (
            <button
              onClick={handleGetParent}
              aria-label="Thử lại tải dữ liệu phụ huynh"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800">
              Thêm học sinh mới
            </h3>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="p-4 border-t border-gray-100">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label>Phụ huynh</Label>
                    <SearchableSelect
                      options={parentOptions}
                      placeholder="Chọn phụ huynh"
                      onChange={handleParentChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="input-name">Họ và tên</Label>
                    <Input
                      type="text"
                      name="fullName"
                      id="input-name"
                      onChange={handleInputChange}
                      value={formData.fullName}
                      placeholder="Nhập họ và tên" />
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <Select
                      options={[{ value: "Male", label: "Nam" }, { value: "Female", label: "Nữ" }]}
                      placeholder="Chọn giới tính"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  <div>
                    <DatePicker
                      id="date-picker"
                      label="Ngày sinh"
                      placeholder="Chọn ngày sinh"
                      onChange={(dates, currentDateString) => {
                        setFormData((prev) => ({ ...prev, dateOfBirth: currentDateString }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="input-class">Lớp học</Label>
                    <SearchableSelect
                      options={classOptions}
                      placeholder="Chọn lớp học"
                      onChange={handleClassChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label>Tải lên ảnh</Label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 custom-class" />
                  </div>
                </div>
              </div>
              <div className="text-right mt-2">
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 w-[10%] hover:bg-blue-700 text-white py-2 rounded"
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  type="button"
                  className="mt-4 w-[10%] ml-4 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
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