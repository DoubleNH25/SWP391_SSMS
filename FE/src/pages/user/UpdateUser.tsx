import { EyeIcon, EyeCloseIcon } from "@/components/icons";
import Input from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import { FecthUpdateUsers, FecthUserById } from "@/services/UserService";
import { UserUpdate } from "@/types/User";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "@/components/ui/Toast";

export default function UpdateUser() {
  const { userId } = useParams<{ userId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UserUpdate>(
    {
      email: "",
      phone: "",
      fullName: "",
      password: ""
    }
  );
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    setLoading(true);
    if (!userId) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }
    try {
      const user = await FecthUserById(userId);
      if (user) {
        setFormData({
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          password: user.password
        });
        setError(null);
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      setError(err instanceof Error && err.message.includes('authenticated')
        ? 'Please log in to view user data.'
        : 'Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId, loadUser]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.email
        || !formData.phone
        || !formData.fullName) {
        throw new Error('Please fill in all required fields');
      }
      const success = await FecthUpdateUsers(userId as string, formData);
      if (success) {
        navigate('/dashboard/user');
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
    navigate("/dashboard/user");
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
              aria-label="Thử lại tải dữ liệu người dùng"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className={`bg-white`}
          >
            <div className="px-6 py-5">
              <h3 className="text-base font-medium text-gray-800">
                Cập nhật người dùng
              </h3>
              {error && (
                <div className="text-red-500 text-sm text-center mb-4">{error}</div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div className="p-4 border-t border-gray-100">
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="input-email">Email</Label>
                      <Input
                        name="email"
                        onChange={handleInputChange}
                        value={formData.email}
                        type="text"
                        id="input-email"
                        placeholder="Nhập email" />
                    </div>
                    <div>
                      <Label htmlFor="input-phone">Số điện thoại</Label>
                      <Input
                        name="phone"
                        onChange={handleInputChange}
                        value={formData.phone}
                        type="text"
                        id="input-phone"
                        placeholder="Nhập số điện thoại" />
                    </div>
                    <div>
                      <Label htmlFor="input-name">Họ và tên</Label>
                      <Input
                        name="fullName"
                        onChange={handleInputChange}
                        value={formData.fullName}
                        type="text"
                        id="input-name"
                        placeholder="Nhập họ và tên" />
                    </div>
                    <div>
                      <Label htmlFor="input-password">Mật khẩu</Label>
                      <div className="relative">
                        <Input
                          name="password"
                          onChange={handleInputChange}
                          value={formData.password}
                          id="input-password"
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
        </>
      )}
    </div>
  );
}