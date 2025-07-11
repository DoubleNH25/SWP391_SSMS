import Input from "@/components/ui/form/InputField";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import { EyeIcon, EyeCloseIcon } from "../../components/icons/index"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCreate } from "@/types/User";
import { FecthCreateUsers } from "@/services/UserService";
import { showToast } from "@/components/ui/Toast";
import { FecthRoles } from "@/services/RoleService";

export default function AddUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserCreate>(
    {
      email: "",
      phone: "",
      fullName: "",
      roleId: "",
      password: ""
    }
  );
  const navigate = useNavigate();

  useEffect(() => {
    handleGetRole();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, roleId: value }));
  };

  const handleGetRole = async () => {
    setLoading(true);
    try {
      const roles = await FecthRoles();
      const options = roles.map(role => ({
        value: role.id,
        label: role.roleName
      }));
      setRoleOptions(options);
      setError(null);
    } catch (err) {
      setError(err instanceof Error && err.message.includes('authenticated')
        ? 'Please log in to fetch parent data.'
        : 'Failed to fetch parent data. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email
      || !formData.phone
      || !formData.fullName
      || !formData.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const success = await FecthCreateUsers(formData);
      if (success) {
        showToast.success("Tạo người dùng thành công");
        navigate("/dashboard/user");
      } else {
        throw new Error('Creation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error && err.message.includes('authenticated')
        ? 'Please log in to create a user.'
        : `Failed to create user: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/user");
  }

  return (
    <div className="p-6 bg-white">
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800">
          Thêm người dùng mới
        </h3>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="input-email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="input-email"
                  onChange={handleInputChange}
                  value={formData.email}
                  placeholder="Nhập email" />
              </div>
              <div>
                <Label htmlFor="input-phone">Số điện thoại</Label>
                <Input
                  name="phone"
                  type="text"
                  id="input-phone"
                  onChange={handleInputChange}
                  value={formData.phone}
                  placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <Label htmlFor="input-name">Họ và tên</Label>
                <Input
                  name="fullName"
                  type="text"
                  id="input-name"
                  onChange={handleInputChange}
                  value={formData.fullName}
                  placeholder="Nhập họ và tên" />
              </div>
              <div>
                <Label>Vai trò</Label>
                <Select
                  options={roleOptions}
                  placeholder="Chọn vai trò"
                  onChange={handleSelectChange}
                  defaultValue={formData.roleId}
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label htmlFor="input-password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="input-password"
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 " />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500" />
                    )}
                  </button>
                </div>
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
    </div>
  );
}