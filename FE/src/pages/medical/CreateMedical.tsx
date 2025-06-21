import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import DatePicker from "@/components/ui/form/DateField";
import PageHeader from "@/components/ui/PageHeader";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { MedicalCreateViewModel } from "@/types/Medical";
import { toast, ToastContainer } from "react-toastify";
import { FecthCreateMedical } from "@/services/MedicalService";
import { DateUtils } from "@/utils/DateUtils";
import "react-toastify/dist/ReactToastify.css";

export default function CreateMedical() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MedicalCreateViewModel>({
    name: "",
    quantity: 0,
    expiryDate: "",
    detailInformation: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    expiryDate: "",
  });

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

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        setLoading(true);
        const submitData = {
          ...formData,
          expiryDate: DateUtils.customFormatDateForBackend(formData.expiryDate),
        };
        await FecthCreateMedical(submitData);
        toast.success("Thêm thuốc thành công");
        setTimeout(() => {
          navigate("/medical/manager-medical");
        }, 100);
      } catch (error) {
        console.error(error);
        toast.error("Thêm thuốc thất bại");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, validateForm]
  );

  const handleCancel = useCallback(() => {
    navigate("/medical/manager-medical");
  }, [navigate]);

  return (
    <div className="p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
      <PageHeader
        title="Thêm thuốc mới"
        icon={<Pill className="w-6 h-6 text-blue-600" />}
        description="Thêm thuốc mới vào kho"
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
              label="Hạn sữ dụng"
              placeholder="Select a date"
              defaultDate={
                formData.expiryDate ? new Date(formData.expiryDate) : undefined
              }
              onChange={(dates, currentDateString) => {
                console.log("DatePicker dates:", dates);
                console.log("DatePicker currentDateString:", currentDateString);
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
              {loading ? "Đang thêm..." : "Thêm thuốc"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
