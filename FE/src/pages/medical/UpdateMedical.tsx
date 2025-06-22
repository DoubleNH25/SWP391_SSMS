import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { MedicalUpdateViewModel } from "@/types/Medical";
import {
  FecthMedicalById,
  FecthUpdateMedical,
} from "@/services/MedicalService";
import { showToast } from "@/components/ui/Toast";
import PageHeader from "@/components/ui/PageHeader";
import { Pill } from "lucide-react";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import DatePicker from "@/components/ui/form/DateField";
import { Button } from "@/components/ui/button";
import { DateUtils } from "@/utils/DateUtils";

export default function UpdateMedical() {
  const navigate = useNavigate();
  const { medicalId } = useParams<{ medicalId: string }>();
  const [formData, setFormData] = useState<MedicalUpdateViewModel>({
    name: "",
    quantity: 0,
    expiryDate: "",
    detailInformation: "",
    status: "Available",
  });
  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedical = useCallback(async () => {
    try {
      const response = await FecthMedicalById(medicalId!);
      setFormData({
        name: response.name || "",
        quantity: response.quantity || 0,
        expiryDate: response.expiryDate || "",
        detailInformation: response.detailInformation || "",
        status: "Available",
      });
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error && error.message.includes("authenticated")
          ? "Vui lòng đăng nhập để xem thông tin thuốc."
          : "Đã xảy ra lỗi khi tải thông tin thuốc."
      );
    } finally {
      setLoading(false);
    }
  }, [medicalId]);

  useEffect(() => {
    fetchMedical();
  }, [fetchMedical]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "quantity") {
        const numValue = parseInt(value);
        if (numValue < 0) return;
        setFormData((prev) => ({ ...prev, [name]: numValue }));
        setErrors((prev) => ({ ...prev, quantity: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    },
    []
  );

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      name: "",
      quantity: "",
      expiryDate: "",
      status: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên thuốc";
      isValid = false;
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
      isValid = false;
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Vui lòng chọn hạn sử dụng";
      isValid = false;
    }
    if (!formData.status) {
      newErrors.status = "Vui lòng chọn trạng thái";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        setLoading(true);
        const medicalUpdate: MedicalUpdateViewModel = {
          name: formData.name,
          quantity: formData.quantity,
          expiryDate: DateUtils.customFormatDateForBackend(formData.expiryDate),
          detailInformation: formData.detailInformation,
          status: formData.status as "Available" | "OutOfStock",
        };
        await FecthUpdateMedical(medicalId!, medicalUpdate);
        showToast.success("Cập nhật thuốc thành công");
        setTimeout(() => {
          navigate("/dashboard/medical/manager-medical");
        }, 100);
      } catch (error) {
        console.error(error);
        showToast.error("Cập nhật thuốc thất bại");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, medicalId, validateForm]
  );

  const handleCancel = useCallback(() => {
    navigate("/dashboard/medical/manager-medical");
  }, [navigate]);

  if (loading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center text-red-500 p-4 bg-red-100 rounded">
          <p>{error}</p>
          {error.includes("authenticated") ? (
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng nhập
            </button>
          ) : (
            <button
              onClick={fetchMedical}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Cập nhật thuốc"
        icon={<Pill className="w-6 h-6 text-blue-600" />}
        description="Cập nhật thông tin thuốc"
      />
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                Tên thuốc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Nhập tên thuốc"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">
                Số lượng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                name="quantity"
                placeholder="Nhập số lượng"
                value={formData.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && (
                <span className="text-sm text-red-500">{errors.quantity}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <DatePicker
              id="date-picker"
              minDate={DateUtils.customFormatDateOnly(new Date())}
              maxDate="9999-12-31"
              label="Hạn sử dụng"
              placeholder="Select a date"
              defaultDate={
                formData.expiryDate ? new Date(formData.expiryDate) : undefined
              }
              onChange={(dates, currentDateString) => {
                console.log(dates);
                setFormData((prev) => ({
                  ...prev,
                  expiryDate: currentDateString,
                }));
              }}
            />
            {errors.expiryDate && (
              <span className="text-sm text-red-500">{errors.expiryDate}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="detailInformation">Mô tả</Label>
            <textarea
              id="detailInformation"
              className="w-full h-32 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="detailInformation"
              placeholder="Nhập mô tả về thuốc"
              value={formData.detailInformation}
              onChange={handleTextAreaChange}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="px-6"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600 px-6"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật thuốc"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
