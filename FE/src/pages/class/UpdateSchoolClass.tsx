import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import { FecthSchoolClassById, FecthUpdateSchoolClass } from "@/services/SchoolClassService";
import { SchoolClassCreateUpdateViewModel } from "@/types/SchoolClass";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";

export default function UpdateSchoolClass() {
  const { schoolClassId } = useParams<{ schoolClassId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SchoolClassCreateUpdateViewModel>(
    {
      className: "",
      classRoom: "",
      quantity: 0
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadSchoolClass = useCallback( async () => {
    setLoading(true);
    if (!schoolClassId) {
      setError("School Class ID is required.");
      setLoading(false);
      return;
    }
    try {
      const classes = await FecthSchoolClassById(schoolClassId);
      if (classes) {
        setFormData({
          className: classes.className,
          classRoom: classes.classRoom,
          quantity: classes.quantity,
        });
        setError(null);
      } else {
        throw new Error('Class not found');
      }
    } catch (err) {
      setError(err instanceof Error && err.message.includes('authenticated')
        ? 'Please log in to view class data.'
        : 'Failed to load class data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [schoolClassId]);

  useEffect(() => {
    if (schoolClassId) {
      loadSchoolClass();
    }
  }, [schoolClassId, loadSchoolClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.className
        || !formData.classRoom
        || !formData.quantity) {
        throw new Error('Please fill in all required fields');
      }
      if (!schoolClassId) {
        setError("School Class ID is required.");
        setLoading(false);
        return;
      }
      const success = await FecthUpdateSchoolClass(schoolClassId, formData);
      if (success) {
        navigate('/dashboard/class');
        showToast.success("Cập nhật thành công");
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred, please try again.';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/class");
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
              onClick={() => window.location.reload()}
              aria-label="Thử lại tải dữ liệu lớp học"
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
              Cập nhật lớp học
            </h3>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="p-4 border-t border-gray-100">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="input-name">Tên lớp</Label>
                    <Input
                      type="text"
                      name="className"
                      id="input-name"
                      onChange={handleInputChange}
                      value={formData.className}
                      placeholder="Nhập tên lớp" />
                  </div>
                  <div>
                    <Label htmlFor="input-class">Phòng học</Label>
                    <Input
                      type="text"
                      name="classRoom"
                      id="input-name"
                      onChange={handleInputChange}
                      value={formData.classRoom}
                      placeholder="Nhập phòng học" />
                  </div>
                  <div>
                    <Label htmlFor="input-class">Sĩ số</Label>
                    <Input
                      type="number"
                      name="quantity"
                      id="input-name"
                      min="0"
                      onChange={handleInputChange}
                      value={formData.quantity}
                      placeholder="Nhập sĩ số" />
                  </div>
                </div>
              </div>
              <div className="text-right mt-2">
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 w-[10%] hover:bg-blue-600 text-white py-2 rounded"
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  disabled={loading}
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